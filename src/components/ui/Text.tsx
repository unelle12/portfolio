import { clsx } from 'clsx';
import { type ElementType, type ReactNode } from 'react';

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

interface TextProps {
  children: ReactNode;
  size?: keyof typeof sizeMap;
  muted?: boolean;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function Text({
  children,
  size = 'base',
  muted = false,
  as: Component = 'p',
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={clsx(
        sizeMap[size],
        muted && 'text-muted',
        className
      )}
      style={muted ? { color: 'var(--color-text-muted)' } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
