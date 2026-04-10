# Design System — AI 교육 사이트

## 디자인 철학

깔끔하고 현대적인 교육 플랫폼. 콘텐츠 가독성과 학습 집중에 최적화.
라이트/다크 모드 모두에서 일관된 경험 제공.

## 색상 팔레트

### 라이트 테마 (기본)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--site-bg` | `#FFFFFF` | 메인 배경 |
| `--site-bg-secondary` | `#F8FAFC` | 카드/사이드바 배경 |
| `--site-code-bg` | `#F1F5F9` | 코드 블록 배경 |
| `--site-text` | `#1A1A2E` | 본문 텍스트 |
| `--site-text-secondary` | `#64748B` | 보조 텍스트 |
| `--site-accent` | `#2563EB` | 블루 액센트 (링크, CTA) |
| `--site-accent-light` | `#EFF6FF` | 연한 블루 배경 |
| `--site-border` | `#E2E8F0` | 보더/구분선 |

### 다크 테마
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--site-bg` | `#0F172A` | 메인 배경 (네이비) |
| `--site-bg-secondary` | `#1E293B` | 카드/사이드바 배경 |
| `--site-code-bg` | `#1E293B` | 코드 블록 배경 |
| `--site-text` | `#E2E8F0` | 본문 텍스트 |
| `--site-text-secondary` | `#94A3B8` | 보조 텍스트 |
| `--site-accent` | `#60A5FA` | 밝은 블루 액센트 |
| `--site-accent-light` | `#1E3A5F` | 어두운 블루 배경 |
| `--site-border` | `#334155` | 보더/구분선 |

### 테마 전환 메커니즘
```css
/* 시스템 자동 감지 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* 다크 변수 */ }
}

/* 수동 오버라이드 */
[data-theme="dark"] { /* 다크 변수 */ }
```

### 콜아웃 색상
| 타입 | 보더 | 배경 (라이트) | 배경 (다크) |
|------|------|-------------|------------|
| 팁 (💡) | `#2563EB` | `#EFF6FF` | `#1E3A5F` |
| 핵심 (🔑) | `#7C3AED` | `#F5F3FF` | `#2E1065` |
| 주의 (⚠) | `#D97706` | `#FFFBEB` | `#451A03` |

## 타이포그래피

### 폰트
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
```
- **주 폰트**: Pretendard
- **코드 폰트**: Pretendard + ui-monospace 폴백
- **폴백**: -apple-system, BlinkMacSystemFont, system-ui, sans-serif

### 프로즈 타이포그래피
| 용도 | 크기 | 굵기 | 행간 |
|------|------|------|------|
| h1 | 2rem | 800 | 1.3 |
| h2 | 1.5rem | 700 | 1.35 |
| h3 | 1.25rem | 600 | 1.4 |
| 본문 | 1rem | 400 | 1.8 |
| 코드 | 0.875rem | 400 | 1.7 |
| 보조 텍스트 | 0.875rem | 400 | 1.6 |

### 한글 가독성
- 행간: 1.8 (영문보다 넓게)
- h2/h3: `padding-top: 80px` (TOC 스크롤 오프셋)

## 레이아웃

### 학습 페이지
```
┌─────────────────────────────────────────────┐
│  [AI 교육]           [학습하기]  [🌙]       │ ← Header (sticky)
├──────────┬──────────────────────────────────┤
│ 목차     │                                  │
│ (240px)  │  마크다운 콘텐츠                 │
│ sticky   │                                  │
│          │  [테이블]  [코드블록]  [콜아웃]   │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### 모바일 (< 1024px)
```
┌────────────────────┐
│ [AI 교육]    [🌙]  │
├────────────────────┤
│ [▾ 목차 열기]      │
├────────────────────┤
│                    │
│ 마크다운 콘텐츠    │
│                    │
└────────────────────┘
```

### 그리드
- 최대 너비: 1152px (max-w-6xl)
- 사이드바: 240px (lg 이상)
- 홈 카드 그리드: 3열/2열/1열 (반응형)

## 컴포넌트 스타일

### 코드 블록
```css
background: var(--site-code-bg);
border: 1px solid var(--site-border);
border-radius: 8px;
padding: 1rem 1.25rem;
/* 호버 시 복사 버튼 노출 */
```

### 콜아웃 박스
```css
border-left: 4px solid {타입별 색상};
border-radius: 0 8px 8px 0;
padding: 1rem 1.25rem;
```

### Mermaid 다이어그램
```css
.mermaid-container {
  overflow-x: auto;
  padding: 1rem;
  /* 다크모드: mermaid.initialize({ theme: 'dark' }) */
}
```

### 테이블
```css
.prose table { width: 100%; border-collapse: collapse; }
.prose thead th { background: var(--site-bg-secondary); }
.prose tbody tr:hover { background: var(--site-bg-secondary); }
```

## 접근성
- 최소 색상 대비: 4.5:1 (WCAG AA)
- 다크 모드에서도 대비 유지
- 키보드 포커스: outline 스타일
- 코드 블록 스크린 리더 접근 가능
