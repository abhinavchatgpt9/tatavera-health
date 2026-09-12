import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  country: z.string().min(2).max(100),
  procedure: z.string().min(1).max(200),
  message: z.string().optional(),
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
    // Attach the submission to the logged-in patient, if any, so admins can
    // trace it back to an existing account instead of treating every
    // submission as an anonymous, unrelated contact.
    const auth = getAuthUser(req);

    const enquiry = await prisma.enquiry.create({
      data: {
        userId: auth?.role === 'PATIENT' ? auth.userId : undefined,
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
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
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
