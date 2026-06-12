import { clsx } from 'clsx';
import { type ReactNode, type HTMLAttributes } from 'react';

const elevations = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevation?: keyof typeof elevations;
  hover?: boolean;
  padding?: string;
  className?: string;
  glass?: boolean;
  gradientTop?: boolean;
}

export function Card({
  children,
  elevation = 'md',
  hover = true,
  padding = 'md',
  className,
  glass = false,
  gradientTop = false,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        elevations[elevation],
        hover && 'card-hover',
        glass && 'card-glass',
        gradientTop && 'card-gradient-top',
        `card-pad-${padding}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
