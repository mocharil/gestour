'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = 'md',
}: ToggleProps) {
  const sizeStyles = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      offset: 'top-0.5 left-0.5',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
      offset: 'top-1 left-1',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-7',
      offset: 'top-1 left-1',
    },
  };

  const styles = sizeStyles[size];

  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer select-none group',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex flex-shrink-0 rounded-full',
          'transition-all duration-[var(--transition-normal)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
          styles.track,
          checked
            ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)]'
            : 'bg-[var(--glass-border)]'
        )}
      >
        {/* Glow effect when active */}
        {checked && (
          <span className="absolute inset-0 rounded-full bg-[var(--accent-primary)] blur-md opacity-30" />
        )}

        {/* Thumb */}
        <span
          className={cn(
            'absolute rounded-full bg-white shadow-lg',
            'transition-all duration-[var(--transition-normal)]',
            'group-hover:scale-110',
            styles.thumb,
            styles.offset,
            checked && styles.translate
          )}
        >
          {/* Inner dot */}
          <span
            className={cn(
              'absolute inset-0 m-auto w-1.5 h-1.5 rounded-full',
              'transition-all duration-[var(--transition-normal)]',
              checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-tertiary)]'
            )}
          />
        </span>
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[var(--text-tertiary)]">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
