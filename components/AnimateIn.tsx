'use client';

import { useEffect, useRef, ReactNode, ElementType } from 'react';

type Variant = 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in' | 'fade-in';

interface AnimateInProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: ElementType;
  threshold?: number;
}

const INITIAL: Record<Variant, string> = {
  'fade-up':    'opacity-0 translate-y-8',
  'fade-left':  'opacity-0 -translate-x-8',
  'fade-right': 'opacity-0 translate-x-8',
  'scale-in':   'opacity-0 scale-90',
  'fade-in':    'opacity-0',
};

const VISIBLE_CLASSES = ['opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100'];

export default function AnimateIn({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold = 0.12,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          const initialClasses = INITIAL[variant].split(' ').filter(Boolean);
          el.classList.remove(...initialClasses);
          el.classList.add(...VISIBLE_CLASSES);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay, threshold]);

  const initial = INITIAL[variant];

  return (
    <Tag
      ref={ref}
      className={`${initial} transition-all duration-700 ease-out will-change-transform ${className}`}
    >
      {children}
    </Tag>
  );
}
