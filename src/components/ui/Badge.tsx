'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  status?: 'idle' | 'loading' | 'active' | 'error' | 'success' | 'warning' | 'info';
  label?: string;
  variant?: 'default' | 'dot' | 'pill';
  size?: 'sm' | 'md';
  pulse?: boolean;
  icon?: React.ReactNode;
}

const statusConfig = {
  idle: {
    className: 'badge',
    dotColor: 'bg-[var(--text-tertiary)]',
    label: 'Idle',
  },
  loading: {
    className: 'badge badge-warning',
    dotColor: 'bg-[var(--accent-warning)]',
    label: 'Memuat...',
  },
  active: {
    className: 'badge badge-success',
    dotColor: 'bg-[var(--accent-success)]',
    label: 'Aktif',
  },
  error: {
    className: 'badge badge-danger',
    dotColor: 'bg-[var(--accent-danger)]',
    label: 'Error',
  },
  success: {
    className: 'badge badge-success',
    dotColor: 'bg-[var(--accent-success)]',
    label: 'Sukses',
  },
  warning: {
    className: 'badge badge-warning',
    dotColor: 'bg-[var(--accent-warning)]',
    label: 'Peringatan',
  },
  info: {
    className: 'badge badge-info',
    dotColor: 'bg-[var(--accent-primary)]',
    label: 'Info',
  },
};

export function Badge({
  status = 'idle',
  label,
  variant = 'dot',
  size = 'md',
  pulse = false,
  icon,
}: BadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2',
  };

  const shouldPulse = pulse || status === 'active' || status === 'loading';

  return (
    <div
      className={cn(
        config.className,
        sizeStyles[size],
        'inline-flex items-center font-medium'
      )}
    >
      {variant === 'dot' && (
        <span className="relative flex h-2 w-2">
          {shouldPulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                config.dotColor,
                'animate-ping'
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              config.dotColor
            )}
          />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{displayLabel}</span>
    </div>
  );
}
