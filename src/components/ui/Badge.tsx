'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  status: 'idle' | 'loading' | 'active' | 'error';
  label?: string;
}

const statusConfig = {
  idle: {
    color: 'bg-[var(--text-dim)]',
    label: 'Idle',
  },
  loading: {
    color: 'bg-yellow-500',
    label: 'Memuat...',
  },
  active: {
    color: 'bg-[var(--accent)]',
    label: 'Aktif',
  },
  error: {
    color: 'bg-[var(--danger)]',
    label: 'Error',
  },
};

export function Badge({ status, label }: BadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full">
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          config.color,
          status === 'active' && 'animate-pulse-dot'
        )}
      />
      <span className="text-xs text-[var(--text-dim)]">{displayLabel}</span>
    </div>
  );
}
