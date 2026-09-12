'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Panel } from '@/components/portal/PortalPage';

type Profile = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  emergencyContact: string | null;
};

export function ProfileClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: profile.name,
    phone: profile.phone ?? '',
    country: profile.country ?? '',
    emergencyContact: profile.emergencyContact ?? '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
          emergencyContact: form.emergencyContact.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setProfileMessage({ kind: 'error', text: data.message ?? 'Could not save your details.' });
        return;
      }

      setProfileMessage({ kind: 'ok', text: 'Saved.' });
      router.refresh();
    } catch {
      setProfileMessage({ kind: 'error', text: 'Network error — check your connection and try again.' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage(null);

    if (passwords.next !== passwords.confirm) {
      setPasswordMessage({ kind: 'error', text: 'The two new passwords do not match.' });
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordMessage({ kind: 'error', text: 'Use at least 8 characters.' });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordMessage({ kind: 'error', text: data.message ?? 'Could not change your password.' });
        return;
      }

      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordMessage({ kind: 'ok', text: 'Password changed.' });
    } catch {
      setPasswordMessage({ kind: 'error', text: 'Network error — check your connection and try again.' });
    } finally {
      setSavingPassword(false);
    }
  }

  function Message({ message }: { message: { kind: 'ok' | 'error'; text: string } }) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <Panel title="Your details">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Full name
              </label>
              <Input
                id="profile-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <Input id="profile-email" value={profile.email} disabled readOnly />
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Contact your case manager to change the email on your account.
              </p>
            </div>
            <div>
              <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Phone
              </label>
              <Input
                id="profile-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 801 234 5678"
              />
            </div>
            <div>
              <label htmlFor="profile-country" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Country
              </label>
              <Input
                id="profile-country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-emergency" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Emergency contact
            </label>
            <Input
              id="profile-emergency"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              placeholder="Name and phone number of someone we can reach"
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Shared with the hospital treating you. Worth filling in before you travel.
            </p>
          </div>

          {profileMessage && <Message message={profileMessage} />}

          <Button type="submit" loading={savingProfile}>
            Save details
          </Button>
        </form>
      </Panel>

      <Panel title="Password">
        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label htmlFor="password-current" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Current password
            </label>
            <Input
              id="password-current"
              type="password"
              autoComplete="current-password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password-new" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                New password
              </label>
              <Input
                id="password-new"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password-confirm" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm new password
              </label>
              <Input
                id="password-confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
          </div>

          {passwordMessage && <Message message={passwordMessage} />}

          <Button type="submit" loading={savingPassword} disabled={!passwords.next}>
            Change password
          </Button>
        </form>
      </Panel>
    </div>
  );
}
