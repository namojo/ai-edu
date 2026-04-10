export interface PresentationSlide {
  id: string;
  type: 'cover' | 'module-title' | 'section-title' | 'content' | 'table' | 'code' | 'comparison' | 'tip' | 'summary';
  moduleIndex: number; // 0-5 (모듈 인덱스)
  title: string;
  subtitle?: string;
  bullets?: string[];
  content?: string;
  code?: string;
  table?: { headers: string[]; rows: string[][] };
  beforeAfter?: { before: { title: string; content: string }; after: { title: string; content: string } };
  notes?: string;
}
