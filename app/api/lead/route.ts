import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isValidE164 } from '@/lib/phone';
import { getAuthUser } from '@/lib/auth';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';
import { MIN_OTHER_DESCRIPTION, OTHER_TREATMENT_LABEL, enquiryReference } from '@/lib/enquiry';
import { sendEnquiryNotification } from '@/lib/email';

/** An identical enquiry (same email, phone and text) inside this window is treated as a repeat click, not a new request. */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

const LeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(254),
  phone: z.string().trim().refine(isValidE164, 'Please enter a valid phone number'),
  country: z.string().trim().min(2, 'Country is required').max(100),
  procedure: z.string().trim().min(1, 'Please select a treatment').max(200),
  message: z.string().trim().max(2000, 'Message is too long').optional(),
  contactVia: z.string().trim().max(40).optional(),
  doctor: z.string().trim().max(150).optional(),
  hospital: z.string().trim().max(150).optional(),
  agreeTerms: z.boolean(),
  // Hidden field real visitors never fill; automated form fillers often do.
  website: z.string().max(200).optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json({ success: false, message: msg }, { status: 400 });
    }

    if (!parsed.data.agreeTerms) {
      return NextResponse.json({ success: false, message: 'Please agree to the Privacy Policy and Terms.' }, { status: 400 });
    }

    // Bot trap: pretend it worked, store nothing.
    if (parsed.data.website) {
      return NextResponse.json({ success: true, message: 'Your request was received.', data: { reference: '' } }, { status: 201 });
    }

    const { name, email, phone, country, procedure, message, contactVia, doctor, hospital } = parsed.data;

    if (procedure === OTHER_TREATMENT_LABEL && (message?.length ?? 0) < MIN_OTHER_DESCRIPTION) {
      return NextResponse.json(
        { success: false, message: 'Please describe the treatment you need in a few words.' },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    // Attach the submission to the logged-in patient, if any, so admins can
    // trace it back to an existing account instead of treating every
    // submission as an anonymous, unrelated contact.
    const auth = getAuthUser(req);

    const storedMessage =
      `[Treatment: ${procedure}]` +
      (doctor ? ` [Doctor: ${doctor}]` : '') +
      (hospital ? ` [Hospital: ${hospital}]` : '') +
      (contactVia ? ` [Contact via: ${contactVia}]` : '') +
      (message ? ' ' + message : '');

    // Repeat click or double submit: return the enquiry we already saved instead of creating a second one.
    const existing = await prisma.enquiry.findFirst({
      where: { email, phone, message: storedMessage, createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message: `Your request was received. Our team will call you back ${CALLBACK_TIMEFRAME}.`,
          data: { id: existing.id, reference: enquiryReference(existing.id) },
        },
        { status: 200 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        userId: auth?.role === 'PATIENT' ? auth.userId : undefined,
        name,
        email,
        phone,
        country,
        message: storedMessage,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'unknown',
        source: req.headers.get('referer') || 'lead-form',
      },
    });

    // The enquiry is already saved, so a failed email never fails the request. The team can always find it in the
    // enquiry dashboard; the email is an extra alert (it needs RESEND_API_KEY or SMTP settings on the server).
    await sendEnquiryNotification({
      reference: enquiryReference(enquiry.id),
      name,
      phone,
      email,
      country,
      treatment: procedure,
      doctor,
      hospital,
      contactVia,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Your request was received. Our team will call you back ${CALLBACK_TIMEFRAME}.`,
        data: { id: enquiry.id, reference: enquiryReference(enquiry.id), createdAt: enquiry.createdAt },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead error:', error);
    // Prisma reports connection problems as PrismaClientInitializationError (`errorCode`)
    // and query problems as PrismaClientKnownRequestError (`code`).
    const err = error as { code?: string; errorCode?: string; message?: string } | null;
    const prismaCode = err?.errorCode ?? err?.code;
    const dbDown =
      (prismaCode && ['P1000', 'P1001', 'P1002', 'P1003', 'P1017', 'P2021', 'P2022'].includes(prismaCode)) ||
      /Can't reach database|Authentication failed|does not exist|PrismaClientInitializationError/i.test(err?.message ?? '');
    if (dbDown) {
      return NextResponse.json(
        {
          success: false,
          message: 'Our system is temporarily unavailable. Please try again shortly or contact us on WhatsApp.',
          ...(process.env.NODE_ENV !== 'production' && { debug: `${prismaCode ?? 'DB'}: ${(err?.message ?? '').slice(-400)}` }),
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred. Please try again.',
        ...(process.env.NODE_ENV !== 'production' && { debug: String((error as Error)?.message ?? error).slice(-400) }),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
