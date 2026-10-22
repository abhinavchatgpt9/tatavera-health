import DashboardLayout from '@/components/DashboardLayout';
import PortalSkeleton from '@/components/portal/PortalSkeleton';

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <PortalSkeleton />
    </DashboardLayout>
  );
}
