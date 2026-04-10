import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Presentation } from 'lucide-react';
import { MODULE_CONFIG, getModuleConfig } from '../../lib/modules';
import { readModuleMarkdown, extractTOC } from '../../lib/markdown';
import Header from '../../components/Header';
import TableOfContents from '../../components/TableOfContents';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export function generateStaticParams() {
  return MODULE_CONFIG.map((m) => ({ moduleId: m.id }));
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const config = getModuleConfig(moduleId);

  if (!config) {
    notFound();
  }

  const markdown = readModuleMarkdown(moduleId);
  const tocItems = extractTOC(markdown);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--site-bg)' }}>
      <Header />

      {/* Module header */}
      <div
        className="w-full"
        style={{ borderBottom: '1px solid var(--site-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--site-accent)' }}
              >
                {config.subtitle}
              </span>
              <h1
                className="text-2xl md:text-3xl font-bold mt-1"
                style={{ color: 'var(--site-text)' }}
              >
                {config.title}
              </h1>
            </div>
            <Link
              href={`/slides/${moduleId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start"
              style={{
                background: 'var(--site-bg-secondary)',
                color: 'var(--site-text-secondary)',
                border: '1px solid var(--site-border)',
              }}
            >
              <Presentation size={16} />
              발표자료 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex gap-8">
          {/* Left: Table of Contents (desktop sidebar) */}
          <TableOfContents items={tocItems} />

          {/* Right: Markdown content */}
          <main className="flex-1 min-w-0">
            {/* Mobile TOC is rendered inside TableOfContents */}
            <MarkdownRenderer content={markdown} />
          </main>
        </div>
      </div>
    </div>
  );
}
