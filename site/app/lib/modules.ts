export interface ModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  keywords: string[];
}

export const MODULE_CONFIG: ModuleConfig[] = [
  {
    id: 'module-1',
    title: '프롬프트 엔지니어링 기초와 실전',
    subtitle: 'Module 1',
    description: '프롬프트 실패 진단, 5대 기법, Before/After 비교, 체크리스트',
    duration: '40분',
    keywords: ['프롬프트 설계', 'Zero-shot', 'Few-shot', 'CoT', '구조화 출력'],
  },
  {
    id: 'module-2',
    title: 'AI/LLM 종류별 특성과 활용법',
    subtitle: 'Module 2',
    description: 'ChatGPT/Claude/Gemini/Perplexity/사내LLM 비교, 모델별 전략',
    duration: '40분',
    keywords: ['LLM 비교', '모델 선택', 'AI 에이전트', 'MCP', '보안'],
  },
  {
    id: 'module-3',
    title: '보고서 작성 실전 가이드',
    subtitle: 'Module 3',
    description: 'AI 보고서 5단계 워크플로, 유형별 템플릿, 반복 보고서 자동화',
    duration: '45분',
    keywords: ['보고서', '템플릿', 'Few-shot', '워크플로', '자동화'],
  },
  {
    id: 'module-4',
    title: '리서치와 자료 검색',
    subtitle: 'Module 4',
    description: 'AI 검색 전략, 금융/제조 전문자료 검색, 법률/규제 검색법',
    duration: '40분',
    keywords: ['리서치', '검색 전략', 'Perplexity', '전문자료', '규제'],
  },
  {
    id: 'module-5',
    title: '할루시네이션 방지와 팩트체크',
    subtitle: 'Module 5',
    description: '사고 사례, 팩트체크 3단계, 제거 체크리스트, 기술적 대응',
    duration: '35분',
    keywords: ['할루시네이션', '팩트체크', '검증', 'RAG', '보안'],
  },
  {
    id: 'module-6',
    title: '산업별 실전 시나리오',
    subtitle: 'Module 6',
    description: '제조 3개 + 금융 3개 시나리오, Before/After, 보안 판단',
    duration: '50분',
    keywords: ['제조', '금융', '실전', 'Before/After', '종합 적용'],
  },
];

export function getModuleConfig(id: string): ModuleConfig | undefined {
  return MODULE_CONFIG.find((m) => m.id === id);
}

export function getAllModuleIds(): string[] {
  return MODULE_CONFIG.map((m) => m.id);
}
