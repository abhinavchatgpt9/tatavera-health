'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Panel, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  country: string | null;
  status: string;
  createdAt: string;
};

const ROLES = ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN', 'CASE_MANAGER', 'ADMIN', 'PARTNER'];

const ROLE_LABELS: Record<string, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  HOSPITAL_ADMIN: 'Hospital Admin',
  CASE_MANAGER: 'Case Manager',
  ADMIN: 'Admin',
  PARTNER: 'Partner',
};

const ROLE_COLORS: Record<string, string> = {
  PATIENT: 'bg-slate-100 text-slate-700',
  DOCTOR: 'bg-blue-100 text-blue-700',
  HOSPITAL_ADMIN: 'bg-purple-100 text-purple-700',
  CASE_MANAGER: 'bg-cyan-100 text-cyan-700',
  ADMIN: 'bg-red-100 text-red-700',
  PARTNER: 'bg-amber-100 text-amber-700',
};

const columns: Array<Column<User>> = [
  {
    key: 'user',
    header: 'User',
    render: (u) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
      </>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (u) => (
      <Pill className={ROLE_COLORS[u.role] ?? 'bg-slate-100 text-slate-700'}>{ROLE_LABELS[u.role] ?? u.role}</Pill>
    ),
  },
  {
    key: 'country',
    header: 'Country',
    hideOnMobile: true,
    render: (u) => <span className="text-slate-500 dark:text-slate-400">{u.country ?? '—'}</span>,
  },
  {
    key: 'joined',
    header: 'Joined',
    hideOnMobile: true,
    render: (u) => <span className="text-slate-500 dark:text-slate-400">{formatDate(u.createdAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (u) => (
      <Pill className={u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {u.status === 'ACTIVE' ? 'Verified' : 'Unverified'}
      </Pill>
    ),
  },
];

export function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CASE_MANAGER' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function update(patch: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...patch }));
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phone: form.phone.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ kind: 'error', text: data.message ?? 'Could not create the account.' });
        return;
      }

      setMessage({ kind: 'ok', text: `Created ${form.email}. They can sign in with the password you set.` });
      setForm({ name: '', email: '', password: '', phone: '', role: 'CASE_MANAGER' });
      router.refresh();
    } catch {
      setMessage({ kind: 'error', text: 'Network error — check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => {
            setShowForm((open) => !open);
            setMessage(null);
          }}
          aria-expanded={showForm}
        >
          {showForm ? 'Close' : 'Create staff account'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <Panel title="Create a staff account">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="user-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Full name
                  </label>
                  <Input id="user-name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email
                  </label>
                  <Input
                    id="user-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="user-role" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Role
                  </label>
                  <select
                    id="user-role"
                    value={form.role}
                    onChange={(e) => update({ role: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="user-phone" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Phone (optional)
                  </label>
                  <Input id="user-phone" value={form.phone} onChange={(e) => update({ phone: e.target.value })} />
                </div>
              </div>

              <div>
                <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Temporary password
                </label>
                <Input
                  id="user-password"
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update({ password: e.target.value })}
                />
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  At least 8 characters. Send it to them over a channel other than email, and ask them to change it.
                </p>
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

              <Button type="submit" loading={submitting}>
                Create account
              </Button>
            </form>
          </Panel>
        </div>
      )}

      <DataTable
        rows={users}
        columns={columns}
        searchIn={(u) => `${u.name} ${u.email} ${u.country ?? ''}`}
        searchPlaceholder="Search by name, email or country…"
        filter={{
          label: 'All roles',
          options: ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
          matches: (u, value) => u.role === value,
        }}
        emptyTitle="No users yet"
        emptyDescription="Accounts created here and patient sign-ups both appear in this list."
      />
    </>
  );
}
