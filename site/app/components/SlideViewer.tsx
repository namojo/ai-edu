'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lightbulb,
  Target,
  BookOpen,
  Code,
  LayoutGrid,
  FileText,
  Wrench,
  ClipboardCheck,
} from 'lucide-react';
import type { Slide, Module, SlidesData } from '../types';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/ai-edu';

/* ─────────── Image with fallback ─────────── */
function SlideImage({ slide }: { slide: Slide }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const src = `${basePath}/slides/${slide.id}.png`;

  useEffect(() => {
    setStatus('loading');
  }, [slide.id]);

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 200 }}>
      {status === 'loading' && (
        <div className="w-full aspect-[4/3] skeleton rounded-lg" />
      )}
      {status !== 'error' && (
        <img
          src={src}
          alt={slide.title}
          className="w-full h-auto rounded-lg object-contain"
          style={{ display: status === 'loaded' ? 'block' : 'none' }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && <PlaceholderSVG type={slide.type} title={slide.title} />}
    </div>
  );
}

/* ─────────── SVG Placeholders ─────────── */
function PlaceholderSVG({ type, title }: { type: string; title: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    title: <BookOpen size={48} />,
    objectives: <Target size={48} />,
    concept: <Lightbulb size={48} />,
    comparison: <LayoutGrid size={48} />,
    example: <Code size={48} />,
    diagram: <FileText size={48} />,
    tip: <Lightbulb size={48} />,
    practice: <Wrench size={48} />,
    summary: <ClipboardCheck size={48} />,
  };

  const labelMap: Record<string, string> = {
    title: '타이틀',
    objectives: '학습 목표',
    concept: '개념',
    comparison: '비교',
    example: '예시',
    diagram: '다이어그램',
    tip: '팁',
    practice: '실습',
    summary: '요약',
  };

  return (
    <div
      className="w-full aspect-[4/3] rounded-lg flex flex-col items-center justify-center gap-3 p-6"
      style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border)' }}
    >
      <div style={{ color: 'var(--accent)' }}>{iconMap[type] || <FileText size={48} />}</div>
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {labelMap[type] || type}
      </span>
      <span
        className="text-xs text-center max-w-48"
        style={{ color: 'var(--text-secondary)', opacity: 0.7 }}
      >
        {title}
      </span>
    </div>
  );
}

/* ─────────── Helper: render bold markdown ─────────── */
function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/* ─────────── Shared: DataTable ─────────── */
function DataTable({ table }: { table: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="overflow-x-auto mt-4 rounded-lg" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2.5 text-left font-semibold whitespace-nowrap"
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2.5 align-top"
                  style={{
                    color: 'var(--text-primary)',
                    borderBottom: ri < table.rows.length - 1 ? '1px solid var(--border)' : 'none',
                    background: ci === 0 ? 'var(--bg-secondary)' : 'transparent',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────── Slide Type Renderers ─────────── */

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
          {slide.subtitle}
        </p>
      )}
      {slide.notes && (
        <p className="mt-6 text-sm" style={{ color: 'var(--accent)' }}>
          {slide.notes}
        </p>
      )}
    </div>
  );
}

function ObjectivesSlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      <ol className="space-y-4">
        {slide.bullets?.map((b, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              {i + 1}
            </span>
            <span className="text-base leading-relaxed pt-0.5" style={{ color: 'var(--text-primary)' }}>
              {b}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ConceptSlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      {slide.content && (
        <p className="mb-4 text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {renderBoldText(slide.content)}
        </p>
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="space-y-3">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {renderBoldText(b)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {slide.table && <DataTable table={slide.table} />}
      {slide.notes && (
        <p className="mt-6 text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          {slide.notes}
        </p>
      )}
    </div>
  );
}

function ComparisonSlide({ slide }: { slide: Slide }) {
  if (slide.beforeAfter) {
    return (
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {slide.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-lg p-5"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3 text-sm" style={{ color: '#B55B5B' }}>
              {slide.beforeAfter.before.title}
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
              {slide.beforeAfter.before.content}
            </p>
          </div>
          <div
            className="rounded-lg p-5"
            style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}
          >
            <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--accent-dark)' }}>
              {slide.beforeAfter.after.title}
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
              {slide.beforeAfter.after.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (slide.table) {
    return (
      <div className="py-4">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {slide.subtitle}
          </p>
        )}
        <DataTable table={slide.table} />
      </div>
    );
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {slide.subtitle}
        </p>
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="space-y-3">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {renderBoldText(b)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {slide.notes && (
        <p className="mt-4 text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          {slide.notes}
        </p>
      )}
    </div>
  );
}

function ExampleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {slide.subtitle}
        </p>
      )}
      {slide.code && <pre className="code-block">{slide.code}</pre>}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {renderBoldText(b)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DiagramSlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="space-y-3">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {renderBoldText(b)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {slide.notes && (
        <p className="mt-6 text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          {slide.notes}
        </p>
      )}
    </div>
  );
}

function TipSlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} style={{ color: 'var(--accent)' }} />
          <h2 className="text-xl font-bold" style={{ color: 'var(--accent-dark)' }}>
            {slide.title}
          </h2>
        </div>
        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-3">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {renderBoldText(b)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {slide.table && <DataTable table={slide.table} />}
        {slide.content && (
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {renderBoldText(slide.content)}
          </p>
        )}
      </div>
    </div>
  );
}

