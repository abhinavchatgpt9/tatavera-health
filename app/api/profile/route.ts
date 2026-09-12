import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { getAuthUser, hashPassword, verifyPassword } from '@/lib/auth';

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(32).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  language: z.string().max(16).optional(),
  emergencyContact: z.string().max(200).optional().or(z.literal('')),
  // Changing the password requires proving you know the current one.
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

// GET /api/profile — the signed-in user's own profile
// Auth: required. Any role.
export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      country: true,
      language: true,
      emergencyContact: true,
      avatarUrl: true,
      emailVerified: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ success: true, user });
}

// PUT /api/profile — update your own profile, optionally your password
// Auth: required. Any role. A user can only ever change their own record.
export async function PUT(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const parsed = UpdateProfileSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, ...fields } = parsed.data;

    const data: Record<string, unknown> = {};
    if (fields.name !== undefined) data.name = fields.name;
    if (fields.phone !== undefined) data.phone = fields.phone || null;
    if (fields.country !== undefined) data.country = fields.country || null;
    if (fields.language !== undefined) data.language = fields.language;
    if (fields.emergencyContact !== undefined) data.emergencyContact = fields.emergencyContact || null;

    if (newPassword) {
      const existing = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { passwordHash: true },
      });

      // An account created via phone OTP has no password yet, so there is
      // nothing to verify against — setting one for the first time is allowed.
      if (existing?.passwordHash) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, message: 'Enter your current password to set a new one.' },
            { status: 400 }
          );
        }
        const valid = await verifyPassword(currentPassword, existing.passwordHash);
        if (!valid) {
          return NextResponse.json({ success: false, message: 'Current password is incorrect.' }, { status: 400 });
        }
      }

      data.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, message: 'Nothing to update.' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        language: true,
        emergencyContact: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'That phone number is already used by another account.' },
        { status: 409 }
      );
    }
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update profile.' }, { status: 500 });
  }
}
