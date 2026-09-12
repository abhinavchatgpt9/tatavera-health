import { requirePortalRole } from '@/lib/require-portal-role';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  requirePortalRole(['ADMIN']);
  return children;
}
