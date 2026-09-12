import { requirePortalRole } from '@/lib/require-portal-role';

export default function CaseManagerPortalLayout({ children }: { children: React.ReactNode }) {
  requirePortalRole(['CASE_MANAGER', 'ADMIN']);
  return children;
}
