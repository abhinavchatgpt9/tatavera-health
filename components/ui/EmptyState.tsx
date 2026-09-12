import * as React from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center dark:border-slate-800', className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex items-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
