'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { QUOTATION_STATUS_COLORS } from '@/lib/lead-stage';

type Quotation = {
  id: string;
  patient: string;
  country: string;
  treatment: string;
  status: string;
  totalAmount: number;
  currency: string;
  validUntil: string | null;
  notes: string | null;
  items: Array<{ id: string; description: string; amount: number }>;
  createdAt: string;
};

type LeadOption = { id: string; name: string; treatment: string };

type LineItem = { description: string; amount: string };

const EMPTY_ITEM: LineItem = { description: '', amount: '' };

export function QuotationsClient({ quotations, leads }: { quotations: Quotation[]; leads: LeadOption[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [leadId, setLeadId] = useState(leads[0]?.id ?? '');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ ...EMPTY_ITEM }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  function reset() {
    setLeadId(leads[0]?.id ?? '');
    setValidUntil('');
    setNotes('');
    setItems([{ ...EMPTY_ITEM }]);
    setError(null);
  }

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsedItems = items
      .map((item) => ({ description: item.description.trim(), amount: Math.round(Number(item.amount)) }))
      .filter((item) => item.description.length > 0);

    if (!leadId) {
      setError('Select the patient this quotation is for.');
      return;
    }
    if (parsedItems.length === 0) {
      setError('Add at least one line item with a description.');
      return;
    }
    if (parsedItems.some((item) => !Number.isFinite(item.amount) || item.amount < 0)) {
      setError('Every line item needs a whole, non-negative amount.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          leadId,
          currency: 'USD',
          // The API expects a full ISO datetime, the date input gives a date.
          validUntil: validUntil ? new Date(`${validUntil}T23:59:59Z`).toISOString() : undefined,
          notes: notes.trim() || undefined,
          items: parsedItems,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not create the quotation.');
        return;
      }

      setShowForm(false);
      reset();
      router.refresh();
    } catch {
      setError('Network error — check your connection and try again.');
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
            setError(null);
          }}
          aria-expanded={showForm}
        >
          {showForm ? 'Close' : 'New quotation'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <Panel title="New quotation">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="quotation-lead" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Patient
                  </label>
                  {leads.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No leads are matched to your hospital yet.
                    </p>
                  ) : (
                    <select
                      id="quotation-lead"
                      value={leadId}
                      onChange={(e) => setLeadId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >
                      {leads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} — {lead.treatment}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="quotation-valid" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Valid until
                  </label>
                  <Input
                    id="quotation-valid"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>

              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Line items</legend>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        aria-label={`Line item ${index + 1} description`}
                        placeholder="e.g. Surgical package"
                        value={item.description}
                        onChange={(e) => updateItem(index, { description: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        aria-label={`Line item ${index + 1} amount in USD`}
                        type="number"
                        min={0}
                        step={1}
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => updateItem(index, { amount: e.target.value })}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove line item ${index + 1}`}
                        disabled={items.length === 1}
                        onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setItems((current) => [...current, { ...EMPTY_ITEM }])}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add line
                </Button>
              </fieldset>

              <div>
                <label htmlFor="quotation-notes" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Notes
                </label>
                <textarea
                  id="quotation-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="What the estimate covers, and what it excludes…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Total: {formatMoney(total)}
              </p>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="submit" loading={submitting} disabled={leads.length === 0}>
                  Create quotation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      )}

      {quotations.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" aria-hidden="true" />}
          title="No quotations yet"
          description="Create a quotation for a matched lead and the case manager will see it immediately."
        />
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => (
            <article
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{q.patient}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {q.country} · {q.treatment} · issued {formatDate(q.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Pill className={QUOTATION_STATUS_COLORS[q.status] ?? 'bg-slate-100 text-slate-700'}>{q.status}</Pill>
                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {formatMoney(q.totalAmount, q.currency)}
                  </p>
                </div>
              </div>

              {q.items.length > 0 && (
                <ul className="mb-3 divide-y divide-slate-100 rounded-xl bg-slate-50 px-4 dark:divide-slate-800 dark:bg-slate-800/50">
                  {q.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4 py-2.5 text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{item.description}</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {formatMoney(item.amount, q.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                <span>Valid until {formatDate(q.validUntil)}</span>
                {q.notes && <span className="text-slate-500 dark:text-slate-400">{q.notes}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
