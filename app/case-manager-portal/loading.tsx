import CaseManagerLayout from '@/components/CaseManagerLayout';
import PortalSkeleton from '@/components/portal/PortalSkeleton';

export default function CaseManagerPortalLoading() {
  return (
    <CaseManagerLayout>
      <PortalSkeleton />
    </CaseManagerLayout>
  );
}
