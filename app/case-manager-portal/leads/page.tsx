'use client';

import { useEffect, useState } from 'react';
import { Search as SearchIcon, Inbox, AlertTriangle } from 'lucide-react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

const STAGE_ORDER = [
  'LEAD_CREATED', 'LEAD_ASSIGNED', 'LEAD_CONTACTED', 'REPORTS_UPLOADED',
  'HOSPITAL_MATCHED', 'QUOTATION_RECEIVED', 'VIDEO_CONSULTATION',
  'TREATMENT_CONFIRMED', 'VISA_PROCESSING', 'TRAVEL_ARRANGED',
  'TREATMENT_COMPLETED', 'FOLLOW_UP',
];

type Lead = {
  id: string;
  name: string;
  country: string;
  treatmentName: string | null;
  stage: string;
  createdAt: string;
  value: number | null;
  currency: string;
};

export default function AssignedLeadsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [view, setView] = useState<'table' | 'board'>('table');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      try {
        const res = await fetch('/api/leads', { credentials: 'include' });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          setLeads(data.leads);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.country.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assigned Leads</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {status === 'ready' ? `${filtered.length} of ${leads.length} leads` : 'Loading your pipeline…'}
            </p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'table' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Table</button>
            <button onClick={() => setView('board')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'board' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Board</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search by patient name or country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stages</SelectItem>
              {STAGE_ORDER.map((s) => (
                <SelectItem key={s} value={s}>{LEAD_STAGE_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {status === 'loading' && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <EmptyState
            icon={<AlertTriangle className="h-6 w-6" aria-hidden="true" />}
            title="Couldn't load your leads"
            description="The database connection isn't available right now. Check back shortly, or contact your administrator if this persists."
            action={<Button onClick={() => window.location.reload()}>Retry</Button>}
          />
        )}

        {status === 'ready' && filtered.length === 0 && (
          <EmptyState
            icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
            title={leads.length === 0 ? 'No leads assigned yet' : 'No leads match your filters'}
            description={
              leads.length === 0
                ? 'New enquiries converted to leads will appear here once assigned to you.'
                : 'Try a different search term or stage filter.'
            }
          />
        )}

        {status === 'ready' && filtered.length > 0 && view === 'table' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Treatment</th>
                  <th className="px-5 py-3 font-medium">Stage</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium text-right">Value</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.country}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{lead.treatmentName || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
                        {LEAD_STAGE_LABELS[lead.stage]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-white">
                      {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline">Open Case</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {status === 'ready' && filtered.length > 0 && view === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGE_ORDER.map((stage) => {
              const stageLeads = filtered.filter((l) => l.stage === stage);
              return (
                <div key={stage} className="w-64 flex-shrink-0">
                  <div className={`px-3 py-2 rounded-lg text-xs font-semibold mb-2 ${LEAD_STAGE_COLORS[stage]}`}>
                    {LEAD_STAGE_LABELS[stage]} ({stageLeads.length})
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map((lead) => (
                      <div key={lead.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-card">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.country} · {lead.treatmentName || 'Unspecified'}</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                          {lead.value ? `$${lead.value.toLocaleString()}` : '—'}
                        </p>
                      </div>
                    ))}
                    {stageLeads.length === 0 && <div className="text-xs text-slate-300 dark:text-slate-600 text-center py-4">Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
