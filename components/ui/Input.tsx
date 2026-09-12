import * as React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        'flex h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
        'dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800',
        error
          ? 'border-red-300 focus:ring-red-500/40 focus:border-red-400 dark:border-red-800'
          : 'border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

function HelperText({ className, error, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { error?: boolean }) {
  if (!children) return null;
  return (
    <p
      className={cn('mt-1.5 text-xs', error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400', className)}
      role={error ? 'alert' : undefined}
      {...props}
    >
      {children}
    </p>
  );
}

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className, error = false, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(
        'flex w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
        'dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800',
        error
          ? 'border-red-300 focus:ring-red-500/40 focus:border-red-400 dark:border-red-800'
          : 'border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Input, Label, HelperText, Textarea };
