'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  target: string; // e.g. "100,000+" or "4.9"
  duration?: number;
  className?: string;
}

function parseTarget(raw: string): { prefix: string; number: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9,]+\.?[0-9]*)([^0-9]*)$/);
  if (!match) return { prefix: '', number: 0, suffix: raw };
  return {
    prefix: match[1] || '',
    number: parseFloat(match[2].replace(/,/g, '')),
    suffix: match[3] || '',
  };
}

function formatNumber(n: number, originalHadCommas: boolean, originalDecimals: number): string {
  if (originalDecimals > 0) return n.toFixed(originalDecimals);
  if (originalHadCommas) return Math.round(n).toLocaleString('en-US');
  return Math.round(n).toString();
}

export default function AnimatedCounter({ target, duration = 1800, className }: Props) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const parsed = parseTarget(target);
    const hasCommas = /,/.test(target);
    const decimalPlaces = (target.match(/\.(\d+)/) || ['', ''])[1].length;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = parsed.number * eased;
          setDisplay(parsed.prefix + formatNumber(current, hasCommas, decimalPlaces) + parsed.suffix);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
