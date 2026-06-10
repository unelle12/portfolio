import { clsx } from 'clsx';
import { type HTMLAttributes } from 'react';

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  className?: string;
  decorative?: boolean;
}

export function Divider({ className, decorative = true, ...props }: DividerProps) {
  return (
    <hr
      role={decorative ? 'none' : 'separator'}
      className={clsx('divider', className)}
      aria-hidden={decorative}
      {...props}
    />
  );
}
