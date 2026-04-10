---
name: ai-edu-site
description: "금융/디스플레이 제조업 직장인 대상 생성형 AI 교육 사이트를 구축하는 오케스트레이터. 마크다운 교육자료를 슬라이드 기반 웹사이트로 변환하고, Gemini API로 일러스트레이션을 생성한다. AI 교육 사이트, 슬라이드 생성, 교육 웹앱."
---

# AI Education Site Orchestrator

금융/디스플레이 제조업 직장인을 위한 생성형 AI 교육 사이트를 구축하는 에이전트 팀을 조율한다. 6개 마크다운 교육 모듈을 슬라이드 기반 Next.js 웹사이트로 변환하고, Gemini Image API로 따뜻한 미니멀리즘 스타일의 일러스트레이션을 생성한다.

## 실행 모드: 에이전트 팀

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 출력 |
|------|-------------|------|------|
| content-architect | content-architect (커스텀) | 마크다운 파싱 → 슬라이드 JSON | `_workspace/slides.json` |
| frontend-builder | frontend-builder (커스텀) | Next.js 앱 개발 | `app/`, `components/`, `lib/` |
| slide-illustrator | slide-illustrator (커스텀) | Gemini 이미지 생성 | `public/slides/*.png` |

## 워크플로우

### Phase 1: 준비

1. 프로젝트 루트에 교육자료 마크다운 파일 6개 존재 확인
2. `.env.local`에서 `GEMINI_API_KEY` 존재 확인
3. `_workspace/` 디렉토리 생성
4. 기존 Next.js 프로젝트가 있는지 확인 (있으면 기존 구조 활용)

### Phase 2: 팀 구성

1. 팀 생성:
```
TeamCreate(
  team_name: "ai-edu-team",
  description: "AI 교육 사이트 구축 팀"
)
```

2. 팀원 생성 (3명):

**content-architect** (먼저 실행):
```
Agent(
  name: "content-architect",
  subagent_type: "content-architect",
  team_name: "ai-edu-team",
  prompt: "당신은 content-architect입니다. 프로젝트 루트(/Users/andy/Work/ai-edu/)에 있는 6개 교육자료 마크다운 파일을 읽고, 각 모듈을 슬라이드 단위로 분할하여 _workspace/slides.json을 생성하세요.

작업 순서:
1. 교육자료_목차.md를 읽어 전체 구조 파악
2. 교육자료_모듈1~6.md를 순서대로 읽기
3. 각 모듈의 섹션을 슬라이드로 분할
4. 각 슬라이드에 Gemini 이미지 생성용 영어 프롬프트 작성
5. _workspace/slides.json에 결과 저장

에이전트 정의(.claude/agents/content-architect.md)의 슬라이드 분할 기준과 JSON 스키마를 정확히 따르세요.

완료 후 리더에게 알려주세요."
)
```

3. 작업 등록:
```
TaskCreate(tasks: [
  { title: "마크다운 파싱 및 슬라이드 JSON 생성", assignee: "content-architect" },
  { title: "Next.js 프로젝트 초기화 및 앱 개발", assignee: "frontend-builder", depends_on: ["마크다운 파싱 및 슬라이드 JSON 생성"] },
  { title: "슬라이드 이미지 생성", assignee: "slide-illustrator", depends_on: ["마크다운 파싱 및 슬라이드 JSON 생성"] }
])
```

### Phase 3: 콘텐츠 파싱 (content-architect 단독)

content-architect가 6개 마크다운 파일을 읽고 `_workspace/slides.json`을 생성한다.

**리더 모니터링:**
- content-architect 유휴 알림 수신 시 slides.json 생성 확인
- slides.json이 올바른 구조인지 검증 (modules 배열, 각 module에 slides 배열)
- 슬라이드 수 확인 (6개 모듈 × 약 8~15슬라이드 = 48~90개 예상)

**완료 조건:** `_workspace/slides.json`이 유효한 JSON으로 존재

### Phase 4: 프론트엔드 개발 + 이미지 생성 (병렬)

slides.json이 완성되면 두 팀원을 동시에 실행한다.

**frontend-builder 실행:**
```
Agent(
  name: "frontend-builder",
  subagent_type: "frontend-builder",
  team_name: "ai-edu-team",
  prompt: "당신은 frontend-builder입니다. /Users/andy/Work/ai-edu/ 에서 Next.js 교육 사이트를 구축하세요.

핵심 요구사항:
1. Next.js 14+ App Router + Tailwind CSS 4 프로젝트 초기화
2. _workspace/slides.json(data/slides.json으로 복사)을 데이터 소스로 활용
3. 홈 화면: 6개 모듈을 카드로 표시, 클릭 시 슬라이드 뷰어로 이동
4. 슬라이드 뷰어: 방향키(←→) 네비게이션, 하단 도트 네비게이션
5. 디자인: 따뜻한 미니멀리즘 (오프화이트 배경, 웜 오렌지 액센트)
6. Gemini API 서버 라우트: POST /api/generate-image
7. 이미지: public/slides/{slideId}.png에서 로드, 없으면 API 호출하여 생성

에이전트 정의(.claude/agents/frontend-builder.md)의 디자인 시스템과 구조를 따르세요.
Pretendard 폰트는 CDN(https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css)으로 로드하세요.

완료 후 npm run build가 성공하는지 확인하고, 리더에게 보고하세요."
)
```

