'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { List, Menu, X } from 'lucide-react';
import type { TOCItem } from '../lib/markdown';

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isClickScrolling = useRef(false);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        // Collect all currently visible headings
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Pick the one closest to the top
          let closest = visibleEntries[0];
          for (const entry of visibleEntries) {
            if (entry.boundingClientRect.top < closest.boundingClientRect.top) {
              closest = entry;
            }
          }
          setActiveId(closest.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
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
        isClickScrolling.current = true;
        setActiveId(id);
        setMobileOpen(false);

        const yOffset = -100;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);

        // Re-enable observer after scroll completes
        setTimeout(() => {
          isClickScrolling.current = false;
        }, 800);
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

      {/* Mobile: floating hamburger toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="목차 열기"
        className="lg:hidden fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: 'var(--site-accent)',
          color: '#FFFFFF',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile: slide-in drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />
          <aside
            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] overflow-y-auto p-5"
            style={{
              background: 'var(--site-bg)',
              borderRight: '1px solid var(--site-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--site-text-secondary)' }}
              >
                <List size={14} />
                목차
              </h3>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="목차 닫기"
                className="p-1 rounded"
                style={{ color: 'var(--site-text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>
            {tocList}
          </aside>
        </>
      )}
    </>
  );
}
