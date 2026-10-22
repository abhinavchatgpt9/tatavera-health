import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import {
  isAllowedAttachmentMimeType,
  isAttachmentFileSizeValid,
  uploadConsultAttachment,
  MAX_ATTACHMENT_FILE_SIZE,
} from '@/lib/consult-attachment';

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

/** Coerces the string/"true"/"false" values a <form> FormData submission carries into the shape Schema expects. */
function parseFormFields(formData: FormData): Record<string, unknown> {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  };

  return {
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    country: get('country'),
    specialty: get('specialty'),
    condition: get('condition'),
    date: get('date'),
    timeSlot: get('timeSlot'),
    preferWhatsApp: formData.has('preferWhatsApp') ? get('preferWhatsApp') === 'true' : undefined,
    hospital: get('hospital'),
    doctor: get('doctor'),
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    // A request body can only be consumed once, so read formData() a single
    // time up top and pull both the text fields and the file out of it.
    const formData = isMultipart ? await req.formData() : null;
    const body = formData ? parseFormFields(formData) : await req.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid data' },
        { status: 400 }
      );
    }

    let attachment: { key: string; name: string; size: number } | null = null;
    if (formData) {
      const file = formData.get('attachment') as File | null;

      if (file && file.size > 0) {
        if (!isAttachmentFileSizeValid(file.size)) {
          return NextResponse.json(
            { success: false, message: `Attachment too large. Max ${MAX_ATTACHMENT_FILE_SIZE / (1024 * 1024)} MB.` },
            { status: 400 }
          );
        }
        if (!isAllowedAttachmentMimeType(file.type)) {
          return NextResponse.json(
            { success: false, message: 'Invalid attachment type. PDF, JPG, PNG only.' },
            { status: 400 }
          );
        }
        attachment = await uploadConsultAttachment(file);
      }
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
        ...(attachment && {
          attachmentKey: attachment.key,
          attachmentName: attachment.name,
          attachmentSize: attachment.size,
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Consult booking error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save request.' }, { status: 500 });
  }
}
