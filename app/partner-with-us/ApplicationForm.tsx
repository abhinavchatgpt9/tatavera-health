'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function ApplicationForm() {
  const [form, setForm] = useState({
    requestedRole: 'DOCTOR' as 'DOCTOR' | 'HOSPITAL_ADMIN',
    name: '',
    email: '',
    phone: '',
    organizationName: '',
    city: '',
    country: '',
    specialtyOrType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/staff-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        return;
      }
      setError(data.message || 'Could not submit your application. Please try again.');
      setStatus('error');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Application received</h2>
        <p className="text-gray-600">
          Our team reviews applications within 1–2 business days. We&apos;ll reach out at the email you gave us
          with your portal login once approved. Questions in the meantime? WhatsApp us at{' '}
          <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} className="text-green-600 font-medium hover:underline">
            {WHATSAPP_NUMBER}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">I am applying as *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['DOCTOR', 'HOSPITAL_ADMIN'] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm({ ...form, requestedRole: role })}
              className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                form.requestedRole === role
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {role === 'DOCTOR' ? 'A Doctor' : 'A Hospital'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Dr. Jane Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {form.requestedRole === 'DOCTOR' ? 'Specialty *' : 'Hospital type *'}
          </label>
          <input required value={form.specialtyOrType} onChange={(e) => setForm({ ...form, specialtyOrType: e.target.value })} className={inputClass} placeholder={form.requestedRole === 'DOCTOR' ? 'Cardiology' : 'Multi-specialty'} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {form.requestedRole === 'DOCTOR' ? 'Hospital / clinic name *' : 'Hospital name *'}
        </label>
        <input required value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} className={inputClass} placeholder="Apollo Hospitals, Chennai" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="you@hospital.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
          <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+91 98765 43210" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Anything else we should know?</label>
        <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} placeholder="Accreditations, patient volume, areas of interest…" />
      </div>

      <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors text-base">
        {status === 'loading' ? 'Submitting…' : 'Submit Application'}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          {error || 'Something went wrong.'} Or email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
        </p>
      )}
    </form>
  );
}
