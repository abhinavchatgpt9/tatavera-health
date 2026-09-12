export function portalPathForRole(role: string | undefined): string {
  switch (role) {
    case 'DOCTOR':
      return '/doctor-portal';
    case 'HOSPITAL_ADMIN':
      return '/hospital-portal';
    case 'CASE_MANAGER':
      return '/case-manager-portal';
    case 'ADMIN':
      return '/admin-portal';
    default:
      return '/dashboard';
  }
}
