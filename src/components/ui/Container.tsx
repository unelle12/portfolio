import { clsx } from 'clsx';
import { type ElementType, type ReactNode, type HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'default' | 'lg' | '2xl' | 'full';
  className?: string;
  as?: ElementType;
}

export function Container({
  children,
  size = 'default',
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  const sizeClass = {
    sm: 'container container-sm',
    default: 'container',
    lg: 'container container-lg',
    '2xl': 'container container-2xl',
    full: 'w-full',
  }[size];

  return (
    <Component className={clsx(sizeClass, className)} {...props}>
      {children}
    </Component>
  );
}
