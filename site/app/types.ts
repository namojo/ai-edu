export interface SlideTable {
  headers: string[];
  rows: string[][];
}

export interface BeforeAfter {
  before: { title: string; content: string };
  after: { title: string; content: string };
}

export interface Slide {
  id: string;
  type: 'title' | 'objectives' | 'concept' | 'comparison' | 'example' | 'diagram' | 'tip' | 'practice' | 'summary';
  title: string;
  subtitle?: string;
  bullets?: string[];
  content?: string;
  code?: string;
  notes?: string;
  table?: SlideTable;
  beforeAfter?: BeforeAfter;
  imagePrompt?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  slides: Slide[];
}

export interface SlidesData {
  modules: Module[];
}
