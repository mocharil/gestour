'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className, title }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4',
        className
      )}
    >
      {title && (
        <h3 className="text-sm font-medium text-[var(--text-dim)] mb-3 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
