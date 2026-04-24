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
    title: '전략적 AI 활용 개요',
    subtitle: 'Module 1',
    description: '보험업 AI 변곡점, KDB생명 5대 업무영역별 AI 적용, 정보 보호 원칙',
    duration: '40분',
    keywords: ['보험업 AI', '업무영역별 적용', '성공 사례', '정보 보호'],
  },
  {
    id: 'module-2',
    title: '프롬프트 설계 프레임워크',
    subtitle: 'Module 2',
    description: '5대 기법, Before/After 비교, RTCF 프레임워크, KDB생명 보험업 프롬프트 템플릿',
    duration: '50분',
    keywords: ['프롬프트 설계', 'RTCF', 'Before/After', 'CoT', '보험업 템플릿'],
  },
  {
    id: 'module-3',
    title: 'LLM 선택전략과 활용법',
    subtitle: 'Module 3',
    description: 'ChatGPT/Claude/Gemini/Perplexity/사내LLM 비교, 보험업 보안 판단, MCP',
    duration: '40분',
    keywords: ['LLM 비교', '모델 선택', 'MCP', '에이전트', '보험업 보안'],
  },
  {
    id: 'module-4',
    title: 'AI 기반 보고서 작성',
    subtitle: 'Module 4',
    description: '보험업 보고서 5단계 워크플로, 인수심사·포트폴리오·K-ICS 보고서 템플릿',
    duration: '45분',
    keywords: ['보고서', '인수심사', '포트폴리오', 'Few-shot', '자동화'],
  },
  {
    id: 'module-5',
    title: '리서치와 전문자료 탐색',
    subtitle: 'Module 5',
    description: '보험업 전문자료(보험개발원·생명보험협회·KIRI·DART), 법규 검색, 교차 검증',
    duration: '40분',
    keywords: ['리서치', '보험개발원', '생명보험협회', '법규 검색', '교차 검증'],
  },
  {
    id: 'module-6',
    title: '안전한 AI 활용',
    subtitle: 'Module 6',
    description: '보험업 할루시네이션 방지, 팩트체크 3단계, 10대 체크리스트, 보안 가이드',
    duration: '50분',
    keywords: ['할루시네이션', '팩트체크', 'K-ICS', '의료정보 보호', '보험업 보안'],
  },
];

export function getModuleConfig(id: string): ModuleConfig | undefined {
  return MODULE_CONFIG.find((m) => m.id === id);
}

export function getAllModuleIds(): string[] {
  return MODULE_CONFIG.map((m) => m.id);
}
