import { clsx } from 'clsx';
import { type ReactNode, type HTMLAttributes } from 'react';

const variants = {
  default: 'badge-default',
  accent: 'badge-accent',
  teal: 'badge-teal',
  yellow: 'badge-yellow',
  outline: 'badge-outline',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  pulse?: boolean;
  shimmer?: boolean;
}

export function Badge({ children, variant = 'default', className, pulse = false, shimmer = false, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        variants[variant],
        pulse && 'badge-pulse',
        shimmer && 'badge-shimmer',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
