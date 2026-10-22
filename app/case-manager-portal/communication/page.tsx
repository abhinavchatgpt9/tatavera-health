import type { Metadata } from 'next';
import { MessagesSquare } from 'lucide-react';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerConversations } from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Communication | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerCommunicationPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const conversations = await getCaseManagerConversations(session);

  const unread = conversations.filter((c) => c.lastMessage && !c.lastMessage.read).length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Communication"
          description={
            conversations.length === 0
              ? 'No patient conversations yet.'
              : `${conversations.length} ${conversations.length === 1 ? 'conversation' : 'conversations'}${unread > 0 ? ` · ${unread} with an unread reply` : ''}`
          }
        />

        {conversations.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-6 w-6" aria-hidden="true" />}
            title="No conversations yet"
            description="Once a patient case is assigned to you, messages between you and the patient appear here."
          />
        ) : (
          <ul className="space-y-3">
            {conversations.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-white">{c.patient}</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {c.country} · {c.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.lastMessage && !c.lastMessage.read && (
                      <Pill className="bg-blue-100 text-blue-700">Unread</Pill>
                    )}
                    <Pill className={CASE_STATUS_COLORS[c.status] ?? 'bg-slate-100 text-slate-700'}>
                      {CASE_STATUS_LABELS[c.status] ?? c.status}
                    </Pill>
                  </div>
                </div>

                {c.lastMessage ? (
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{c.lastMessage.body}</p>
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                      {c.lastMessage.sender} · {formatDateTime(c.lastMessage.createdAt)} · {c.messageCount}{' '}
                      {c.messageCount === 1 ? 'message' : 'messages'} in thread
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    No messages yet — this patient has not been contacted through the portal.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </PortalPage>
    </CaseManagerLayout>
  );
}
