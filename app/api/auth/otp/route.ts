import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateOtp } from '@/lib/auth';
import { sendSmsOtp } from '@/lib/sms';

const SendOtpSchema = z.object({ phone: z.string().min(7).max(20) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Valid phone number required.' }, { status: 400 });
    }

    const { phone } = parsed.data;

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      // Auto-create account for new phone users
      user = await prisma.user.create({
        data: { name: 'Patient', email: `${phone.replace(/\D/g, '')}@tataverahealth.com`, phone },
      });
      await prisma.patientCase.create({ data: { userId: user.id } });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpToken.create({
      data: { userId: user.id, token: otp, purpose: OtpPurpose.PHONE_LOGIN, expiresAt },
    });

    const smsBody = `Your Tatavera Health login code is ${otp}. It expires in 10 minutes.`;
    try {
      const sent = await sendSmsOtp(phone, smsBody);
      if (!sent && process.env.NODE_ENV === 'development') {
        console.log(`[sms:dev] OTP for ${phone}: ${otp}`);
      } else if (!sent) {
        return NextResponse.json(
          {
            success: false,
            message:
              'SMS is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to .env, or use Email & Password login with email 2FA.',
          },
          { status: 503 }
        );
      }
    } catch (e) {
      console.error('SMS OTP error:', e);
      return NextResponse.json(
        { success: false, message: 'Failed to send SMS. Check Twilio credentials and phone format.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your phone number.',
      ...(process.env.NODE_ENV === 'development' && { debug_otp: otp }),
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send OTP.' }, { status: 500 });
  }
}
