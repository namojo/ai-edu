'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [renderKey, setRenderKey] = useState(0);

  const renderChart = useCallback(async () => {
    const dark = isDarkMode();
    mermaid.initialize({
      startOnLoad: false,
      theme: dark ? 'dark' : 'default',
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
    });

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    try {
      const { svg: renderedSvg } = await mermaid.render(id, chart);
      setSvg(renderedSvg);
    } catch (err) {
      console.error('Mermaid render error:', err);
      setSvg('');
    }
  }, [chart]);

  useEffect(() => {
    renderChart();
  }, [renderChart, renderKey]);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          setRenderKey((k) => k + 1);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setRenderKey((k) => k + 1);
    mql.addEventListener('change', handler);

    return () => {
      observer.disconnect();
      mql.removeEventListener('change', handler);
    };
  }, []);

  if (!svg) {
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
