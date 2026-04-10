'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Presentation } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--site-bg)',
        borderBottom: '1px solid var(--site-border)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        {/* Logo / Title */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          style={{ color: 'var(--site-text)' }}
        >
          <span>AI 교육</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/#modules"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: pathname.startsWith('/learn')
                ? 'var(--site-accent)'
                : 'var(--site-text-secondary)',
            }}
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">학습하기</span>
          </Link>
          <Link
            href="/#modules"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: pathname.startsWith('/slides')
                ? 'var(--site-accent)'
                : 'var(--site-text-secondary)',
            }}
          >
            <Presentation size={16} />
            <span className="hidden sm:inline">발표자료</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
