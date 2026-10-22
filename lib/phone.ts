import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/examples.mobile.json';

/** Shown first in the country pickers (Kenya–India corridor, then nearby markets). */
const PINNED: CountryCode[] = ['KE', 'IN', 'NG', 'TZ', 'UG', 'ET', 'GH', 'ZA', 'AE', 'SA', 'KW', 'EG', 'GB', 'US'];

let regionNames: Intl.DisplayNames | null = null;

export function countryName(iso: string): string {
  try {
    if (!regionNames) regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(iso) ?? iso;
  } catch {
    return iso;
  }
}

export function flagEmoji(iso: string): string {
  return String.fromCodePoint(...Array.from(iso.toUpperCase()).map((c) => 127397 + c.charCodeAt(0)));
}

export interface CountryOption {
  iso: CountryCode;
  name: string;
  dial: string;
  flag: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = (() => {
  const all = getCountries().map((iso) => ({
    iso,
    name: countryName(iso),
    dial: getCountryCallingCode(iso),
    flag: flagEmoji(iso),
  }));
  const pinned = PINNED.map((iso) => all.find((c) => c.iso === iso)).filter(Boolean) as CountryOption[];
  const rest = all.filter((c) => !PINNED.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name));
  return [...pinned, ...rest];
})();

/** Example national-format mobile number for a country, e.g. "0712 123456". */
export function examplePhone(iso: CountryCode): string {
  try {
    return getExampleNumber(iso, examples)?.formatNational() ?? '';
  } catch {
    return '';
  }
}

export type PhoneResult = { ok: true; e164: string } | { ok: false; message: string };

/** Validate a national number against the selected country's real numbering plan. */
export function validatePhone(raw: string, iso: CountryCode): PhoneResult {
  const value = raw.trim();
  if (!value) return { ok: false, message: 'Phone number is required' };
  if (value.startsWith('+') || value.startsWith('00')) {
    return { ok: false, message: 'Choose the country code from the list instead of typing it' };
  }
  if (!/^[\d\s\-().]+$/.test(value)) return { ok: false, message: 'Use digits only' };
  const parsed = parsePhoneNumberFromString(value, iso);
  if (!parsed || !parsed.isValid()) {
    const example = examplePhone(iso);
    return {
      ok: false,
      message: `Enter a valid ${countryName(iso)} phone number${example ? ` (e.g. ${example})` : ''}`,
    };
  }
  return { ok: true, e164: parsed.number };
}

/** Server-side check: strict E.164 and a real, valid number. */
export function isValidE164(value: string): boolean {
  if (!/^\+[1-9]\d{6,14}$/.test(value)) return false;
  return parsePhoneNumberFromString(value)?.isValid() ?? false;
}