**slide-illustrator 실행:**
```
Agent(
  name: "slide-illustrator",
  subagent_type: "slide-illustrator",
  team_name: "ai-edu-team",
  prompt: "당신은 slide-illustrator입니다. /Users/andy/Work/ai-edu/ 에서 슬라이드 이미지를 생성하세요.

작업:
1. _workspace/slides.json 읽기
2. 각 슬라이드의 imagePrompt를 사용하여 Gemini API로 이미지 생성
3. public/slides/{slideId}.png에 저장
4. 생성 로그를 _workspace/image-generation-log.json에 기록

Gemini API:
- API Key: .env.local의 GEMINI_API_KEY 사용
- 모델: gemini-2.0-flash-exp (이미지 생성 지원)
- 또는 gemini-3-pro-imagegen 스킬 활용

주의사항:
- API 호출 간 2초 대기 (rate limit)
- 실패 시 1회 재시도
- 모든 이미지는 1024x1024 이상

에이전트 정의(.claude/agents/slide-illustrator.md)의 스타일 가이드를 따르세요.
완료 후 리더에게 생성 결과를 보고하세요."
)
```

**팀원 간 통신:**
- frontend-builder → slide-illustrator: API 라우트 구현 방식 공유
- slide-illustrator → frontend-builder: 이미지 파일 경로 규칙 확인
- 두 팀원 모두 `public/slides/` 디렉토리에 접근하지만, slide-illustrator만 쓰기 담당

### Phase 5: 통합 및 검증

1. 모든 팀원의 작업 완료 대기
2. 검증 체크리스트:
   - [ ] `npm run build` 성공
   - [ ] 홈 화면에 6개 모듈 카드 표시
   - [ ] 각 모듈 클릭 시 슬라이드 뷰어 진입
   - [ ] ← → 방향키로 슬라이드 전환
   - [ ] 하단 네비게이션 동작
   - [ ] 슬라이드 이미지 표시 (최소 첫 번째 모듈)
   - [ ] Pretendard 폰트 적용
   - [ ] 모바일 반응형 레이아웃

3. 빌드 실패 시:
   - 에러 로그 분석
   - frontend-builder에게 수정 요청 (SendMessage)
   - 최대 2회 수정 시도

4. 이미지 누락 시:
   - 누락 슬라이드 ID 확인
   - slide-illustrator에게 재생성 요청
   - 또는 플레이스홀더 SVG로 대체

### Phase 6: 정리

1. 팀원들에게 종료 요청:
```
SendMessage(to: "content-architect", message: { type: "shutdown_request" })
SendMessage(to: "frontend-builder", message: { type: "shutdown_request" })
SendMessage(to: "slide-illustrator", message: { type: "shutdown_request" })
```

2. `_workspace/` 보존 (slides.json, image-generation-log.json)
3. 사용자에게 결과 보고:
   - 사이트 URL: `http://localhost:3000`
   - 총 슬라이드 수
   - 생성된 이미지 수
   - `npm run dev`로 실행 방법

## 데이터 흐름

```
[교육자료 마크다운 6개]
       ↓
[content-architect] → _workspace/slides.json
       ↓                    ↓
[frontend-builder]    [slide-illustrator]
  ↓ Next.js 앱          ↓ 이미지 파일
  ↓ app/, components/    ↓ public/slides/
       ↓                    ↓
       └────── 통합 ────────┘
              ↓
     [완성된 교육 사이트]
     http://localhost:3000
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| content-architect 실패 | 리더가 직접 slides.json 생성 (간소화 버전) |
| frontend-builder 빌드 실패 | 에러 로그 분석 → 수정 요청 (최대 2회) |
| slide-illustrator API 실패 | Gemini API 키 확인 → 모델 변경 시도 → 실패 시 플레이스홀더 |
| 이미지 과반 실패 | 사용자에게 알리고 텍스트 전용 모드로 전환 |
| slides.json 형식 오류 | content-architect에게 수정 요청 또는 리더가 직접 수정 |
| 팀원 타임아웃 | 현재까지 결과로 진행, 미완료 부분 보고 |

## 테스트 시나리오

### 정상 흐름
1. 리더가 교육자료 6개 + .env.local 확인
2. content-architect가 ~60개 슬라이드의 slides.json 생성 (약 5분)
3. frontend-builder가 Next.js 앱 빌드 성공 (약 10분)
4. slide-illustrator가 ~60개 이미지 생성 (약 15분)
5. 통합 검증 통과
6. `npm run dev`로 사이트 실행 가능

### 에러 흐름
1. slide-illustrator가 Gemini API rate limit에 걸림
2. exponential backoff으로 재시도
3. 40/60개 이미지만 성공
4. 리더가 남은 20개에 대해 재생성 요청
5. 최종 55/60개 성공, 5개는 플레이스홀더
6. 사용자에게 "5개 슬라이드 이미지 미생성" 보고
