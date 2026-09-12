'use client';

import { useState } from 'react';

/**
 * Signs the user out.
 *
 * The session cookie is HttpOnly, so JavaScript cannot clear it — the server
 * has to expire it. A hard navigation afterwards (rather than router.push)
 * discards any Server Component payloads React has already cached for the
 * signed-in user.
 */
export function LogoutButton({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Even if the request fails, send the user to the public site — the
      // cookie expires on its own and staying on a portal page is worse.
    } finally {
      window.location.href = '/';
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      aria-label="Log out"
      title="Log out"
      className={className}
    >
      <span aria-hidden="true">🚪</span>
      {iconOnly ? <span className="sr-only">{busy ? 'Signing out…' : 'Log Out'}</span> : ` ${busy ? 'Signing out…' : 'Log Out'}`}
    </button>
  );
}
