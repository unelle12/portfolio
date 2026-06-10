import { clsx } from 'clsx';
import { type ElementType, type ReactNode } from 'react';

const tagMap: Record<string, string> = {
  display: 'text-display',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'text-base',
  span: '',
};

interface HeadingProps {
  children: ReactNode;
  as?: ElementType;
  variant?: string;
  className?: string;
  center?: boolean;
  [key: string]: unknown;
}

export function Heading({
  children,
  as: Component = 'h2',
  variant,
  className,
  center = false,
  ...props
}: HeadingProps) {
  const tag = variant || Component;
  const headingClass = tagMap[tag as string] || tagMap.h2;

  return (
    <Component
      className={clsx(
        'font-heading',
        headingClass,
        center && 'text-center',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
