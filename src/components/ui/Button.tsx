'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'gradient-button',
    secondary: 'glass-button',
    ghost: `
      bg-transparent border-none
      text-[var(--text-secondary)]
      hover:text-[var(--text-primary)]
      hover:bg-[var(--glass-bg)]
    `,
    danger: `
      bg-[var(--accent-danger)]/10
      border border-[var(--accent-danger)]/30
      text-[var(--accent-danger)]
      hover:bg-[var(--accent-danger)]/20
      hover:border-[var(--accent-danger)]/50
    `,
    success: `
      bg-[var(--accent-success)]/10
      border border-[var(--accent-success)]/30
      text-[var(--accent-success)]
      hover:bg-[var(--accent-success)]/20
      hover:border-[var(--accent-success)]/50
    `,
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    icon: 'p-2.5 aspect-square',
  };

  const isGradient = variant === 'primary';
  const isGlass = variant === 'secondary';

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center font-medium rounded-xl',
        'transition-all duration-[var(--transition-normal)]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        !isGradient && !isGlass && 'backdrop-blur-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="spinner w-4 h-4" />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
