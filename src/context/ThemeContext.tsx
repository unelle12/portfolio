"use client";

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ThemeContext, type ThemeContextType } from './ThemeContextObject';

const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
};

function getSystemTheme() {
  if (typeof window === 'undefined') return THEMES.light;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.dark
    : THEMES.light;
}

function applyTheme(theme: string) {
  const resolved = theme === THEMES.system ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolved);
}

export function ThemeProvider({ children, defaultTheme = THEMES.system }: { children: ReactNode; defaultTheme?: string }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio-theme') || defaultTheme;
    }
    return defaultTheme;
  });

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = theme === THEMES.dark ? THEMES.light : THEMES.dark;
    setTheme(current);
  }, [theme, setTheme]);

  const resolvedTheme = theme === THEMES.system ? getSystemTheme() : theme;

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === THEMES.system) {
        applyTheme(THEMES.system);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === THEMES.dark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
