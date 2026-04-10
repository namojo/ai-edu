# Design System — AI 교육 사이트

## 디자인 철학: 따뜻한 미니멀리즘

종이 위에 잉크 펜으로 정성스럽게 기록한 다이어리나 일러스트레이션 책의 느낌.
디지털이지만 인간적인 따뜻함이 느껴지는 디자인.

## 색상 팔레트

### 기본 색상
| 토큰 | 색상값 | 용도 |
|------|--------|------|
| `--bg-primary` | `#FFFDF7` | 메인 배경 (따뜻한 오프화이트) |
| `--bg-secondary` | `#FFF8EE` | 카드/섹션 배경 |
| `--bg-code` | `#F5F0EA` | 코드 블록 배경 |
| `--text-primary` | `#2D2A26` | 본문 텍스트 (따뜻한 거의-검정) |
| `--text-secondary` | `#6B6560` | 보조 텍스트 |
| `--text-muted` | `#9E9790` | 비활성/플레이스홀더 |
| `--accent` | `#E8863A` | 웜 오렌지 (CTA, 하이라이트) |
| `--accent-light` | `#FFF0E0` | 연한 오렌지 (배경 하이라이트) |
| `--accent-dark` | `#C46A25` | 어두운 오렌지 (호버) |
| `--border` | `#E8E2DA` | 보더/구분선 |
| `--border-light` | `#F0EBE3` | 연한 보더 |

### 사용 규칙
- 배경은 항상 따뜻한 톤 (순수한 #FFFFFF 사용 금지)
- 텍스트는 순수한 #000000 사용 금지 (항상 따뜻한 톤)
- 액센트 색상은 절제하여 사용 (페이지당 2~3곳 이내)
- 그라데이션 사용 금지

## 타이포그래피

### 폰트
- **주 폰트**: Pretendard (CDN)
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
  ```
- **코드 폰트**: JetBrains Mono 또는 시스템 monospace
- **폴백**: -apple-system, BlinkMacSystemFont, system-ui, sans-serif

### 크기 체계
| 용도 | 크기 | 굵기 | 행간 |
|------|------|------|------|
| 히어로 제목 | 2.5rem (40px) | Bold (700) | 1.3 |
| 모듈 제목 | 2rem (32px) | Bold (700) | 1.4 |
| 슬라이드 제목 | 1.5rem (24px) | SemiBold (600) | 1.4 |
| 소제목 | 1.25rem (20px) | SemiBold (600) | 1.5 |
| 본문 | 1.125rem (18px) | Regular (400) | 1.7 |
| 보조 텍스트 | 0.875rem (14px) | Regular (400) | 1.6 |
| 코드 | 0.9375rem (15px) | Regular (400) | 1.6 |

### 한글 가독성
- 행간(line-height) 최소 1.7 (한글은 영문보다 넓은 행간 필요)
- 문단 간격: 1.5em
- 최대 줄 길이: 40em (한글 기준 약 40자)

## 레이아웃

### 슬라이드 뷰어
```
┌──────────────────────────────────────────────────┐
│  ← 모듈명                              1/12  →  │  ← 상단 바
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────┐  ┌──────────────────────┐     │
│   │              │  │ 슬라이드 제목         │     │
│   │  일러스트    │  │                      │     │
│   │  이미지      │  │ • 핵심 포인트 1       │     │
│   │              │  │ • 핵심 포인트 2       │     │
│   │              │  │ • 핵심 포인트 3       │     │
│   └──────────────┘  └──────────────────────┘     │
│                                                  │
├──────────────────────────────────────────────────┤
│  ○ ○ ● ○ ○ ○ ○ ○ ○ ○ ○ ○                       │  ← 하단 네비게이션
└──────────────────────────────────────────────────┘
```

### 모바일 (< 768px)
```
┌────────────────────┐
│ ← 모듈명     1/12 →│
├────────────────────┤
│                    │
│  ┌──────────────┐  │
│  │ 일러스트     │  │
│  │ 이미지       │  │
│  └──────────────┘  │
│                    │
│  슬라이드 제목     │
│                    │
│  • 핵심 포인트 1   │
│  • 핵심 포인트 2   │
│  • 핵심 포인트 3   │
│                    │
├────────────────────┤
│ ○ ○ ● ○ ○ ○ ○ ○   │
└────────────────────┘
```

### 그리드 시스템
- 최대 너비: 1200px
- 패딩: 24px (모바일 16px)
- 슬라이드 뷰어: 이미지 40% / 텍스트 60% (데스크톱)
- 홈 카드 그리드: 3열 (데스크톱), 2열 (태블릿), 1열 (모바일)

## 컴포넌트 스타일

### 카드
```css
border-radius: 12px;
border: 1px solid var(--border);
background: var(--bg-secondary);
padding: 24px;
box-shadow: 0 1px 3px rgba(45, 42, 38, 0.06);
transition: transform 0.2s, box-shadow 0.2s;
/* hover */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(45, 42, 38, 0.1);
```

### 버튼 (네비게이션)
```css
border-radius: 8px;
padding: 8px 16px;
background: transparent;
border: 1px solid var(--border);
color: var(--text-secondary);
transition: all 0.2s;
/* hover */
background: var(--accent-light);
border-color: var(--accent);
color: var(--accent-dark);
```

### 코드 블록
```css
border-radius: 8px;
background: var(--bg-code);
padding: 16px 20px;
font-family: 'JetBrains Mono', monospace;
font-size: 0.9375rem;
line-height: 1.6;
border: 1px solid var(--border-light);
overflow-x: auto;
```

### 도트 네비게이션
```css
/* 기본 도트 */
width: 8px; height: 8px;
border-radius: 50%;
background: var(--border);
transition: all 0.2s;
/* 활성 도트 */
width: 24px;
border-radius: 4px;
background: var(--accent);
```

## 애니메이션

### 슬라이드 전환
```css
/* 다음 슬라이드 */
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
/* 이전 슬라이드 */
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
animation-duration: 200ms;
animation-timing-function: ease-out;
```

### 스켈레톤 로딩
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
background: linear-gradient(90deg, var(--border-light) 25%, var(--border) 50%, var(--border-light) 75%);
```

## 접근성
- 최소 색상 대비: 4.5:1 (WCAG AA)
- 키보드 포커스 표시: 2px solid var(--accent), offset 2px
- 슬라이드 전환 시 aria-live 알림
- 이미지에 alt 텍스트 (슬라이드 제목 기반)
