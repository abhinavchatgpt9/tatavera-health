import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { withSessionCookie } from '@/lib/session-cookie';

const VerifyOtpSchema = z.object({
  phone: z.string().min(7).max(20),
  otp: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Phone and 6-digit OTP are required.' }, { status: 400 });
    }

    const { phone, otp } = parsed.data;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        purpose: OtpPurpose.PHONE_LOGIN,
        token: otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP.' }, { status: 401 });
    }

    await prisma.otpToken.update({ where: { id: otpRecord.id }, data: { used: true } });

    if (!user.phoneVerified) {
      await prisma.user.update({ where: { id: user.id }, data: { phoneVerified: new Date() } });
    }

    const token = signToken({ userId: user.id, role: user.role });

    return withSessionCookie(
      { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      token
    );
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
