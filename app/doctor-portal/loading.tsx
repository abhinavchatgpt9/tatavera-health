import DoctorLayout from '@/components/DoctorLayout';
import PortalSkeleton from '@/components/portal/PortalSkeleton';

export default function DoctorPortalLoading() {
  return (
    <DoctorLayout>
      <PortalSkeleton />
    </DoctorLayout>
  );
}
