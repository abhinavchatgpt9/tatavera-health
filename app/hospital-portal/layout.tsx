import { requirePortalRole } from '@/lib/require-portal-role';

export default function HospitalPortalLayout({ children }: { children: React.ReactNode }) {
  requirePortalRole(['HOSPITAL_ADMIN', 'ADMIN']);
  return children;
}
