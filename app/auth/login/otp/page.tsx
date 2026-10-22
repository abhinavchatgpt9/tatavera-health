'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useRouter } from 'next/navigation';
import { portalPathForRole } from '@/lib/portal-routes';

const STORAGE_KEY = 'tatavera_login_2fa';

type Login2faPayload = {
  pendingToken: string;
  email: string;
  debugOtp?: string;
  savedAt: number;
};

export default function LoginOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | undefined>();
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        router.replace('/auth/login');
        return;
      }
      const data = JSON.parse(raw) as Login2faPayload;
      if (!data.pendingToken || !data.email) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.replace('/auth/login');
        return;
      }
      // Pending token expires server-side in ~10m; stale UI guard (optional)
      if (Date.now() - (data.savedAt || 0) > 12 * 60 * 1000) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.replace('/auth/login');
        return;
      }
      setPendingToken(data.pendingToken);
      setEmail(data.email);
      setDebugOtp(data.debugOtp);
    } catch {
      router.replace('/auth/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToken) return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/login/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pendingToken, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.push(portalPathForRole(data.user?.role));
        return;
      }
      setError(data.message || 'Invalid code');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push('/auth/login');
  };

  if (!pendingToken && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <BrandLogo theme="light" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Check your email</h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>. Enter it below to
            finish signing in.
          </p>

          {debugOtp && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm">
              <strong className="font-semibold">Development only:</strong> your code is{' '}
              <code className="font-mono font-bold tracking-widest">{debugOtp}</code>. In production this is only sent
              by email (Resend/SMTP).
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email verification code</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-center text-xl tracking-widest"
                placeholder="• • • • • •"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || otp.length !== 6}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors"
            >
              {status === 'loading' ? 'Verifying…' : 'Verify & log in'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to email & password
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Code also appears in the terminal where <code className="text-gray-600">npm run dev</code> is running if
            email is not configured.
          </p>
        </div>
      </div>
    </div>
  );
}
