import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signToken, verifyPendingToken } from '@/lib/auth';
import { withSessionCookie } from '@/lib/session-cookie';

const BodySchema = z.object({
  pendingToken: z.string().min(1),
  otp: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Login code and session are required.' },
        { status: 400 }
      );
    }

    const pending = verifyPendingToken(parsed.data.pendingToken);
    if (!pending || pending.purpose !== '2fa_pending') {
      return NextResponse.json(
        { success: false, message: 'Session expired. Please log in again.' },
        { status: 401 }
      );
    }

    const { otp } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: pending.userId } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        userId: user.id,
        purpose: OtpPurpose.EMAIL_TWO_FACTOR,
        token: otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired login code.' },
        { status: 401 }
      );
    }

    await prisma.otpToken.update({ where: { id: otpRecord.id }, data: { used: true } });

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }

    const token = signToken({ userId: user.id, role: user.role });

    return withSessionCookie(
      { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      token
    );
  } catch (error) {
    console.error('Login 2FA verify error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
