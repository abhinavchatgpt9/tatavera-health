'use client';

import type { CountryCode } from 'libphonenumber-js/max';
import { COUNTRY_OPTIONS, examplePhone } from '@/lib/phone';

interface PhoneInputProps {
  id: string;
  iso: CountryCode;
  value: string;
  onChange: (iso: CountryCode, value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export default function PhoneInput({ id, iso, value, onChange, onBlur, error, disabled }: PhoneInputProps) {
  const current = COUNTRY_OPTIONS.find((c) => c.iso === iso) ?? COUNTRY_OPTIONS[0];
  const errId = `${id}-error`;
  return (
    <div>
      <div className="flex gap-2">
        {/* Visible chip shows flag + code; the native select sits invisibly on top so it stays accessible. */}
        <div className={`input-field !w-auto relative flex shrink-0 items-center gap-1.5 whitespace-nowrap ${error ? 'border-red-400' : ''}`}>
          <span aria-hidden="true">{current.flag} +{current.dial}</span>
          <span aria-hidden="true" className="text-xs text-slate-400">▾</span>
          <select
            aria-label="Country calling code"
            value={iso}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as CountryCode, value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.iso} value={c.iso}>
                {c.flag} {c.name} (+{c.dial})
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          maxLength={20}
          disabled={disabled}
          placeholder={examplePhone(iso) || 'Phone number'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(iso, e.target.value.replace(/[^\d\s\-().]/g, ''))}
          onBlur={onBlur}
          className={`input-field min-w-0 flex-1 ${error ? 'border-red-400' : ''}`}
        />
      </div>
      {error && (
        <p id={errId} role="alert" className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
