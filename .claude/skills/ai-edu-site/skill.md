---
name: ai-edu-site
description: "금융/디스플레이 제조업 직장인 대상 생성형 AI 인터랙티브 교육 사이트. 마크다운 교육자료를 풍부한 학습 경험으로 변환. AI 교육, 교육 웹앱, 다크모드, Mermaid."
---

# AI Education Site

금융/디스플레이 제조업 직장인을 위한 생성형 AI 인터랙티브 교육 사이트.
6개 마크다운 교육 모듈을 Next.js 기반의 풍부한 학습 경험으로 변환한다.

## 사이트 구조

```
/                      — 홈: 6개 모듈 카드 그리드
/learn/[moduleId]      — 모듈별 인터랙티브 학습 페이지
```

### 학습 페이지 (`/learn/[moduleId]`)
- 마크다운 교육자료를 react-markdown으로 풀 렌더링
- 좌측 사이드바 목차 (IntersectionObserver 스크롤 스파이)
- 코드 블록 복사 버튼
- 콜아웃 박스 (💡 팁, 🔑 핵심, ⚠ 주의 — 이모지 자동 감지)
- 구조 다이어그램: Mermaid.js 렌더링
- 반응형 테이블, Before/After 비교 구조
- 다크 모드 지원 (시스템 설정 연동 + 수동 토글)

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router, 정적 export) |
| 스타일링 | Tailwind CSS 4 + CSS 커스텀 속성 |
| 폰트 | Pretendard (CDN) |
| 마크다운 | react-markdown + remark-gfm + rehype-highlight |
| 다이어그램 | Mermaid.js |
| 아이콘 | Lucide React |
| 배포 | GitHub Pages (basePath: '/ai-edu') |

## 프로젝트 구조

```
site/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃 (Pretendard, FOUC 방지 스크립트)
│   ├── page.tsx                   # 홈 (모듈 카드 그리드)
│   ├── globals.css                # 라이트/다크 테마 + 프로즈 타이포그래피
│   ├── types.ts                   # TOCItem 타입
│   ├── lib/
│   │   ├── modules.ts             # 모듈 설정 (id, title, description, duration, keywords)
│   │   └── markdown.ts            # readModuleMarkdown(), extractTOC(), slugify()
│   ├── components/
│   │   ├── Header.tsx             # 사이트 헤더 + ThemeToggle
│   │   ├── ThemeToggle.tsx        # 다크모드 토글 (light/dark/system)
│   │   ├── MarkdownRenderer.tsx   # react-markdown + 커스텀 컴포넌트
│   │   ├── MermaidDiagram.tsx     # Mermaid 다이어그램 렌더러
│   │   ├── TableOfContents.tsx    # 사이드바 목차 + 스크롤 스파이
│   │   ├── CopyButton.tsx         # 코드 복사 버튼
│   │   └── CalloutBox.tsx         # 팁/경고 콜아웃 (MarkdownRenderer 내장)
│   └── learn/
│       └── [moduleId]/page.tsx    # 모듈별 학습 페이지
├── content/
│   └── module-1~6.md              # 마크다운 교육자료
└── public/                        # 정적 파일
```

## 핵심 설계 결정

### ID 동기화 (TOC ↔ DOM)
- `slugify()` 함수를 `lib/markdown.ts`에서 공유
- `extractTOC()`와 `MarkdownRenderer`의 h2/h3가 동일한 slugify로 ID 생성
- rehype-slug 미사용 — 커스텀 heading 컴포넌트로 직접 ID 부여

### 다크 모드
- CSS 커스텀 속성 기반 (`--site-bg`, `--site-text` 등)
- `@media (prefers-color-scheme: dark)` 시스템 자동 감지
- `[data-theme="dark"]` / `[data-theme="light"]` 수동 오버라이드
- localStorage 저장 + FOUC 방지 인라인 스크립트
- Mermaid 다이어그램도 다크모드 자동 대응

### Mermaid 다이어그램
- 교육자료의 구조 설명 ASCII 다이어그램을 Mermaid 코드 블록으로 변환
- 프롬프트 입력 예시 / 실습 복사용 코드는 변환하지 않음
- `MermaidDiagram.tsx`: 클라이언트 렌더링, data-theme 변화 감지

### 정적 export
- `output: 'export'`, `basePath: '/ai-edu'`
- 서버 컴포넌트에서 빌드 타임에 마크다운 파일 읽기
- `generateStaticParams()`로 6개 모듈 경로 사전 생성

## 디자인 시스템

### 라이트 테마
```css
--site-bg: #FFFFFF
--site-bg-secondary: #F8FAFC
--site-text: #1A1A2E
--site-text-secondary: #64748B
--site-accent: #2563EB
--site-accent-light: #EFF6FF
--site-border: #E2E8F0
--site-code-bg: #F1F5F9
```

### 다크 테마
```css
--site-bg: #0F172A
--site-bg-secondary: #1E293B
--site-text: #E2E8F0
--site-text-secondary: #94A3B8
--site-accent: #60A5FA
--site-accent-light: #1E3A5F
--site-border: #334155
--site-code-bg: #1E293B
```

### 타이포그래피
- 폰트: Pretendard (CDN)
- 행간: 1.8 (한글 가독성)
- 코드: Pretendard + ui-monospace 폴백

## 워크플로우

### 신규 구축 시
1. Next.js 프로젝트 초기화 + 패키지 설치
2. 마크다운 교육자료를 `content/`에 복사
3. 구조 다이어그램을 Mermaid 코드 블록으로 변환
4. 컴포넌트 개발 (MarkdownRenderer, TOC, CopyButton, MermaidDiagram, ThemeToggle)
5. 학습 페이지 라우트 생성
6. 다크 모드 CSS 적용
7. 빌드 & GitHub Pages 배포

### 콘텐츠 추가/수정 시
1. `content/module-N.md` 수정
2. `lib/modules.ts`에 모듈 설정 추가/수정
3. `npm run build` → 배포

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 마크다운 파싱 실패 | 해당 모듈 notFound() 반환 |
| Mermaid 렌더링 실패 | 원본 코드 텍스트 폴백 표시 |
| TOC ID 불일치 | slugify() 공유 함수로 방지 |
| 다크모드 FOUC | 인라인 스크립트로 paint 전 테마 적용 |
| 빌드 에러 | TypeScript 에러 우선 해결 |
