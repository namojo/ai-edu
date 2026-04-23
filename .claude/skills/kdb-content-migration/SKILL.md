---
name: kdb-content-migration
description: "한국산업은행(KDB) 교육자료 사이트의 제조업 콘텐츠를 금융(KDB) 맥락으로 변환·검증·배포하는 오케스트레이터. 'KDB로 바꿔줘', '제조업 제거', '금융권 맞춤', '2025년도 2026년도 변경', 'github pages 배포', '다시 변환', '재실행', '부분 수정' 등 KDB 교육자료 변환 관련 모든 요청 시 반드시 사용."
---

# KDB 교육자료 변환 오케스트레이터

교육 사이트(`site/`)의 제조업·디스플레이 관련 예시·시나리오·프롬프트를 한국산업은행(KDB) 업무 맥락으로 변환하고, 빌드·GitHub Pages 배포까지 수행한다.

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/kdb-migration/` 존재 여부 확인
   - 미존재 → **초기 실행**: 새 디렉토리 생성, KDB 컨텍스트 문서 작성
   - 존재 + 부분 수정 요청 → **부분 재실행**: 해당 모듈 에이전트만 재호출
   - 존재 + 전체 재실행 요청 → **전체 재실행**: 기존 디렉토리를 `_workspace_prev/kdb-migration/`으로 이동 후 새로 실행
2. `git status` 로 기존 site/ 변경사항 확인
3. 사용자에게 모드 확인

### Phase 1: 도메인 컨텍스트 준비

**실행 모드:** 단일 에이전트 (메인)

1. `_workspace/kdb-migration/kdb-context.md` 작성 또는 확인
   - KDB 업무 영역, 직무, 시나리오, 용어, 규제 환경
   - 절대 피할 주제 (제조 공정, 보험 상품 등)
2. 루트 `/교육자료_*.md`는 **수정 금지** (원본 마스터)

### Phase 2: 병렬 변환 (서브 에이전트 패턴)

**실행 모드:** 서브 에이전트 (병렬 6개)

6개 모듈을 독립적으로 변환. 각 에이전트는 `content-transformer` 정의 참조.

```
메인 → Agent(content-transformer, module-1) [run_in_background]
     → Agent(content-transformer, module-2) [run_in_background]
     → ... (6개 병렬)
     → 결과 대기 및 수집
```

각 에이전트에 전달할 프롬프트:
- 담당 모듈 번호
- 원본 파일 경로: `site/content/module-N.md`
- 참조: `_workspace/kdb-migration/kdb-context.md`
- 변환 원칙:
  - 제조업 용어·예시 제거, KDB 맥락으로 치환
  - 2025 → 2026 전부 치환
  - Mermaid·Before/After·콜아웃 구조 보존
  - "제조 vs 금융" 비교표에서 제조 열/행 삭제
- 모듈 6: "Part A 제조업 시나리오" 전체 삭제, Part B 금융 시나리오만 남기되 KDB 맥락으로 재작성

### Phase 3: UI 파일 업데이트

**실행 모드:** 단일 에이전트 (메인)

`site/app/` 의 하드코딩 문구 업데이트:
- `page.tsx`: "제조업 · 금융권 직장인을 위한 실전 가이드" → KDB 맞춤 문구
- `layout.tsx`: metadata description 수정
- `lib/modules.ts`: 모듈 description·keywords에서 "제조" 언급 제거, KDB 맥락 반영
- Factory 아이콘 → 다른 적절한 아이콘(Landmark/Briefcase 등)으로 교체

### Phase 4: QA 검증

**실행 모드:** 단일 에이전트 (content-qa)

Grep 기반 잔재 검색:
- 제조업 용어 검색 (빈도 0이어야 함, 단 일반 명사 "제조업" 자체는 경고 수준)
- `2025` 검색 (빈도 0이어야 함)
- Mermaid 구문 오류 검색
- 테이블 열 수 불일치 검색

### Phase 5: 빌드 검증

**실행 모드:** 단일 에이전트 (메인)

```bash
cd site && npm run build
```

- 성공 → Phase 6 진행
- 실패 → 에러 메시지 분석 후 관련 content-transformer 재호출

### Phase 6: 통합 요약 마크다운 생성

**실행 모드:** 단일 에이전트 (메인)

루트에 `KDB_교육자료_통합정리.md` 생성:
- 변환된 site/content/ 기준 전체 6개 모듈 요약
- 각 모듈: 학습 목표, 핵심 개념, KDB 실무 적용 포인트, Before/After 요약
- 끝에 KDB 임직원 대상 학습 로드맵 포함

### Phase 7: 자동 배포

**실행 모드:** 단일 에이전트 (메인)

1. `git status` 로 변경 파일 확인
2. `git add` 로 변경사항 스테이징 (site/, KDB_*.md, _workspace/, .claude/)
3. `git commit` 로 커밋 (상세 메시지)
4. `git push origin main` 로 푸시
5. GitHub Actions가 자동으로 Pages 배포
6. 사용자에게 배포 URL 안내 (`https://namojo.github.io/ai-edu/`)

## 팀 구성

| 에이전트 | 역할 | 인스턴스 수 |
|---------|------|------------|
| (메인) | 오케스트레이션, UI 업데이트, 빌드, 배포 | 1 |
| content-transformer | 모듈별 콘텐츠 변환 | 6 (병렬) |
| content-qa | 잔재·구조 검증 | 1 |
| kdb-domain-expert | 도메인 적합성 감수 (선택) | 1 |

## 데이터 전달 프로토콜

- **파일 기반**: `site/content/*.md` 직접 수정, `_workspace/kdb-migration/`에 중간 로그
- **반환값 기반**: 서브 에이전트들의 완료 메시지를 메인이 수집

## 에러 핸들링

| 에러 유형 | 전략 |
|----------|------|
| 변환 에이전트 실패 | 1회 재시도, 재실패 시 해당 모듈 수동 개입 |
| QA 잔재 발견 | 해당 content-transformer 재호출하여 타겟 수정 |
| 빌드 실패 | 에러 스택 분석, 영향 모듈 식별 후 재변환 |
| git push 실패 | 사용자에게 원인 알림, 자동 force push 금지 |

## 테스트 시나리오

### 정상 흐름
1. 사용자: "제조업 내용을 KDB로 바꿔서 배포해줘"
2. Phase 0~7 순차 실행
3. 최종: GitHub Pages URL 회신 + 변경 이력 보고

### 에러 흐름
1. 사용자: "module-3만 다시 변환해줘"
2. Phase 0: `_workspace/` 존재 → 부분 재실행 모드
3. Phase 2: module-3만 재변환
4. Phase 4: QA 모듈 3만 재검증
5. Phase 5~7: 빌드·요약·배포
