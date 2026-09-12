import { requirePortalRole } from '@/lib/require-portal-role';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  requirePortalRole(['DOCTOR', 'ADMIN']);
  return children;
}
