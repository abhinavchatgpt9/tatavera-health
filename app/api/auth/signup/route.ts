import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateOtp, hashPassword, signPendingToken } from '@/lib/auth';
import { sendSignupVerificationEmail } from '@/lib/email';
import { normalizeEmail } from '@/lib/user-email';

const SignupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  country: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { name, phone, country, password } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email, mode: 'insensitive' } }, ...(phone ? [{ phone }] : [])],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email or phone already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, phone, country, passwordHash },
    });

    await prisma.patientCase.create({ data: { userId: user.id } });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpToken.create({
      data: { userId: user.id, token: otp, purpose: OtpPurpose.EMAIL_SIGNUP_VERIFY, expiresAt },
    });

    try {
      await sendSignupVerificationEmail(email, otp);
    } catch (e) {
      console.error('Signup email OTP error:', e);
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      return NextResponse.json(
        {
          success: false,
          message:
            'Could not send verification email. Configure RESEND_API_KEY or SMTP in .env (see .env.example).',
        },
        { status: 503 }
      );
    }

    const pendingToken = signPendingToken(user.id, 'signup_verify');

    return NextResponse.json(
      {
        success: true,
        needsEmailVerification: true,
        message: 'Check your email for a 6-digit code to finish signing up.',
        pendingToken,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
