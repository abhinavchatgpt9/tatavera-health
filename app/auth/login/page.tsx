'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useRouter } from 'next/navigation';
import { portalPathForRole } from '@/lib/portal-routes';

const LOGIN_2FA_STORAGE = 'tatavera_login_2fa';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json();
      if (res.ok && data.requiresTwoFactor && data.pendingToken) {
        try {
          sessionStorage.setItem(
            LOGIN_2FA_STORAGE,
            JSON.stringify({
              pendingToken: data.pendingToken,
              email: data.user?.email || email,
              debugOtp: data.debugOtp,
              savedAt: Date.now(),
            })
          );
        } catch {
          setError('Could not start 2FA session. Allow storage or try another browser.');
          setStatus('error');
          return;
        }
        setStatus('idle');
        router.push('/auth/login/otp');
        return;
      }
      if (res.ok && data.success) {
        setStatus('idle');
        router.push(portalPathForRole(data.user?.role));
        return;
      }
      if (data.code === 'EMAIL_NOT_VERIFIED') {
        setError(
          data.message ||
            'Verify your email using the code we sent when you signed up, then try logging in again.'
        );
        setStatus('error');
        return;
      }
      setError(data.message || 'Login failed');
      setStatus('error');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const handleSendOtp = async () => {
    setError('');
    if (phone.trim().replace(/[^\d]/g, '').length < 7) {
      setError('Enter a valid phone number.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setStatus('idle');
      } else {
        setError(data.message || 'Failed to send OTP');
        setStatus('error');
      }
    } catch {
      setError('Network error.');
      setStatus('error');
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit code.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(portalPathForRole(data.user?.role));
      } else {
        setError(data.message || 'Invalid OTP');
        setStatus('error');
      }
    } catch {
      setError('Network error.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Simple top bar */}
      <div className="px-6 py-5">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <BrandLogo theme="light" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Log in to track your case and access your reports.</p>

          {/* Phone OTP login is switched off for now; only email + password is offered. */}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {tab === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                </div>
                <input
                  required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit" disabled={status === 'loading'}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors"
              >
                {status === 'loading' ? 'Logging in…' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="flex gap-2">
                  <input
                    required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-gray-50"
                    placeholder="+1 234 567 890"
                  />
                  {!otpSent && (
                    <button
                      type="button" onClick={handleSendOtp} disabled={status === 'loading' || !phone}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                    >
                      Send OTP
                    </button>
                  )}
                </div>
              </div>
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">6-digit OTP</label>
                  <input
                    required type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-center text-xl tracking-widest"
                    placeholder="• • • • • •"
                  />
                </div>
              )}
              {otpSent && (
                <button
                  type="submit" disabled={status === 'loading'}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors"
                >
                  {status === 'loading' ? 'Verifying…' : 'Verify & Log In'}
                </button>
              )}
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up — it&apos;s free
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            <Link href="/" className="hover:underline">Continue browsing without logging in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
