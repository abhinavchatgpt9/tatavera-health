'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Panel, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';

type Application = {
  id: string;
  requestedRole: string;
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  city: string | null;
  country: string | null;
  specialtyOrType: string | null;
  message: string | null;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

const ROLE_LABELS: Record<string, string> = { DOCTOR: 'Doctor', HOSPITAL_ADMIN: 'Hospital Admin' };
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export function ApplicationsClient({ applications }: { applications: Application[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [result, setResult] = useState<{ email: string; tempPassword: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(id: string, action: 'APPROVE' | 'REJECT') {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/staff-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not update the application.');
        return;
      }
      if (action === 'APPROVE' && data.tempPassword) {
        setResult({ email: data.user.email, tempPassword: data.tempPassword });
      }
      router.refresh();
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setBusyId(null);
    }
  }

  const columns: Array<Column<Application>> = [
    {
      key: 'applicant',
      header: 'Applicant',
      render: (a) => (
        <>
          <p className="font-medium text-slate-900 dark:text-white">{a.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{a.email} · {a.phone}</p>
        </>
      ),
    },
    {
      key: 'role',
      header: 'Applying as',
      render: (a) => <Pill className="bg-blue-100 text-blue-700">{ROLE_LABELS[a.requestedRole] ?? a.requestedRole}</Pill>,
    },
    {
      key: 'org',
      header: 'Organization',
      render: (a) => (
        <>
          <p className="text-slate-700 dark:text-slate-300">{a.organizationName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {[a.specialtyOrType, a.city, a.country].filter(Boolean).join(' · ')}
          </p>
        </>
      ),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      hideOnMobile: true,
      render: (a) => <span className="text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <Pill className={STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>,
    },
    {
      key: 'actions',
      header: 'Review',
      align: 'right',
      render: (a) =>
        a.status === 'PENDING' ? (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              loading={busyId === a.id}
              onClick={() => review(a.id, 'REJECT')}
            >
              Reject
            </Button>
            <Button size="sm" loading={busyId === a.id} onClick={() => review(a.id, 'APPROVE')}>
              Approve
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {a.reviewedAt ? formatDate(a.reviewedAt) : '—'}
          </span>
        ),
    },
  ];

  return (
    <>
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mb-6">
          <Panel title="Account created">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Give <strong>{result.email}</strong> this one-time password and ask them to sign in and change it. This is
              shown only once — it isn&apos;t stored anywhere.
            </p>
            <code className="mt-3 block w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm font-mono text-slate-900 dark:bg-slate-800 dark:text-white">
              {result.tempPassword}
            </code>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setResult(null)}>
              Dismiss
            </Button>
          </Panel>
        </div>
      )}

      <DataTable
        rows={applications}
        columns={columns}
        searchIn={(a) => `${a.name} ${a.email} ${a.organizationName}`}
        searchPlaceholder="Search by name, email or organization…"
        filter={{
          label: 'All statuses',
          options: [
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ],
          matches: (a, value) => a.status === value,
        }}
        emptyTitle="No applications yet"
        emptyDescription="Applications from the public /partner-with-us page will appear here."
      />
    </>
  );
}
