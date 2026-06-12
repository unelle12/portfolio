import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  id?: string;
  floating?: boolean;
}

export const Input = forwardRef(function Input(
  { label, error, className, id, floating = false, ...props }: InputProps,
  ref: React.Ref<HTMLInputElement>
) {
  if (floating && label) {
    return (
      <div className={clsx('form-field form-field-floating', error && 'has-error')}>
        <input
          ref={ref}
          id={id}
          className={clsx('input', error && 'input-error', className)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder=" "
          {...props}
        />
        <label htmlFor={id} className="form-label">
          {label}
        </label>
        {error && (
          <span id={`${id}-error`} className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx('input', error && 'input-error', className)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
