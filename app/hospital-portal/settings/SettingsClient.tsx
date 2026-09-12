'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/portal/PortalPage';

type Hospital = {
  name: string;
  city: string;
  country: string;
  description: string;
  accreditations: string[];
  specialties: string[];
};

/** Comma-separated text ↔ string[]. */
function toList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function SettingsClient({ hospital }: { hospital: Hospital }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: hospital.name,
    city: hospital.city,
    country: hospital.country,
    description: hospital.description,
    accreditations: hospital.accreditations.join(', '),
    specialties: hospital.specialties.join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function update(patch: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...patch }));
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/hospital/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          description: form.description.trim(),
          accreditations: toList(form.accreditations),
          specialties: toList(form.specialties),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ kind: 'error', text: data.message ?? 'Could not save your changes.' });
        return;
      }

      setMessage({ kind: 'ok', text: 'Saved. Your public hospital page is updated.' });
      router.refresh();
    } catch {
      setMessage({ kind: 'error', text: 'Network error — check your connection and try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Hospital profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hospital-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Hospital name
          </label>
          <Input id="hospital-name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hospital-city" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              City
            </label>
            <Input id="hospital-city" required value={form.city} onChange={(e) => update({ city: e.target.value })} />
          </div>
          <div>
            <label htmlFor="hospital-country" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Country
            </label>
            <Input
              id="hospital-country"
              required
              value={form.country}
              onChange={(e) => update({ country: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="hospital-description" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Description
          </label>
          <textarea
            id="hospital-description"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Shown on your public hospital page. Write it for patients, not for other hospitals.
          </p>
        </div>

        <div>
          <label htmlFor="hospital-accreditations" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Accreditations
          </label>
          <Input
            id="hospital-accreditations"
            value={form.accreditations}
            onChange={(e) => update({ accreditations: e.target.value })}
            placeholder="JCI, NABH, NABL"
          />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Separate with commas.</p>
        </div>

        <div>
          <label htmlFor="hospital-specialties" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Specialties
          </label>
          <Input
            id="hospital-specialties"
            value={form.specialties}
            onChange={(e) => update({ specialties: e.target.value })}
            placeholder="Cardiac Surgery, Oncology, Orthopedics"
          />
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Separate with commas.</p>
        </div>

        {message && (
          <p
            role="status"
            className={
              message.kind === 'ok'
                ? 'rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300'
            }
          >
            {message.text}
          </p>
        )}

        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </form>
    </Panel>
  );
}
