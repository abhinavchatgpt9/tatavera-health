import Link from 'next/link';
import type { ReactNode } from 'react';

const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/**
 * Renders plain text and turns [link text](/internal-path) into a real internal link.
 * Only paths that start with "/" are linked, so content can never point visitors to another site by accident.
 */
export default function InlineLinks({ text, linkClassName = 'text-blue-600 underline underline-offset-2 hover:text-blue-700' }: { text: string; linkClassName?: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={`${match.index}-${match[2]}`} href={match[2]} className={linkClassName}>
        {match[1]}
      </Link>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