function PracticeSlide({ slide }: { slide: Slide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      {slide.content && (
        <div className="mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-lg p-4 text-left transition-colors"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {open ? '접기' : '문제 보기'}
            </span>
            {open ? (
              <ChevronUp size={18} style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>
          <div className={`accordion-content ${open ? 'open' : ''}`}>
            <div className="p-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
              {renderBoldText(slide.content)}
            </div>
          </div>
        </div>
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="space-y-3">
          {slide.bullets.map((b, i) => (
            <li key={i} className="flex gap-3">
              <Wrench size={16} className="flex-shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
              <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {renderBoldText(b)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SummarySlide({ slide }: { slide: Slide }) {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {slide.title}
      </h2>
      <ul className="space-y-3">
        {slide.bullets?.map((b, i) => (
          <li key={i} className="flex gap-3">
            <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {renderBoldText(b)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderSlideContent(slide: Slide) {
  switch (slide.type) {
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'objectives':
      return <ObjectivesSlide slide={slide} />;
    case 'concept':
      return <ConceptSlide slide={slide} />;
    case 'comparison':
      return <ComparisonSlide slide={slide} />;
    case 'example':
      return <ExampleSlide slide={slide} />;
    case 'diagram':
      return <DiagramSlide slide={slide} />;
    case 'tip':
      return <TipSlide slide={slide} />;
    case 'practice':
      return <PracticeSlide slide={slide} />;
    case 'summary':
      return <SummarySlide slide={slide} />;
    default:
      return <ConceptSlide slide={slide} />;
  }
}

/* ─────────── Dot Navigation ─────────── */
function DotNav({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.children[current] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [current]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 max-w-full"
      style={{ scrollbarWidth: 'none' }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="flex-shrink-0 h-2 transition-all duration-200 cursor-pointer"
          style={{
            width: i === current ? 24 : 8,
            borderRadius: i === current ? 4 : '50%',
            background: i === current ? 'var(--accent)' : 'var(--border)',
          }}
          aria-label={`슬라이드 ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─────────── Main Viewer Component ─────────── */
export default function SlideViewer({ moduleId }: { moduleId: string }) {
  const [module_, setModule] = useState<Module | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    fetch(`${basePath}/slides.json`)
      .then((r) => r.json())
      .then((data: SlidesData) => {
        const mod = data.modules.find((m) => m.id === moduleId);
        if (mod) setModule(mod);
      });
  }, [moduleId]);

  const totalSlides = module_?.slides.length ?? 0;

  const goTo = useCallback(
    (idx: number) => {
      if (!module_ || animating) return;
      const clamped = Math.max(0, Math.min(idx, totalSlides - 1));
      if (clamped === currentIdx) return;
      setDirection(clamped > currentIdx ? 'right' : 'left');
      setAnimating(true);
      setTimeout(() => {
        setCurrentIdx(clamped);
        setAnimating(false);
      }, 200);
    },
    [module_, currentIdx, totalSlides, animating],
  );

  const goNext = useCallback(() => goTo(currentIdx + 1), [goTo, currentIdx]);
  const goPrev = useCallback(() => goTo(currentIdx - 1), [goTo, currentIdx]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Home') goTo(0);
      else if (e.key === 'End') goTo(totalSlides - 1);
      else if (e.key === 'Escape') {
        window.location.href = basePath + '/';
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, goTo, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (!module_) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="w-8 h-8 skeleton rounded-full" />
      </div>
    );
  }

  const slide = module_.slides[currentIdx];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Home size={16} />
          <span className="hidden sm:inline">홈</span>
        </Link>
        <h1 className="text-sm font-semibold truncate mx-4" style={{ color: 'var(--text-primary)' }}>
          {module_.title}
        </h1>
        <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          {currentIdx + 1} / {totalSlides}
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-4 py-6 gap-6 overflow-hidden">
        {/* Left: Image (40%) */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <SlideImage slide={slide} />
        </div>

        {/* Right: Content (60%) */}
        <div
          className="w-full md:w-3/5 overflow-y-auto"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === 'right'
                ? 'translateX(20px)'
                : 'translateX(-20px)'
              : 'translateX(0)',
            transition: 'opacity 200ms ease-out, transform 200ms ease-out',
          }}
        >
          {renderSlideContent(slide)}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav
        className="flex items-center justify-between px-4 py-3 gap-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
      >
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors disabled:opacity-30"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <div className="flex-1 flex justify-center overflow-hidden">
          <DotNav total={totalSlides} current={currentIdx} onSelect={goTo} />
        </div>

        <button
          onClick={goNext}
          disabled={currentIdx === totalSlides - 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors disabled:opacity-30"
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
          aria-label="다음 슬라이드"
        >
          <ChevronRight size={20} style={{ color: 'var(--text-primary)' }} />
        </button>
      </nav>
    </div>
  );
}
