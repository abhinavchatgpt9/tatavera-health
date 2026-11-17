import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Supabase free projects pause after ~7 days without activity.
// Vercel Cron calls this once a day (see vercel.json) so the database always has recent traffic.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" automatically when CRON_SECRET is set.
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (err) {
    console.error('keepalive failed', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
