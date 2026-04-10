'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import CopyButton from './CopyButton';
import MermaidDiagram from './MermaidDiagram';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Track used slugs per render to handle duplicates
let slugCounts: Map<string, number>;

function getUniqueSlug(text: string): string {
  let id = slugify(text);
  const count = slugCounts.get(id) || 0;
  if (count > 0) {
    id = `${id}-${count}`;
  }
  slugCounts.set(id, count + 1);
  return id;
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (!children) return '';
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (React.isValidElement(children) && children.props) {
    return extractTextFromChildren(
      (children.props as { children?: React.ReactNode }).children
    );
  }
  return '';
}

function CalloutBox({
  type,
  title,
  children,
}: {
  type: 'tip' | 'key' | 'warning';
  title: string;
  children: React.ReactNode;
}) {
  const classMap = {
    tip: 'callout-tip',
    key: 'callout-key',
    warning: 'callout-warning',
  };

  return (
    <div className={classMap[type]}>
      <div className="callout-title">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function getCalloutType(text: string): { type: 'tip' | 'key' | 'warning'; title: string } | null {
  const trimmed = text.trimStart();
  if (trimmed.startsWith('\u{1F4A1}')) return { type: 'tip', title: '\u{1F4A1} 팁' };
  if (trimmed.startsWith('\u{1F511}')) return { type: 'key', title: '\u{1F511} 핵심' };
  if (trimmed.startsWith('\u26A0\uFE0F') || trimmed.startsWith('\u26A0'))
    return { type: 'warning', title: '\u26A0\uFE0F 주의' };
  return null;
}

const components: Components = {
  h2({ children }) {
    const text = extractTextFromChildren(children);
    const id = getUniqueSlug(text);
    return <h2 id={id}>{children}</h2>;
  },

  h3({ children }) {
    const text = extractTextFromChildren(children);
    const id = getUniqueSlug(text);
    return <h3 id={id}>{children}</h3>;
  },

  blockquote({ children }) {
    const childArray = Array.isArray(children) ? children : [children];
    let firstText = '';

    for (const child of childArray) {
      if (typeof child === 'string') {
        firstText = child;
        break;
      }
      if (
        child &&
        typeof child === 'object' &&
        'props' in child &&
        child.props?.children
      ) {
        const nested = child.props.children;
        if (typeof nested === 'string') {
          firstText = nested;
          break;
        }
        if (Array.isArray(nested)) {
          for (const n of nested) {
            if (typeof n === 'string') {
              firstText = n;
              break;
            }
          }
          if (firstText) break;
        }
      }
    }

    const callout = getCalloutType(firstText);
    if (callout) {
      return (
        <CalloutBox type={callout.type} title={callout.title}>
          {children}
        </CalloutBox>
      );
    }

    return <div className="callout-default">{children}</div>;
  },

  pre({ children }) {
    let codeString = '';
    let language = '';

    if (
      children &&
      typeof children === 'object' &&
      'props' in children
    ) {
      const codeEl = children as React.ReactElement<{
        children?: string;
        className?: string;
      }>;
      codeString = typeof codeEl.props.children === 'string' ? codeEl.props.children : '';
      const className = codeEl.props.className || '';
      const langMatch = className.match(/language-(\w+)/);
      language = langMatch ? langMatch[1] : '';
    }

    // Render mermaid code blocks as diagrams
    if (language === 'mermaid') {
      return <MermaidDiagram chart={codeString} />;
    }

    return (
      <pre>
        {language && <span className="code-lang-label">{language}</span>}
        <CopyButton code={codeString} />
        {children}
      </pre>
    );
  },

  table({ children }) {
    return (
      <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--site-border)' }}>
        <table>{children}</table>
      </div>
    );
  },

  a({ href, children }) {
    const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },

  img({ src, alt }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        className="max-w-full h-auto rounded-lg"
        loading="lazy"
      />
    );
  },
};

export default function MarkdownRenderer({ content }: { content: string }) {
  // Reset slug counter for each render
  slugCounts = new Map<string, number>();

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
