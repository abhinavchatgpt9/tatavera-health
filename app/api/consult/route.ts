import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const Schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  country: z.string().min(2).max(60),
  specialty: z.string().min(2).max(100),
  condition: z.string().max(500).optional(),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  preferWhatsApp: z.boolean().optional(),
  hospital: z.string().max(150).optional(),
  doctor: z.string().max(150).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid data' },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const message = [
      d.specialty,
      d.condition ? `Condition: ${d.condition}` : null,
      d.doctor ? `Doctor: ${d.doctor}` : null,
      d.hospital ? `Hospital: ${d.hospital}` : null,
      d.date && d.timeSlot ? `Preferred: ${d.date} at ${d.timeSlot}` : null,
      d.preferWhatsApp !== undefined ? `Contact via: ${d.preferWhatsApp ? 'WhatsApp' : 'Email/Video'}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const auth = getAuthUser(req);
    await prisma.enquiry.create({
      data: {
        userId: auth?.role === 'PATIENT' ? auth.userId : undefined,
        name: d.name,
        email: d.email,
        phone: d.phone,
        country: d.country,
        message,
        source: 'appointment_modal',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Consult booking error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save request.' }, { status: 500 });
  }
}
