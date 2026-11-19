'use client';

import { useEffect } from 'react';
import { track, type BeforeSendEvent } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/next';

/**
 * Keeps only utm_* parameters in the page address sent to analytics. Source reports still work, while any
 * other query text (for example a treatment someone searched for) never reaches analytics.
 */
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    const keep = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (key.toLowerCase().startsWith('utm_')) keep.set(key, value);
    });
    url.search = keep.toString();
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

/** Counts a click on any WhatsApp link as a contact click. It is not an enquiry, and carries no personal data. */
function useWhatsAppClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) track('contact_click', { channel: 'whatsapp' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

export default function AnalyticsClient() {
  useWhatsAppClickTracking();
  return <Analytics beforeSend={beforeSend} />;
}
