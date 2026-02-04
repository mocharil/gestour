'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function Card({
  children,
  className,
  title,
  subtitle,
  icon,
  variant = 'default',
  padding = 'md',
  animate = false,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'glass-card-static',
    gradient: 'glass-card-static gradient-border',
    elevated: 'glass-card',
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        paddingStyles[padding],
        animate && 'animate-fade-in-up',
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--gradient-subtle)] text-[var(--accent-primary)]">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
