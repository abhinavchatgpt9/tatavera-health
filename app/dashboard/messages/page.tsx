import type { Metadata } from 'next';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { getPortalSession } from '@/lib/portal-session';
import { getPatientMessages } from '@/lib/portal-data';
import { MessagesClient } from './MessagesClient';

export const metadata: Metadata = { title: 'Messages | Tatvavera Health' };
export const dynamic = 'force-dynamic';

export default async function PatientMessagesPage() {
  const session = await getPortalSession(['PATIENT', 'ADMIN']);
  const { caseId, caseManager, messages } = await getPatientMessages(session);

  return (
    <DashboardLayout>
      <PortalPage>
        <PageHeader title="Messages" description="Talk directly to the team handling your treatment." />

        {!caseId ? (
          <EmptyState
            icon={<MessagesSquare className="h-6 w-6" aria-hidden="true" />}
            title="No case open yet"
            description="Messaging opens once you have submitted an enquiry and a case manager has been assigned to you."
            action={
              <Button asChild>
                <Link href="/free-consultation">Request a free consultation</Link>
              </Button>
            }
          />
        ) : (
          <MessagesClient caseId={caseId} messages={messages} caseManagerName={caseManager?.name ?? null} />
        )}
      </PortalPage>
    </DashboardLayout>
  );
}
