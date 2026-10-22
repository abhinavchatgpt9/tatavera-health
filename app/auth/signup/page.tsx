'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useRouter } from 'next/navigation';

const COUNTRIES = ['Afghanistan', 'Algeria', 'Angola', 'Bahrain', 'Cameroon', 'Congo', 'Egypt', 'Ethiopia', 'Ghana', 'Iraq', 'Jordan', 'Kenya', 'Kuwait', 'Lebanon', 'Libya', 'Morocco', 'Nigeria', 'Oman', 'Pakistan', 'Qatar', 'Russia', 'Saudi Arabia', 'Senegal', 'South Africa', 'Sudan', 'Syria', 'Tanzania', 'Tunisia', 'UAE', 'Uganda', 'Ukraine', 'Yemen', 'Zambia', 'Zimbabwe', 'Other'];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', password: '' });
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [verifyOtp, setVerifyOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.needsEmailVerification && data.pendingToken) {
        setPendingToken(data.pendingToken);
        setStep('verify');
        setVerifyOtp('');
        setStatus('idle');
        return;
      }
      if (res.ok && data.success) {
        router.push('/dashboard');
        return;
      }
      setError(data.message || 'Signup failed. Please try again.');
      setStatus('error');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToken) return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pendingToken, otp: verifyOtp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/dashboard');
        return;
      }
      setError(data.message || 'Invalid code');
      setStatus('error');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <BrandLogo theme="light" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {step === 'verify' ? 'Verify your email' : 'Create your account'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {step === 'verify'
              ? `We sent a 6-digit code to ${form.email}. Enter it below to activate your account.`
              : 'Track your case, upload reports, and chat with your case manager.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification code</label>
                <input
                  required
                  type="text"
                  value={verifyOtp}
                  onChange={(e) => setVerifyOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-center text-xl tracking-widest"
                  placeholder="• • • • • •"
                  autoComplete="one-time-code"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors mt-2"
              >
                {status === 'loading' ? 'Verifying…' : 'Verify & continue'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setPendingToken(null);
                  setVerifyOtp('');
                  setError('');
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to details
              </button>
            </form>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
              <input
                required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <select
                required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="Min. 8 characters"
              />
            </div>
            <button
              type="submit" disabled={status === 'loading'}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors mt-2"
            >
              {status === 'loading' ? 'Creating Account…' : 'Create Free Account'}
            </button>
          </form>
          )}

          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Use</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-3">
            <Link href="/" className="hover:underline">Continue without signing up →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
