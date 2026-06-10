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
}

export function Card({
  children,
  elevation = 'md',
  hover = true,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        elevations[elevation],
        hover && 'card-hover',
        `card-pad-${padding}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
