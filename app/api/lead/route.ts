import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { isValidE164 } from '@/lib/phone';

const LeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email').max(254),
  phone: z.string().trim().refine(isValidE164, 'Please enter a valid phone number'),
  country: z.string().trim().min(2, 'Country is required').max(100),
  procedure: z.string().trim().min(1, 'Please select a procedure').max(200),
  message: z.string().trim().max(2000, 'Message is too long').optional(),
  agreeTerms: z.boolean(),
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
      return NextResponse.json({ success: false, message: 'Please agree to the terms.' }, { status: 400 });
    }

    const { name, email, phone, country, procedure, message } = parsed.data;
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        country,
        message: `[Treatment: ${procedure}]${message ? ' ' + message : ''}`,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'unknown',
        source: req.headers.get('referer') || 'lead-form',
      },
    });

    // TODO: Send team notification email
    // TODO: Send patient confirmation email
    // TODO: Push to CRM

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry was submitted. Our team will contact you within 24 hours.',
        data: { id: enquiry.id, name, email, createdAt: enquiry.createdAt },
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
