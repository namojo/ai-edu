---
name: ai-edu-site
description: "금융/디스플레이 제조업 직장인 대상 생성형 AI 교육 사이트를 구축하는 오케스트레이터. 인터랙티브 학습 사이트 + 통합 프레젠테이션 발표자료. AI 교육 사이트, 교육 웹앱."
---

# AI Education Site Orchestrator

금융/디스플레이 제조업 직장인을 위한 생성형 AI 교육 사이트를 구축한다.

## 사이트 구조 (2개 섹션)

### 1. 인터랙티브 학습 사이트 (`/learn/[moduleId]`)
- 마크다운 교육자료를 풀 렌더링하는 학습 페이지
- 사이드바 목차, 코드 복사, 콜아웃 박스
- 깔끔한 현대적 디자인 (화이트/블루 기조)
- 모듈별 개별 페이지

### 2. 통합 프레젠테이션 (`/slides`)
- 6개 모듈 전체를 합친 1개 발표자료
- CSS 기반 프로페셔널 디자인 (Gemini 이미지 미사용)
- 모듈별 액센트 컬러로 구분
- 키보드/터치 네비게이션, 모듈 탭 + 도트 네비게이션

**중요:** 발표자료는 모듈별로 분리하지 않음. 전체 교육과정이 하나의 연속된 슬라이드 덱.

## 실행 모드: 서브 에이전트

이 프로젝트는 동일 코드베이스에 순차적으로 코드를 작성하므로 서브 에이전트 모드가 적합하다.

## 에이전트 구성

| 에이전트 | 타입 | 역할 | 출력 |
|---------|------|------|------|
| frontend-builder | general-purpose | Next.js 앱 전체 개발 | `site/` 프로젝트 |

> content-architect, slide-illustrator 에이전트는 더 이상 필요 없음.
> 마크다운 파싱은 `build-slides.ts`에서 빌드 타임에 수행.
> 이미지 생성 대신 CSS 기반 디자인 사용.

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router, 정적 export)
- **스타일링**: Tailwind CSS 4 + 커스텀 CSS
- **폰트**: Pretendard (CDN)
- **마크다운**: react-markdown + remark-gfm + rehype-slug + rehype-highlight
- **아이콘**: Lucide React
- **배포**: GitHub Pages (basePath: '/ai-edu')

## 프로젝트 구조

```
site/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈 (모듈 목록 + 발표자료 CTA)
│   ├── globals.css                # 사이트 테마 + 프레젠테이션 테마
│   ├── types.ts                   # PresentationSlide 타입
│   ├── lib/
│   │   ├── modules.ts             # 모듈 설정
│   │   ├── markdown.ts            # 마크다운 유틸리티
│   │   └── build-slides.ts        # 마크다운→슬라이드 변환
│   ├── components/
│   │   ├── Header.tsx             # 사이트 헤더
│   │   ├── PresentationViewer.tsx # 통합 슬라이드 뷰어
│   │   ├── MarkdownRenderer.tsx   # 학습 페이지 마크다운 렌더러
│   │   ├── TableOfContents.tsx    # 학습 사이드바 목차
│   │   ├── CopyButton.tsx         # 코드 복사 버튼
│   │   └── CalloutBox.tsx         # 팁/경고 콜아웃
│   ├── learn/
│   │   └── [moduleId]/page.tsx    # 모듈별 학습 페이지
│   └── slides/
│       └── page.tsx               # 통합 발표자료 페이지
├── content/
│   └── module-1~6.md              # 마크다운 교육자료
└── public/                        # 정적 파일
```

## 워크플로우

### Phase 1: 준비
1. 프로젝트 루트에 교육자료 마크다운 6개 존재 확인
2. `site/content/`에 마크다운 복사
3. Next.js 프로젝트 초기화 (없으면)

### Phase 2: 학습 사이트 구축
1. 마크다운 렌더링 패키지 설치
2. 학습 페이지 컴포넌트 개발 (MarkdownRenderer, TOC, CopyButton)
3. `/learn/[moduleId]` 라우트 생성
4. 사이트 디자인 (클린 모던 테마)

### Phase 3: 프레젠테이션 구축
1. `build-slides.ts`: 마크다운 → PresentationSlide[] 변환
2. `PresentationViewer.tsx`: CSS 기반 슬라이드 뷰어
3. `/slides` 라우트 생성
4. 프레젠테이션 디자인 (모듈별 컬러, 프로페셔널 레이아웃)

### Phase 4: 통합 및 배포
1. 홈 페이지 + Header에서 양쪽 섹션 링크
2. `npm run build` 검증
3. GitHub Pages 배포

## 프레젠테이션 디자인 시스템

**모듈별 액센트 컬러:**
| 모듈 | 주제 | 색상 |
|------|------|------|
| 1 | 프롬프트 엔지니어링 | #3B82F6 (Blue) |
| 2 | AI/LLM 비교 | #8B5CF6 (Violet) |
| 3 | 보고서 작성 | #10B981 (Emerald) |
| 4 | 리서치/검색 | #F59E0B (Amber) |
| 5 | 할루시네이션 방지 | #EF4444 (Red) |
| 6 | 산업별 시나리오 | #06B6D4 (Cyan) |

**슬라이드 타입:**
- `cover`: 네이비(#0F172A) 배경, 전체 교육 제목
- `module-title`: 모듈 액센트 배경, 모듈 번호 + 제목
- `section-title`: 연한 배경, 섹션 제목
- `content`: 흰색 배경, 불릿 포인트 (액센트 도트)
- `table`: 스타일링된 테이블 (액센트 헤더)
- `code`: 어두운 배경(#1E293B), 코드 폰트
- `comparison`: 좌우 분할 Before(빨강)/After(초록)
- `tip`: 액센트 좌측 보더 + 연한 배경
- `summary`: 체크마크 불릿

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 마크다운 파싱 실패 | 해당 섹션 스킵, 나머지 진행 |
| 빌드 에러 | TypeScript 에러 우선 수정 |
| 슬라이드 수 과다 (400+) | 불릿 병합, 사소한 섹션 생략 |
| 한글 렌더링 문제 | Pretendard 폰트 확인, CSS 폴백 |

## 테스트 시나리오

### 정상 흐름
1. 6개 마크다운 → ~300-400개 슬라이드 생성
2. `/slides`에서 전체 덱 네비게이션
3. 모듈 탭으로 모듈 간 이동
4. 모든 슬라이드 타입 정상 렌더링

### 검증 항목
- 한글 텍스트 100% 정상
- 테이블 데이터 정확
- 코드 블록 형식 유지
- Before/After 비교 올바른 매핑
- 모듈 전환 시 컬러 변경
