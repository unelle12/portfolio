import { clsx } from 'clsx';
import { type ButtonHTMLAttributes, type ReactNode, type ElementType, useCallback, useRef } from 'react';

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
  loading?: boolean;
  ripple?: boolean;
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
  loading = false,
  ripple = true,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const createRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || disabled || loading) return;
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const rippleEl = document.createElement('span');
      rippleEl.className = 'ripple';
      rippleEl.style.width = rippleEl.style.height = `${size}px`;
      rippleEl.style.left = `${x}px`;
      rippleEl.style.top = `${y}px`;
      btn.appendChild(rippleEl);

      setTimeout(() => rippleEl.remove(), 600);
    },
    [ripple, disabled, loading]
  );

  const combinedClassName = clsx(
    'btn',
    variants[variant],
    sizes[size],
    loading && 'btn-loading',
    className
  );

  if (Component === 'a' && href) {
    return (
      <a
        href={href}
        className={combinedClassName}
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
      ref={btnRef}
      type={type}
      disabled={disabled || loading}
      className={combinedClassName}
      onClick={createRipple}
      {...props}
    >
      {children}
    </Component>
  );
}
