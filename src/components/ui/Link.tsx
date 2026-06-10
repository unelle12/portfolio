import { clsx } from 'clsx';
import { type ReactNode, type AnchorHTMLAttributes } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}

export function Link({
  children,
  href,
  external = false,
  className,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={clsx('link', className)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
