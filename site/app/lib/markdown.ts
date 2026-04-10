import fs from 'fs';
import path from 'path';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function readModuleMarkdown(moduleId: string): string {
  const filePath = path.join(process.cwd(), 'content', `${moduleId}.md`);
  return fs.readFileSync(filePath, 'utf-8');
}

export function extractTOC(markdown: string): TOCItem[] {
  const items: TOCItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s가-힣-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      items.push({ id, text, level });
    }
  }

  return items;
}
