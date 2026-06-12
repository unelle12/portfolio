import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks';
import { Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme();
  const [isMorphing, setIsMorphing] = useState(false);

  const handleToggle = () => {
    setIsMorphing(true);
    toggleTheme();
    setTimeout(() => setIsMorphing(false), 500);
  };

  return (
    <button
      onClick={handleToggle}
      className={clsx('theme-toggle', className)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={clsx('theme-toggle-icon', isMorphing && 'morphing')}>
        {isDark ? (
          <Sun size={20} strokeWidth={2} />
        ) : (
          <Moon size={20} strokeWidth={2} />
        )}
      </span>
    </button>
  );
}
