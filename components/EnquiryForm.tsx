'use client';

import { useEffect, useRef, useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import PhoneInput from '@/components/PhoneInput';
import { COUNTRY_OPTIONS, countryName, guessCountryIso, validatePhone } from '@/lib/phone';
import {
  AREA_TREATMENT_OPTIONS,
  MIN_OTHER_DESCRIPTION,
  OTHER_TREATMENT_LABEL,
  POPULAR_TREATMENT_OPTIONS,
  isOtherTreatment,
  treatmentLabel,
} from '@/lib/enquiry';
import {
  CALLBACK_TIMEFRAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  FREE_SERVICE_SUMMARY,
  OTHER_TREATMENT_VALUE,
  WHATSAPP_NUMBER,
} from '@/lib/constants';
import type { CountryCode } from 'libphonenumber-js/max';

/**
 * The one enquiry form used across the site (Request a callback page, treatment pages, doctor/hospital buttons).
 * It never shows success unless the server confirms the enquiry was saved, keeps everything the patient typed
 * when something goes wrong, and ignores repeat clicks so one enquiry is never sent twice.
 */

interface Props {
  /** Pre-selected treatment option value (see lib/enquiry.ts resolveTreatmentParam). */
  defaultTreatment?: string;
  /** Pre-filled text for the description box, e.g. what the patient searched for. */
  defaultDetails?: string;
  /** Set when the enquiry is about a specific doctor or hospital. */
  doctor?: string;
  hospital?: string;
  /** Prefix for element ids so the form can sit on a page that has another form. */
  idPrefix?: string;
  /** Called once the enquiry has been saved. */
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  phoneCountry: CountryCode;
  country: string;
  treatment: string;
  details: string;
  contactVia: string;
  agreeTerms: boolean;
}

type Errors = Record<string, string>;

const GENERIC_ERROR = `We could not send your request. Nothing was lost, so please try again, or contact us on WhatsApp ${CONTACT_PHONE}.`;
const NETWORK_ERROR = `We could not reach our server. Please check your connection and try again, or contact us on WhatsApp ${CONTACT_PHONE}.`;

export default function EnquiryForm({
  defaultTreatment = '',
  defaultDetails = '',
  doctor,
  hospital,
  idPrefix = 'enquiry',
  onSuccess,
}: Props) {
  const id = (field: string) => `${idPrefix}-${field}`;

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    phoneCountry: 'IN',
    country: '',
    treatment: defaultTreatment,
    details: defaultDetails,
    contactVia: '',
    agreeTerms: false,
  });
  const [phoneCodeTouched, setPhoneCodeTouched] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reference, setReference] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Start the phone code at the visitor's own country when the browser tells us, otherwise keep India.
  useEffect(() => {
    const guess = guessCountryIso();
    if (guess) setForm((prev) => (prev.phone ? prev : { ...prev, phoneCountry: guess }));
  }, []);

  // Keep the pre-selection in step when the link changes (e.g. a new ?treatment= in the address).
  useEffect(() => {
    if (defaultTreatment) setForm((prev) => ({ ...prev, treatment: defaultTreatment }));
  }, [defaultTreatment]);

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    clearError(name);
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const iso = e.target.value as CountryCode | '';
    setForm((prev) => ({
      ...prev,
      country: iso ? countryName(iso) : '',
      // Follow the country for the phone code until the patient picks a code themselves.
      phoneCountry: iso && !phoneCodeTouched ? iso : prev.phoneCountry,
    }));
    clearError('country');
  };

  const handlePhoneChange = (iso: CountryCode, value: string) => {
    if (iso !== form.phoneCountry) setPhoneCodeTouched(true);
    setForm((prev) => ({ ...prev, phoneCountry: iso, phone: value }));
    clearError('phone');
  };

  const validatePhoneOnBlur = () => {
    if (!form.phone) return;
    const r = validatePhone(form.phone, form.phoneCountry);
    setErrors((prev) => {
      const next = { ...prev };
      if (r.ok) delete next.phone;
      else next.phone = r.message;
      return next;
    });
  };

  const other = isOtherTreatment(form.treatment);

  const validate = (): Errors => {
    const e: Errors = {};
    const name = form.name.trim();
    if (!name) e.name = 'Please enter your name';
    else if (!/^[\p{L}][\p{L}\s.'’-]{1,99}$/u.test(name)) e.name = 'Enter your full name (letters only, at least 2 characters)';
    const email = form.email.trim();
    if (!email) e.email = 'Please enter your email';
    else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Please enter a valid email address';
    const phone = validatePhone(form.phone, form.phoneCountry);
    if (!phone.ok) e.phone = phone.message;
    if (!form.country) e.country = 'Please choose your country';
    if (!form.treatment) e.treatment = 'Please choose a treatment, or "Other / Not sure"';
    const details = form.details.trim();
    if (other && details.length < MIN_OTHER_DESCRIPTION) {
      e.details = `Please describe what you need in a few words (at least ${MIN_OTHER_DESCRIPTION} characters)`;
    }
    if (details.length > 2000) e.details = 'Please keep this under 2000 characters';
    if (!form.agreeTerms) e.agreeTerms = 'Please agree to the Privacy Policy and Terms to continue';
    return e;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return; // a second click while the first is still being sent
    setSubmitError('');

    const found = validate();
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }
    const phone = validatePhone(form.phone, form.phoneCountry);
    if (!phone.ok) return;

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: phone.e164,
          country: form.country,
          procedure: treatmentLabel(form.treatment) || OTHER_TREATMENT_LABEL,
          message: form.details.trim(),
          contactVia: form.contactVia || undefined,
          doctor,
          hospital,
          agreeTerms: form.agreeTerms,
          website: honeypotRef.current?.value ?? '',
        }),
      });
      let data: { success?: boolean; message?: string; data?: { reference?: string } } | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      // Success is shown only when the server says the enquiry was saved.
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || GENERIC_ERROR);
      }
      setReference(data.data?.reference ?? '');
      // Counts one completed enquiry. Carries no name, contact details, treatment or medical information.
      try { track('generate_lead', { form: idPrefix }); } catch { /* analytics must never affect the enquiry */ }
      onSuccess?.();
    } catch (err) {
      // Everything the patient typed stays in the form so they can simply press the button again.
      setSubmitError(err instanceof TypeError ? NETWORK_ERROR : err instanceof Error && err.message ? err.message : GENERIC_ERROR);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const startAnother = () => {
    setReference(null);
    setSubmitError('');
    setErrors({});
    setPhoneCodeTouched(false);
    setForm((prev) => ({
      ...prev,
      treatment: defaultTreatment,
      details: defaultDetails,
      contactVia: '',
      agreeTerms: false,
    }));
  };

  if (reference !== null) {
    const waHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}${
      reference ? `?text=${encodeURIComponent(`Hi, I just sent an enquiry on your website. Reference: ${reference}`)}` : ''
    }`;
    return (
      <div role="status" aria-live="polite" className="space-y-5">
        <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-2xl">
          <p className="font-semibold text-lg">Thank you, your request has been received.</p>
          {reference && (
            <p className="text-sm mt-1">
              Your reference: <span className="font-mono font-semibold tracking-wide">{reference}</span>
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">What happens next</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>Our team reviews your request.</li>
            <li>We call you back {CALLBACK_TIMEFRAME} on the phone number you gave us.</li>
            <li>
              We then explain the next steps for your case. If we need medical reports, we will ask for them
              later and tell you how to send them securely. Please do not email reports unless we ask.
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-white mb-2">Need to reach us sooner?</p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                💬 WhatsApp {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                📞 Call {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                ✉️ {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Optional: you can{' '}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            create a free account
          </Link>{' '}
          to follow your enquiry online. You do not need one for us to help you.
        </p>

        <button type="button" onClick={startAnother} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Send another enquiry
        </button>
      </div>
    );
  }

  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={id(`${key}-error`)} role="alert" className="text-red-500 text-xs mt-1">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-900/10 p-4 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">What is free, and what do I pay for?</p>
        <p>{FREE_SERVICE_SUMMARY}</p>
      </div>

      {(doctor || hospital) && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Enquiry about: <strong>{[doctor, hospital].filter(Boolean).join(' · ')}</strong>
        </p>
      )}

      {submitError && (
        <div role="alert" className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-2xl text-sm">
          {submitError}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={id('name')} className="label-field">Full Name</label>
          <input type="text" id={id('name')} name="name" value={form.name} onChange={handleChange}
            autoComplete="name" placeholder="John Smith" disabled={submitting}
            aria-invalid={errors.name ? true : undefined}
            className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor={id('email')} className="label-field">Email Address</label>
          <input type="email" id={id('email')} name="email" value={form.email} onChange={handleChange}
            autoComplete="email" placeholder="john@example.com" disabled={submitting}
            aria-invalid={errors.email ? true : undefined}
            className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
          {fieldError('email')}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={id('phone')} className="label-field">Phone Number</label>
          <PhoneInput id={id('phone')} iso={form.phoneCountry} value={form.phone}
            onChange={handlePhoneChange} onBlur={validatePhoneOnBlur}
            error={errors.phone} disabled={submitting} />
        </div>
        <div>
          <label htmlFor={id('country')} className="label-field">Country</label>
          <select id={id('country')} name="country"
            value={COUNTRY_OPTIONS.find((c) => c.name === form.country)?.iso ?? ''}
            onChange={handleCountryChange} disabled={submitting}
            aria-invalid={errors.country ? true : undefined}
            className={`input-field ${errors.country ? 'border-red-400' : ''}`}>
            <option value="">Select your country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.iso} value={c.iso}>{c.flag} {c.name}</option>
            ))}
          </select>
          {fieldError('country')}
        </div>
      </div>

      <div>
        <label htmlFor={id('treatment')} className="label-field">Treatment Needed</label>
        <select id={id('treatment')} name="treatment" value={form.treatment} onChange={handleChange}
          disabled={submitting}
          aria-invalid={errors.treatment ? true : undefined}
          className={`input-field ${errors.treatment ? 'border-red-400' : ''}`}>
          <option value="">Select a treatment</option>
          <optgroup label="Popular procedures">
            {POPULAR_TREATMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </optgroup>
          <optgroup label="Treatment areas">
            {AREA_TREATMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </optgroup>
          <option value={OTHER_TREATMENT_VALUE}>{OTHER_TREATMENT_LABEL}</option>
        </select>
        {fieldError('treatment')}
      </div>

      <div>
        <label htmlFor={id('details')} className="label-field">
          {other ? 'Describe the treatment you need' : 'Anything else we should know'}{' '}
          {!other && <span className="text-slate-400 font-normal">(Optional)</span>}
        </label>
        <textarea id={id('details')} name="details" value={form.details} onChange={handleChange}
          placeholder={other
            ? 'e.g. Knee pain after an accident, I would like to know my options'
            : 'A few words about your condition or questions. Please do not paste full medical records here.'}
          rows={3} disabled={submitting} maxLength={2000}
          aria-invalid={errors.details ? true : undefined}
          className={`input-field resize-none ${errors.details ? 'border-red-400' : ''}`} />
        {fieldError('details')}
      </div>

      <div>
        <label htmlFor={id('contactVia')} className="label-field">
          Best way to reach you <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <select id={id('contactVia')} name="contactVia" value={form.contactVia} onChange={handleChange}
          disabled={submitting} className="input-field">
          <option value="">No preference</option>
          <option value="Phone call">Phone call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>
      </div>

      {/* Hidden trap for automated form fillers; people never see or fill it. */}
      <div aria-hidden="true" className="hidden">
        <label>Website <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input type="checkbox" id={id('agreeTerms')} name="agreeTerms" checked={form.agreeTerms}
            onChange={handleChange} disabled={submitting}
            aria-invalid={errors.agreeTerms ? true : undefined}
            className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-400 bg-white dark:bg-slate-800" />
          <label htmlFor={id('agreeTerms')} className="text-sm text-slate-500 dark:text-slate-400">
            I agree to the{' '}
            <Link href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Terms of Use</Link>,
            and I am happy for Tatvavera Health to contact me by phone, WhatsApp or email about this request.
          </label>
        </div>
        {fieldError('agreeTerms')}
      </div>

      <button type="submit" disabled={submitting} aria-busy={submitting}
        className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {submitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>📞 Request a callback</>
        )}
      </button>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Our team reviews your request and calls you back {CALLBACK_TIMEFRAME}. Your details are used to review your
        enquiry and contact you. They are shared with a hospital or doctor only when needed to arrange your care.{' '}
        <Link href="/privacy" target="_blank" className="underline">How we use your information</Link>.
      </p>
    </form>
  );
}
