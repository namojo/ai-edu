'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import type { PresentationSlide } from '../types';
import { MODULE_CONFIG } from '../lib/modules';

const MODULE_COLORS = [
  '#3B82F6', // Module 1 - Blue
  '#8B5CF6', // Module 2 - Violet
  '#10B981', // Module 3 - Emerald
  '#F59E0B', // Module 4 - Amber
  '#EF4444', // Module 5 - Red
  '#06B6D4', // Module 6 - Cyan
];

interface Props {
  slides: PresentationSlide[];
}

/** Parse **bold** markdown to JSX */
function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function PresentationViewer({ slides }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slide = slides[currentIndex];
  const accentColor = MODULE_COLORS[slide?.moduleIndex ?? 0];

  // Group slides by module for navigation
  const moduleSlideRanges = useMemo(() => {
    const ranges: { start: number; end: number; moduleIndex: number }[] = [];
    let currentModule = -1;
    slides.forEach((s, idx) => {
      if (s.type === 'cover') return;
      if (s.moduleIndex !== currentModule) {
        currentModule = s.moduleIndex;
        ranges.push({ start: idx, end: idx, moduleIndex: s.moduleIndex });
      } else {
        ranges[ranges.length - 1].end = idx;
      }
    });
    return ranges;
  }, [slides]);

  // Get current module's dot range
  const currentModuleRange = useMemo(() => {
    if (slide?.type === 'cover') return null;
    return moduleSlideRanges.find(
      r => currentIndex >= r.start && currentIndex <= r.end
    ) ?? null;
  }, [currentIndex, slide, moduleSlideRanges]);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || index === currentIndex || isAnimating) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 50);
  }, [currentIndex, slides.length, isAnimating]);

  const goNext = useCallback(() => goTo(Math.min(currentIndex + 1, slides.length - 1)), [currentIndex, slides.length, goTo]);
  const goPrev = useCallback(() => goTo(Math.max(currentIndex - 1, 0)), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(slides.length - 1);
          break;
        case 'Escape':
          // Will use Link for navigation
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, goTo, slides.length]);

  // Touch swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  if (!slide) return null;

  // Module dots: show up to ~40 dots for current module, or collapse if too many
  const renderDots = () => {
    if (!currentModuleRange) return null;
    const { start, end } = currentModuleRange;
    const count = end - start + 1;
    const maxDots = 30;

    if (count <= maxDots) {
      return (
        <div className="flex items-center gap-1 justify-center flex-wrap">
          {Array.from({ length: count }, (_, i) => {
            const idx = start + i;
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={isActive ? 'pv-dot pv-dot-active' : 'pv-dot'}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      );
    }

    // For very large modules, show a progress bar instead
    const progress = ((currentIndex - start) / (end - start)) * 100;
    return (
      <div className="w-48 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${progress}%`, background: accentColor }}
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="pv-container"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Top bar */}
      <div className="pv-topbar">
        <Link href="/" className="pv-home-link">
          AI 교육
        </Link>
        <span className="pv-slide-counter">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      {/* Module color bar (left edge) */}
      <div className="pv-color-bar" style={{ background: accentColor }} />

      {/* Slide content area with 16:9 aspect ratio */}
      <div className="pv-stage">
        <div
          className={`pv-slide ${isAnimating ? (direction === 'next' ? 'pv-slide-exit-next' : 'pv-slide-exit-prev') : 'pv-slide-enter'}`}
        >
          {renderSlideContent(slide, accentColor)}
        </div>
      </div>

      {/* Click zones for navigation */}
      <button className="pv-click-zone pv-click-prev" onClick={goPrev} aria-label="Previous slide" />
      <button className="pv-click-zone pv-click-next" onClick={goNext} aria-label="Next slide" />

      {/* Bottom navigation */}
      <div className="pv-bottombar">
        {/* Module tabs */}
        <div className="pv-module-tabs">
          {MODULE_CONFIG.map((mod, idx) => {
            const range = moduleSlideRanges.find(r => r.moduleIndex === idx);
            if (!range) return null;
            const isActive = slide.moduleIndex === idx;
            return (
              <button
                key={mod.id}
                onClick={() => goTo(range.start)}
                className={`pv-module-tab ${isActive ? 'pv-module-tab-active' : ''}`}
                style={isActive ? { borderColor: MODULE_COLORS[idx], color: MODULE_COLORS[idx] } : undefined}
              >
                <span className="pv-module-tab-num">{idx + 1}</span>
                <span className="pv-module-tab-label hidden sm:inline">{mod.title.length > 10 ? mod.title.substring(0, 10) + '...' : mod.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dots */}
        <div className="pv-dots">
          {renderDots()}
        </div>
      </div>
    </div>
  );
}

function renderSlideContent(slide: PresentationSlide, accentColor: string) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide slide={slide} />;
    case 'module-title':
      return <ModuleTitleSlide slide={slide} accent={accentColor} />;
    case 'section-title':
      return <SectionTitleSlide slide={slide} accent={accentColor} />;
    case 'content':
      return <ContentSlide slide={slide} accent={accentColor} />;
    case 'table':
      return <TableSlide slide={slide} accent={accentColor} />;
    case 'code':
      return <CodeSlide slide={slide} />;
    case 'comparison':
      return <ComparisonSlide slide={slide} />;
    case 'tip':
      return <TipSlide slide={slide} accent={accentColor} />;
    case 'summary':
      return <SummarySlide slide={slide} accent={accentColor} />;
    default:
      return <ContentSlide slide={slide} accent={accentColor} />;
  }
}

function CoverSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="pv-cover">
      <div className="pv-cover-inner">
        <div className="pv-cover-badge">AI Education</div>
        <h1 className="pv-cover-title">{slide.title}</h1>
        <p className="pv-cover-subtitle">{slide.subtitle}</p>
        <div className="pv-cover-tools">
          {['ChatGPT', 'Claude', 'Gemini', 'Perplexity', '사내 LLM'].map(name => (
            <span key={name} className="pv-cover-tool">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModuleTitleSlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  return (
    <div className="pv-module-title-slide" style={{ background: accent }}>
      <div className="pv-module-title-inner">
        <div className="pv-module-title-badge">{slide.subtitle}</div>
        <h1 className="pv-module-title-text">{slide.title}</h1>
        {slide.notes && <p className="pv-module-title-meta">{slide.notes}</p>}
      </div>
    </div>
  );
}

function SectionTitleSlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  return (
    <div className="pv-section-title-slide">
      <div className="pv-section-title-inner">
        <div className="pv-section-title-line" style={{ background: accent }} />
        <h1 className="pv-section-title-text">{slide.title}</h1>
        {slide.subtitle && <p className="pv-section-title-sub">{slide.subtitle}</p>}
      </div>
    </div>
  );
}

function ContentSlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  return (
    <div className="pv-content-slide">
      <h2 className="pv-content-title">{slide.title}</h2>
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="pv-content-bullets">
          {slide.bullets.map((b, i) => (
            <li key={i} className="pv-content-bullet">
              <span className="pv-bullet-dot" style={{ background: accent }} />
              <span className="pv-bullet-text">{parseBold(b)}</span>
            </li>
          ))}
        </ul>
      )}
      {slide.content && !slide.bullets && (
        <div className="pv-content-text">{parseBold(slide.content)}</div>
      )}
    </div>
  );
}

function TableSlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  if (!slide.table) return null;
  const lightAccent = accent + '18';
  return (
    <div className="pv-table-slide">
      <h2 className="pv-table-title">{slide.title}</h2>
      <div className="pv-table-wrapper">
        <table className="pv-table">
          <thead>
            <tr>
              {slide.table.headers.map((h, i) => (
                <th key={i} style={{ background: lightAccent, borderBottomColor: accent }}>{parseBold(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slide.table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{parseBold(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CodeSlide({ slide }: { slide: PresentationSlide }) {
  return (
    <div className="pv-code-slide">
      <h2 className="pv-code-title">{slide.title}</h2>
      <pre className="pv-code-block">
        <code>{slide.code}</code>
      </pre>
    </div>
  );
}

function ComparisonSlide({ slide }: { slide: PresentationSlide }) {
  if (!slide.beforeAfter) return null;
  return (
    <div className="pv-comparison-slide">
      <h2 className="pv-comparison-title">{slide.title}</h2>
      <div className="pv-comparison-grid">
        <div className="pv-comparison-before">
          <div className="pv-comparison-label pv-comparison-label-before">Before</div>
          <div className="pv-comparison-content">{slide.beforeAfter.before.content}</div>
        </div>
        <div className="pv-comparison-after">
          <div className="pv-comparison-label pv-comparison-label-after">After</div>
          <div className="pv-comparison-content">{slide.beforeAfter.after.content}</div>
        </div>
      </div>
    </div>
  );
}

function TipSlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  const icon = slide.content?.includes('핵심') ? '\uD83D\uDD11' :
    slide.content?.includes('주의') ? '\u26A0\uFE0F' : '\uD83D\uDCA1';
  return (
    <div className="pv-tip-slide" style={{ borderLeftColor: accent, background: accent + '0A' }}>
      <div className="pv-tip-inner">
        <span className="pv-tip-icon">{icon}</span>
        <div className="pv-tip-content">{slide.content && parseBold(slide.content)}</div>
      </div>
    </div>
  );
}

function SummarySlide({ slide, accent }: { slide: PresentationSlide; accent: string }) {
  return (
    <div className="pv-summary-slide">
      <h2 className="pv-summary-title">
        <span className="pv-summary-check" style={{ color: accent }}>&#10003;</span>
        {slide.title}
      </h2>
      {slide.bullets && (
        <ul className="pv-summary-bullets">
          {slide.bullets.map((b, i) => (
            <li key={i} className="pv-summary-bullet">
              <span className="pv-summary-bullet-check" style={{ color: accent }}>&#10003;</span>
              <span>{parseBold(b)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
