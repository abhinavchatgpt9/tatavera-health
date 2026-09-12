import type { Metadata } from 'next';
import { StickyNote } from 'lucide-react';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, formatDateTime } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerNotes } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Notes | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerNotesPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const notes = await getCaseManagerNotes(session);

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Notes"
          description={`${notes.length} ${notes.length === 1 ? 'note' : 'notes'} across your leads, newest first`}
        />

        {notes.length === 0 ? (
          <EmptyState
            icon={<StickyNote className="h-6 w-6" aria-hidden="true" />}
            title="No notes yet"
            description="Notes added to a lead appear here, so you can scan everything recorded across your cases in one place."
          />
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <article
                key={note.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-900 dark:text-white">{note.lead}</h2>
                  <time dateTime={note.createdAt} className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDateTime(note.createdAt)}
                  </time>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{note.body}</p>
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Written by {note.author}</p>
              </article>
            ))}
          </div>
        )}
      </PortalPage>
    </CaseManagerLayout>
  );
}
