'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { PROCEDURES } from '@/lib/constants';
import AnimateIn from '@/components/AnimateIn';
import PhoneInput from '@/components/PhoneInput';
import { COUNTRY_OPTIONS, countryName, validatePhone } from '@/lib/phone';
import type { CountryCode } from 'libphonenumber-js/max';

interface FormData {
  name: string;
  email: string;
  phone: string;
  phoneCountry: CountryCode;
  country: string;
  procedure: string;
  message: string;
  agreeTerms: boolean;
}

interface FormErrors { [key: string]: string; }

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', phoneCountry: 'KE', country: '', procedure: '', message: '', agreeTerms: false,
  });
  const [phoneCodeTouched, setPhoneCodeTouched] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const e: FormErrors = {};
    const name = formData.name.trim();
    if (!name) e.name = 'Name is required';
    else if (!/^[\p{L}][\p{L}\s.'’-]{1,99}$/u.test(name)) e.name = 'Enter your full name (letters only, at least 2 characters)';
    const email = formData.email.trim();
    if (!email) e.email = 'Email is required';
    else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Please enter a valid email';
    const phone = validatePhone(formData.phone, formData.phoneCountry);
    if (!phone.ok) e.phone = phone.message;
    if (!formData.country) e.country = 'Country is required';
    if (formData.message.length > 2000) e.message = 'Please keep this under 2000 characters';
    if (!formData.procedure) e.procedure = 'Please select a procedure';
    if (!formData.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const iso = e.target.value as CountryCode | '';
    setFormData((prev) => ({
      ...prev,
      country: iso ? countryName(iso) : '',
      // Follow the residence country for the phone code until the user picks a code themselves.
      phoneCountry: iso && !phoneCodeTouched ? iso : prev.phoneCountry,
    }));
    if (errors.country) setErrors((prev) => { const n = { ...prev }; delete n.country; return n; });
  };

  const handlePhoneChange = (iso: CountryCode, value: string) => {
    if (iso !== formData.phoneCountry) setPhoneCodeTouched(true);
    setFormData((prev) => ({ ...prev, phoneCountry: iso, phone: value }));
    if (errors.phone) setErrors((prev) => { const n = { ...prev }; delete n.phone; return n; });
  };

  const validatePhoneOnBlur = () => {
    if (!formData.phone) return;
    const r = validatePhone(formData.phone, formData.phoneCountry);
    setErrors((prev) => { const n = { ...prev }; if (r.ok) delete n.phone; else n.phone = r.message; return n; });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    const phone = validatePhone(formData.phone, formData.phoneCountry);
    if (!phone.ok) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: phone.e164,
          country: formData.country,
          procedure: formData.procedure,
          message: formData.message.trim(),
          agreeTerms: formData.agreeTerms,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit form');
      }
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', phoneCountry: 'KE', country: '', procedure: '', message: '', agreeTerms: false });
      setPhoneCodeTouched(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(37 99 235) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up" className="text-center mb-10">
          <span className="section-label">Free Consultation</span>
          <h2 className="section-title">Get Your Free Medical Consultation</h2>
          <p className="section-subtitle text-center">
            No commitment. No cost. Our medical team will assess your case within 24 hours.
          </p>
        </AnimateIn>

        <AnimateIn variant="scale-in" delay={100}>
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-slate-900/50 p-8 md:p-10">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded-2xl flex gap-3">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-semibold">Request Received!</p>
                  <p className="text-sm">Our team will contact you within 24 hours to discuss your options.</p>
                </div>
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-2xl text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="label-field">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="John Smith" disabled={isSubmitting}
                    className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="label-field">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="john@example.com" disabled={isSubmitting}
                    className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="label-field">Phone Number</label>
                  <PhoneInput id="phone" iso={formData.phoneCountry} value={formData.phone}
                    onChange={handlePhoneChange} onBlur={validatePhoneOnBlur}
                    error={errors.phone} disabled={isSubmitting} />
                </div>
                <div>
                  <label htmlFor="country" className="label-field">Country</label>
                  <select id="country" name="country"
                    value={COUNTRY_OPTIONS.find((c) => c.name === formData.country)?.iso ?? ''}
                    onChange={handleCountryChange} disabled={isSubmitting}
                    className={`input-field ${errors.country ? 'border-red-400' : ''}`}>
                    <option value="">Select your country</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.iso} value={c.iso}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="procedure" className="label-field">Treatment Needed</label>
                <select id="procedure" name="procedure" value={formData.procedure} onChange={handleChange}
                  disabled={isSubmitting}
                  className={`input-field ${errors.procedure ? 'border-red-400' : ''}`}>
                  <option value="">Select a procedure</option>
                  {PROCEDURES.map((proc) => (
                    <option key={proc.id} value={proc.id}>{proc.name}</option>
                  ))}
                </select>
                {errors.procedure && <p className="text-red-500 text-xs mt-1">{errors.procedure}</p>}
              </div>

              <div>
                <label htmlFor="message" className="label-field">
                  Additional Information <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange}
                  placeholder="Tell us about your medical condition, symptoms, or any questions..."
                  rows={3} disabled={isSubmitting}
                  maxLength={2000}
                  className="input-field resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms}
                  onChange={handleChange} disabled={isSubmitting}
                  className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-400 bg-white dark:bg-slate-800" />
                <label htmlFor="agreeTerms" className="text-sm text-slate-500 dark:text-slate-400">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Terms of Service</a>.
                  {' '}Tatvavera Health may contact me via email or phone.
                </label>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-xs -mt-3">{errors.agreeTerms}</p>}

              <button type="submit" disabled={isSubmitting}
                className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>📋 Get My Free Consultation</>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-5 flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your information is 100% secure and confidential. We never share your data.
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
