'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else if (newTheme === 'light') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      root.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };

  const cycle = () => {
    const next: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--site-text-secondary)' }}
        aria-label="Toggle theme"
      >
        <Monitor size={18} />
      </button>
    );
  }

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label =
    theme === 'light' ? '라이트 모드' : theme === 'dark' ? '다크 모드' : '시스템 설정';

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg transition-colors hover:opacity-80"
      style={{
        color: 'var(--site-text-secondary)',
        background: 'var(--site-bg-secondary)',
      }}
      aria-label={label}
      title={label}
    >
      <Icon size={18} />
    </button>
  );
}
