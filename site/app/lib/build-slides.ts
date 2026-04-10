import { readModuleMarkdown } from './markdown';
import { MODULE_CONFIG } from './modules';
import type { PresentationSlide } from '../types';

const MAX_BULLETS = 6;
const MAX_TABLE_ROWS = 7;

let slideCounter = 0;

function makeId(moduleIndex: number, label: string): string {
  slideCounter++;
  return `m${moduleIndex}-${label}-${slideCounter}`;
}

/**
 * Parse a markdown table string into headers and rows.
 */
function parseMarkdownTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null;
  const headerLine = lines[0];
  const separatorLine = lines[1];
  if (!separatorLine.match(/^\|[\s\-:|]+\|/)) return null;

  const parseLine = (line: string): string[] =>
    line.split('|').slice(1, -1).map(cell => cell.trim());

  const headers = parseLine(headerLine);
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    if (!lines[i].startsWith('|')) break;
    rows.push(parseLine(lines[i]));
  }
  return { headers, rows };
}

/**
 * Split table rows into chunks if too large.
 */
function splitTableRows(table: { headers: string[]; rows: string[][] }): { headers: string[]; rows: string[][] }[] {
  if (table.rows.length <= MAX_TABLE_ROWS) return [table];
  const chunks: { headers: string[]; rows: string[][] }[] = [];
  for (let i = 0; i < table.rows.length; i += MAX_TABLE_ROWS) {
    chunks.push({ headers: table.headers, rows: table.rows.slice(i, i + MAX_TABLE_ROWS) });
  }
  return chunks;
}

/**
 * Split bullets array into chunks.
 */
function splitBullets(bullets: string[]): string[][] {
  if (bullets.length <= MAX_BULLETS) return [bullets];
  const chunks: string[][] = [];
  for (let i = 0; i < bullets.length; i += MAX_BULLETS) {
    chunks.push(bullets.slice(i, i + MAX_BULLETS));
  }
  return chunks;
}

/**
 * Detect if a blockquote line is a tip/key/warning.
 */
function detectTipType(line: string): string | null {
  if (line.includes('💡')) return 'tip';
  if (line.includes('🔑')) return 'key';
  if (line.includes('⚠')) return 'warning';
  return null;
}

/**
 * Collect consecutive blockquote lines.
 */
function collectBlockquote(lines: string[], startIdx: number): { text: string; endIdx: number } {
  let text = '';
  let i = startIdx;
  while (i < lines.length && lines[i].startsWith('> ')) {
    const content = lines[i].substring(2).trim();
    if (text) text += '\n';
    text += content;
    i++;
  }
  return { text, endIdx: i };
}

/**
 * Collect consecutive bullet lines.
 */
function collectBullets(lines: string[], startIdx: number): { bullets: string[]; endIdx: number } {
  const bullets: string[] = [];
  let i = startIdx;
  while (i < lines.length) {
    const match = lines[i].match(/^[-*]\s+(.+)$/);
    if (match) {
      bullets.push(match[1].trim());
      i++;
    } else {
      break;
    }
  }
  return { bullets, endIdx: i };
}

/**
 * Collect consecutive numbered list lines.
 */
function collectNumberedList(lines: string[], startIdx: number): { items: string[]; endIdx: number } {
  const items: string[] = [];
  let i = startIdx;
  while (i < lines.length) {
    const match = lines[i].match(/^\d+\.\s+(.+)$/);
    if (match) {
      items.push(match[1].trim());
      i++;
    } else {
      break;
    }
  }
  return { items, endIdx: i };
}

/**
 * Collect a fenced code block.
 */
function collectCodeBlock(lines: string[], startIdx: number): { code: string; endIdx: number } {
  let code = '';
  let i = startIdx + 1; // skip opening ```
  while (i < lines.length && !lines[i].startsWith('```')) {
    if (code) code += '\n';
    code += lines[i];
    i++;
  }
  if (i < lines.length) i++; // skip closing ```
  return { code, endIdx: i };
}

/**
 * Collect a markdown table.
 */
function collectTable(lines: string[], startIdx: number): { tableLines: string[]; endIdx: number } {
  const tableLines: string[] = [];
  let i = startIdx;
  while (i < lines.length && lines[i].startsWith('|')) {
    tableLines.push(lines[i]);
    i++;
  }
  return { tableLines, endIdx: i };
}

/**
 * Detect Before/After pattern: Look for Before and After headings with code blocks.
 */
