import AdminLayout from '@/components/AdminLayout';
import PortalSkeleton from '@/components/portal/PortalSkeleton';

export default function AdminPortalLoading() {
  return (
    <AdminLayout>
      <PortalSkeleton />
    </AdminLayout>
  );
}
