'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel, formatDate } from '@/components/portal/PortalPage';

type Opinion = {
  id: string;
  patient: string;
  summary: string;
  recommendation: string;
  createdAt: string;
};

type CaseOption = { id: string; name: string; treatment: string };

export function OpinionsClient({ opinions, cases }: { opinions: Opinion[]; cases: CaseOption[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [caseId, setCaseId] = useState(cases[0]?.id ?? '');
  const [summary, setSummary] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setCaseId(cases[0]?.id ?? '');
    setSummary('');
    setRecommendation('');
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!caseId) {
      setError('Select a patient first.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/doctor/opinions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ caseId, summary, recommendation }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not save the opinion. Try again.');
        return;
      }

      setShowForm(false);
      reset();
      // Re-runs the Server Component so the new opinion appears in the list.
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
          {showForm ? 'Close' : 'Write new opinion'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <Panel title="New medical opinion">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="opinion-case" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Patient
                </label>
                {cases.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No patient cases are assigned to you yet, so there is nobody to write an opinion for.
                  </p>
                ) : (
                  <select
                    id="opinion-case"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.treatment}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="opinion-summary" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Summary
                </label>
                <textarea
                  id="opinion-summary"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="Clinical summary of findings…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="opinion-recommendation" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Recommendation
                </label>
                <textarea
                  id="opinion-recommendation"
                  required
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  rows={3}
                  placeholder="Recommended course of treatment…"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="submit" loading={submitting} disabled={cases.length === 0}>
                  {submitting ? 'Saving…' : 'Submit opinion'}
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

      {opinions.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-6 w-6" aria-hidden="true" />}
          title="No medical opinions yet"
          description="Opinions you write for your patients are recorded here and shared with their case manager."
        />
      ) : (
        <div className="space-y-4">
          {opinions.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{o.patient}</h3>
                <time dateTime={o.createdAt} className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(o.createdAt)}
                </time>
              </div>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{o.summary}</p>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Recommendation
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{o.recommendation}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