function detectBeforeAfter(
  lines: string[],
  startIdx: number
): { before: { title: string; content: string }; after: { title: string; content: string }; endIdx: number } | null {
  // Check if line matches a Before pattern
  const line = lines[startIdx];
  const beforeMatch = line.match(/^\*\*Before\s*[—\-]\s*(.+)\*\*$/i) ||
                      line.match(/^###?\s+\d+\.\s+Before/i) ||
                      line.match(/^###?\s+Before/i);
  if (!beforeMatch) return null;

  // Scan forward for the code block or content under Before
  let i = startIdx + 1;
  let beforeContent = '';

  // Skip empty lines
  while (i < lines.length && lines[i].trim() === '') i++;

  // Collect Before content (until we hit After or another heading)
  while (i < lines.length) {
    if (lines[i].startsWith('```')) {
      const cb = collectCodeBlock(lines, i);
      beforeContent = cb.code;
      i = cb.endIdx;
      break;
    }
    if (lines[i].match(/^\*\*After/i) || lines[i].match(/^###?\s+\d*\.?\s*After/i)) break;
    if (lines[i].startsWith('## ') || lines[i].startsWith('### ')) break;
    beforeContent += (beforeContent ? '\n' : '') + lines[i];
    i++;
  }

  // Skip to After
  while (i < lines.length && !lines[i].match(/^\*\*After/i) && !lines[i].match(/^###?\s+\d*\.?\s*After/i)) {
    i++;
    if (i >= lines.length) return null;
  }
  if (i >= lines.length) return null;

  const afterLine = lines[i];
  i++;

  // Skip empty lines
  while (i < lines.length && lines[i].trim() === '') i++;

  let afterContent = '';
  while (i < lines.length) {
    if (lines[i].startsWith('```')) {
      const cb = collectCodeBlock(lines, i);
      afterContent = cb.code;
      i = cb.endIdx;
      break;
    }
    if (lines[i].startsWith('## ') || lines[i].match(/^###\s/) || lines[i].startsWith('---')) break;
    if (lines[i].match(/^\*\*(AI 결과|결과|문제점|→)/)) break;
    afterContent += (afterContent ? '\n' : '') + lines[i];
    i++;
  }

  if (!beforeContent && !afterContent) return null;

  return {
    before: { title: 'Before', content: beforeContent.trim().substring(0, 300) },
    after: { title: 'After', content: afterContent.trim().substring(0, 300) },
    endIdx: i,
  };
}

interface Section {
  heading: string;
  level: number;
  lines: string[];
}

/**
 * Split markdown into sections by ## and ### headings.
 */
function splitIntoSections(markdown: string): Section[] {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h2Match) {
      if (current) sections.push(current);
      current = { heading: h2Match[1].trim(), level: 2, lines: [] };
    } else if (h3Match) {
      if (current) sections.push(current);
      current = { heading: h3Match[1].trim(), level: 3, lines: [] };
    } else {
      if (current) {
        current.lines.push(line);
      }
    }
  }
  if (current) sections.push(current);
  return sections;
}

/**
 * Process a section's content lines into slides.
 */
function processSectionContent(
  lines: string[],
  sectionTitle: string,
  moduleIndex: number,
  isSubSection: boolean
): PresentationSlide[] {
  const slides: PresentationSlide[] = [];
  let i = 0;
  let pendingBullets: string[] = [];
  let pendingText: string[] = [];

  const flushPending = () => {
    if (pendingBullets.length > 0) {
      const chunks = splitBullets(pendingBullets);
      chunks.forEach((chunk, idx) => {
        slides.push({
          id: makeId(moduleIndex, 'content'),
          type: 'content',
          moduleIndex,
          title: sectionTitle + (chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : ''),
          bullets: chunk,
        });
      });
      pendingBullets = [];
    }
    if (pendingText.length > 0) {
      const text = pendingText.join('\n').trim();
      if (text.length > 0) {
        // Split long text into bullet-like items
        const sentences = text.split(/(?<=[.다])\s+/).filter(s => s.trim().length > 0);
        if (sentences.length > 1 && sentences.every(s => s.length < 200)) {
          const chunks = splitBullets(sentences);
          chunks.forEach((chunk, idx) => {
            slides.push({
              id: makeId(moduleIndex, 'content'),
              type: 'content',
              moduleIndex,
              title: sectionTitle + (chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : ''),
              bullets: chunk,
            });
          });
        } else if (text.length > 20) {
          slides.push({
            id: makeId(moduleIndex, 'content'),
            type: 'content',
            moduleIndex,
            title: sectionTitle,
            content: text.substring(0, 400),
          });
        }
      }
      pendingText = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines and horizontal rules
    if (line.trim() === '' || line.trim() === '---') {
      i++;
      continue;
    }

    // Bold heading line like **강점:** or **상황:**
    const boldHeading = line.match(/^\*\*(.+?)[:：]\*\*\s*$/);
    if (boldHeading) {
      flushPending();
      // This is a sub-heading; collect bullets after it
      const subTitle = boldHeading[1];
      i++;
      // Collect following bullets
      if (i < lines.length && lines[i].match(/^[-*]\s/)) {
        const { bullets, endIdx } = collectBullets(lines, i);
        const chunks = splitBullets(bullets);
        chunks.forEach((chunk, idx) => {
          slides.push({
            id: makeId(moduleIndex, 'content'),
            type: 'content',
            moduleIndex,
            title: `${sectionTitle} — ${subTitle}`,
            bullets: chunk,
          });
        });
        i = endIdx;
        continue;
      }
      continue;
    }

    // Before/After pattern detection
    if (line.match(/^\*\*Before\s*[—\-]/i)) {
      flushPending();
      const result = detectBeforeAfter(lines, i);
      if (result) {
        slides.push({
          id: makeId(moduleIndex, 'comparison'),
          type: 'comparison',
          moduleIndex,
          title: sectionTitle,
          beforeAfter: result.before && result.after ? {
            before: result.before,
            after: result.after,
          } : undefined,
        });
        i = result.endIdx;
        continue;
      }
    }

    // Code block
    if (line.startsWith('```')) {
      flushPending();
      const { code, endIdx } = collectCodeBlock(lines, i);
      if (code.trim().length > 0) {
        slides.push({
          id: makeId(moduleIndex, 'code'),
          type: 'code',
          moduleIndex,
          title: sectionTitle,
          code: code.trim(),
        });
      }
      i = endIdx;
      continue;
    }

    // Table
    if (line.startsWith('|')) {
      flushPending();
      const { tableLines, endIdx } = collectTable(lines, i);
      const table = parseMarkdownTable(tableLines);
      if (table && table.rows.length > 0) {
        const chunks = splitTableRows(table);
        chunks.forEach((chunk, idx) => {
          slides.push({
            id: makeId(moduleIndex, 'table'),
            type: 'table',
            moduleIndex,
            title: sectionTitle + (chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : ''),
            table: chunk,
          });
        });
      }
      i = endIdx;
      continue;
    }

    // Blockquote (tip/key/warning)
    if (line.startsWith('> ')) {
      flushPending();
      const { text, endIdx } = collectBlockquote(lines, i);
      const tipType = detectTipType(text);
      if (tipType) {
        slides.push({
          id: makeId(moduleIndex, 'tip'),
          type: 'tip',
          moduleIndex,
          title: sectionTitle,
          content: text.replace(/^[>]\s*/gm, '').trim(),
        });
      }
      // Non-tip blockquotes: skip (usually AI result examples, context text)
      i = endIdx;
      continue;
    }

    // Bullet list
    if (line.match(/^[-*]\s+/)) {
      const { bullets, endIdx } = collectBullets(lines, i);
      pendingBullets.push(...bullets);
      i = endIdx;
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s+/)) {
      const { items, endIdx } = collectNumberedList(lines, i);
      pendingBullets.push(...items);
      i = endIdx;
      continue;
    }

    // Regular text (not bold-only lines, not marker lines)
    if (!line.startsWith('#') && !line.startsWith('```') && !line.startsWith('|') && !line.startsWith('>')) {
      // Skip lines that are just bold markers or "AI 결과:" etc.
      const isMetaLine = line.match(/^→\s/) || line.match(/^\*\*AI 결과/);
      if (!isMetaLine && line.trim().length > 10) {
        pendingText.push(line.trim());
      }
    }

    i++;
  }

  flushPending();
  return slides;
}

/**
 * Determine if a section is the summary section.
 */
function isSummarySection(heading: string): boolean {
  return heading.includes('핵심 요약') || heading.includes('핵심요약');
}

/**
 * Determine if a section should be skipped.
 */
function isSkippableSection(heading: string): boolean {
  return heading.includes('다음 모듈 예고') ||
    heading.includes('다음 단계 안내') ||
    heading.includes('시나리오 구성 안내');
}

/**
 * Count learning objectives from markdown content.
 */
function countObjectives(markdown: string): number {
  const match = markdown.match(/## 학습 목표[\s\S]*?(?=\n---|\n##)/);
  if (!match) return 0;
  const lines = match[0].split('\n');
  return lines.filter(l => l.match(/^\d+\.\s/)).length;
}

/**
 * Build all slides from all module markdown files.
 */
export function buildAllSlides(): PresentationSlide[] {
  slideCounter = 0;
  const slides: PresentationSlide[] = [];

  // Cover slide
  slides.push({
    id: 'cover',
    type: 'cover',
    moduleIndex: 0,
    title: '생성형 AI 활용 교육',
    subtitle: '제조업 \u00B7 금융권 직장인을 위한 실전 가이드',
  });

  // Process each module
  MODULE_CONFIG.forEach((mod, modIdx) => {
    const markdown = readModuleMarkdown(mod.id);
    const objectiveCount = countObjectives(markdown);

    // Module title slide
    slides.push({
      id: makeId(modIdx, 'module-title'),
      type: 'module-title',
      moduleIndex: modIdx,
      title: mod.title,
      subtitle: `${mod.subtitle} \u00B7 ${mod.duration}`,
      notes: `학습 목표 ${objectiveCount}개`,
    });

    const sections = splitIntoSections(markdown);

    for (const section of sections) {
      if (isSkippableSection(section.heading)) continue;

      // Learning objectives → content slide with numbered bullets
      if (section.heading === '학습 목표') {
        const items = section.lines
          .filter(l => l.match(/^\d+\.\s/))
          .map(l => l.replace(/^\d+\.\s+/, '').trim());
        if (items.length > 0) {
          const chunks = splitBullets(items);
          chunks.forEach((chunk) => {
            slides.push({
              id: makeId(modIdx, 'objectives'),
              type: 'content',
              moduleIndex: modIdx,
              title: '학습 목표',
              bullets: chunk,
            });
          });
        }
        continue;
      }

      // Summary section
      if (isSummarySection(section.heading)) {
        // First try bullet/numbered list items
        let items = section.lines
          .filter(l => l.match(/^[-*]\s+/) || l.match(/^\d+\.\s/))
          .map(l => l.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim());

        // If no bullets, try extracting from table (common pattern: |번호|핵심 포인트|실전 적용|)
        if (items.length === 0) {
          const tableLines = section.lines.filter(l => l.startsWith('|'));
          const table = tableLines.length >= 2 ? parseMarkdownTable(tableLines) : null;
          if (table && table.rows.length > 0) {
            // Use 2nd column (핵심 포인트) as bullet, append 3rd column if it exists
            items = table.rows.map(row => {
              const main = row[1] || row[0] || '';
              const detail = row.length > 2 ? row[2] : '';
              return detail ? `${main} — ${detail}` : main;
            }).filter(s => s.trim().length > 0);
          }
        }

        if (items.length > 0) {
          const chunks = splitBullets(items);
          chunks.forEach((chunk) => {
            slides.push({
              id: makeId(modIdx, 'summary'),
              type: 'summary',
              moduleIndex: modIdx,
              title: '핵심 요약',
              bullets: chunk,
            });
          });
        }
        continue;
      }

      // Quiz/Practice section — extract key exercise items
      if (section.heading.includes('실습') || section.heading.includes('퀴즈')) {
        const items = section.lines
          .filter(l => l.match(/^[-*]\s+/) || l.match(/^\d+\.\s/))
          .map(l => l.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
          .filter(l => l.length > 5)
          .slice(0, 5);
        if (items.length > 0) {
          slides.push({
            id: makeId(modIdx, 'practice'),
            type: 'content',
            moduleIndex: modIdx,
            title: '실습 과제',
            bullets: items,
          });
        }
        continue;
      }

      // H2 section = section-title slide + content slides
      if (section.level === 2) {
        // Skip adding section-title for very short headings or specific ones
        const isNumbered = section.heading.match(/^\d+\.\s/);
        const displayTitle = section.heading;

        slides.push({
          id: makeId(modIdx, 'section-title'),
          type: 'section-title',
          moduleIndex: modIdx,
          title: displayTitle,
          subtitle: mod.title,
        });

        // Process content within this section
        const contentSlides = processSectionContent(section.lines, displayTitle, modIdx, false);
        slides.push(...contentSlides);
      }

      // H3 sub-section = content slides (no section-title)
      if (section.level === 3) {
        const displayTitle = section.heading;
        const contentSlides = processSectionContent(section.lines, displayTitle, modIdx, true);
        slides.push(...contentSlides);
      }
    }
  });

  return slides;
}
