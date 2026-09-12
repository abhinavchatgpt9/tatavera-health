import type { ReactNode } from 'react';

/** Standard page shell so every portal page has the same rhythm and width. */
export function PortalPage({ children }: { children: ReactNode }) {
  return <div className="max-w-6xl p-6 lg:p-10">{children}</div>;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export type Stat = { label: string; value: string | number; emoji?: string; hint?: string };

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
        >
          {stat.emoji && (
            <div className="mb-2 text-2xl" aria-hidden="true">
              {stat.emoji}
            </div>
          )}
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          {stat.hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{stat.hint}</p>}
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Small coloured pill used for stage, status and priority values. */
export function Pill({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

/** Consistent "this list is empty" copy inside a Panel. */
export function PanelEmpty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">{children}</p>;
}

const DATE_FMT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', DATE_FMT);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatMoney(amount: number | null | undefined, currency = 'USD'): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
