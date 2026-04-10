'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn ${copied ? 'copied' : ''}`}
      aria-label={copied ? '복사됨' : '코드 복사'}
    >
      {copied ? (
        <>
          <Check size={12} />
          <span>복사됨!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>복사</span>
        </>
      )}
    </button>
  );
}
