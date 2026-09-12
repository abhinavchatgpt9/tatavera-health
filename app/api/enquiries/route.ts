import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const EnquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  country: z.string().min(2).max(100),
  treatment: z.string().optional(),
  message: z.string().optional(),
  agreeTerms: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EnquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Please fill all required fields correctly.' },
        { status: 400 }
      );
    }

    const { name, email, phone, country, treatment, message } = parsed.data;
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const auth = getAuthUser(req);

    const enquiry = await prisma.enquiry.create({
      data: {
        userId: auth?.role === 'PATIENT' ? auth.userId : undefined,
        name,
        email,
        phone,
        country,
        message,
        ipAddress: ip,
        userAgent,
        source: req.headers.get('referer') || 'direct',
      },
    });

    // TODO: Send notification email to team (SendGrid/Mailgun)
    // TODO: Send confirmation email to patient
    // TODO: Push to CRM (HubSpot/Zoho webhook)

    console.log('New enquiry:', { id: enquiry.id, name, email, treatment });

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been received. Our team will contact you within 24 hours.',
        enquiryId: enquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try WhatsApp or email instead.' },
      { status: 500 }
    );
  }
}
