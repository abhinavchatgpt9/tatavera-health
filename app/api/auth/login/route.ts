import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OtpPurpose } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { generateOtp, signPendingToken, signToken, verifyPassword } from '@/lib/auth';
import { sendTwoFactorEmail } from '@/lib/email';
import { normalizeEmail } from '@/lib/user-email';
import { withSessionCookie } from '@/lib/session-cookie';

function exposeLoginOtpInJson(): boolean {
  if (process.env.AUTH_HIDE_DEBUG_OTP === '1' || process.env.AUTH_HIDE_DEBUG_OTP === 'true') {
    return false;
  }
  if (process.env.AUTH_RETURN_OTP === '1' || process.env.AUTH_RETURN_OTP === 'true') {
    return true;
  }
  return process.env.NODE_ENV !== 'production';
}

// Temporary switch: email 2FA is disabled by default while email delivery
// gets set up. Set AUTH_REQUIRE_2FA=1 in the environment to turn it back on
// without reverting this file — the verify-2fa route and OTP UI are untouched.
function requireTwoFactor(): boolean {
  return process.env.AUTH_REQUIRE_2FA === '1' || process.env.AUTH_REQUIRE_2FA === 'true';
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const { password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (!requireTwoFactor()) {
      // Direct login: skip the email OTP step entirely and issue a session
      // right away. See requireTwoFactor() above to re-enable 2FA.
      const token = signToken({ userId: user.id, role: user.role });
      return withSessionCookie(
        { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
        token
      );
    }

    // Email is proven by receiving this OTP; verify-2fa sets emailVerified if it was still null.
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpToken.create({
      data: { userId: user.id, token: otp, purpose: OtpPurpose.EMAIL_TWO_FACTOR, expiresAt },
    });

    await sendTwoFactorEmail(user.email, otp);

    const pendingToken = signPendingToken(user.id, '2fa_pending');

    return NextResponse.json({
      success: true,
      requiresTwoFactor: true,
      message:
        'Enter the 6-digit code (check email, or server terminal line [tatavera-otp], or debugOtp in this response when enabled).',
      pendingToken,
      user: { id: user.id, name: user.name, email: user.email },
      ...(exposeLoginOtpInJson() && { debugOtp: otp }),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
