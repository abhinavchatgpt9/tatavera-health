/** Normalize for storage and lookup (Postgres emails are case-sensitive by default). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
