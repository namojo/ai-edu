'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import CopyButton from './CopyButton';

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
  blockquote({ children }) {
    // Check first text child for emoji callout markers
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
    // Extract code string and language from children
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
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
