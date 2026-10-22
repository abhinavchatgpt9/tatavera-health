import HospitalLayout from '@/components/HospitalLayout';
import PortalSkeleton from '@/components/portal/PortalSkeleton';

export default function HospitalPortalLoading() {
  return (
    <HospitalLayout>
      <PortalSkeleton />
    </HospitalLayout>
  );
}
