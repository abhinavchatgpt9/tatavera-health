'use client';

import { useState } from 'react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_LEADS } from '@/lib/portal-mock-data';

const REPORT_REVIEWS = MOCK_CM_LEADS.map((l, i) => ({
  ...l,
  reportCount: [3, 1, 0, 4, 2][i % 5],
  pending: [true, true, false, false, true][i % 5],
}));

export default function ReportReviewPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING'>('ALL');

  const visible = REPORT_REVIEWS.filter((r) => (filter === 'ALL' ? true : r.pending));

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Report Review</h1>
          <p className="text-gray-500 mt-1">Review medical reports uploaded by patients.</p>
        </div>

        <div className="flex gap-2 mb-6">
          {(['ALL', 'PENDING'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'ALL' ? 'All' : 'Pending Review'}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📄</p>
            <p>No reports in this view.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{r.name}</p>
                    {r.pending && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.country} · {r.treatment} · {r.reportCount} report{r.reportCount === 1 ? '' : 's'} uploaded
                  </p>
                </div>
                <button
                  disabled={r.reportCount === 0}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
