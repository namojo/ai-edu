'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import type { TOCItem } from '../lib/markdown';

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
        setActiveId(id);
        setMobileOpen(false);
      }
    },
    []
  );

  if (items.length === 0) return null;

  const tocList = (
    <nav className="space-y-0.5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`block w-full text-left text-sm py-1.5 border-l-2 transition-colors ${
            activeId === item.id ? 'toc-active' : ''
          }`}
          style={{
            paddingLeft: item.level === 3 ? '1.5rem' : '0.75rem',
            color:
              activeId === item.id
                ? 'var(--site-accent)'
                : 'var(--site-text-secondary)',
            borderLeftColor:
              activeId === item.id
                ? 'var(--site-accent)'
                : 'transparent',
            fontWeight: item.level === 2 ? 600 : 400,
          }}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--site-text-secondary)' }}
          >
            <List size={14} />
            목차
          </h3>
          {tocList}
        </div>
      </aside>

      {/* Mobile: dropdown toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium"
          style={{
            background: 'var(--site-bg-secondary)',
            border: '1px solid var(--site-border)',
            color: 'var(--site-text)',
          }}
        >
          <span className="flex items-center gap-2">
            <List size={16} />
            목차
          </span>
          {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {mobileOpen && (
          <div
            className="mt-2 px-4 py-3 rounded-lg"
            style={{
              background: 'var(--site-bg-secondary)',
              border: '1px solid var(--site-border)',
            }}
          >
            {tocList}
          </div>
        )}
      </div>
    </>
  );
}
