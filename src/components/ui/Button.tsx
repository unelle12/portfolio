import { clsx } from 'clsx';
import { type ButtonHTMLAttributes, type ReactNode, type ElementType } from 'react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  accent: 'btn-accent',
};

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  type = 'button',
  as: Component = 'button',
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  if (Component === 'a' && href) {
    return (
      <a
        href={href}
        className={clsx('btn', variants[variant], sizes[size], className)}
        target={target}
        rel={rel}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <Component
      type={type}
      disabled={disabled}
      className={clsx('btn', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
