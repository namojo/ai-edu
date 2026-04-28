---
name: kdb-revision-deploy
description: "kdb_edu_final.md(개정판)의 신규 보강 콘텐츠를 사이트(site/content/module-*.md)에 병합하고 KDB 사내 데이터 식별자를 익명화한 뒤 빌드·배포까지 수행하는 오케스트레이터. '개정판 반영', '보강 콘텐츠 추가', 'kdb_edu_final 적용', '사이트 보강해줘', '교육자료 개정 반영', 'KDB 데이터 노출 방지' 요청 시 반드시 사용."
---

# KDB 개정판 보강 콘텐츠 사이트 반영 오케스트레이터

`kdb_edu_final.md`(KDB생명 임직원 대상 프롬프트 교육자료 개정판)의 신규 보강 사례를 공개 사이트(`namojo.github.io/ai-edu`)의 모듈에 추가하고, KDB 사내 데이터 식별자(컬럼·코드·시스템명)를 모두 익명화한 뒤 GitHub Pages 배포까지 수행한다.

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/kdb-revision/` 존재 여부 확인
   - 미존재 → **초기 실행**: 새 디렉토리 생성, 익명화 규칙·보강 매핑 문서 작성
   - 존재 + 부분 수정 요청 → **부분 재실행**: 해당 모듈 writer만 재호출
   - 존재 + 전체 재실행 요청 → **전체 재실행**: 기존 파일 보존 후 새로 실행
2. `git status` 로 사이트 현재 상태 확인
3. 사용자에게 모드 확인 (필요 시)

### Phase 1: 익명화 규칙·매핑 산출 (메인)

**실행 모드:** 단일 에이전트 (메인)

1. `_workspace/kdb-revision/anonymization-rules.md` 작성/확인
   - 사내 DB 컬럼·테이블·코드값·시스템명 → 사이트 게재용 더미 매핑
   - `kdb-anonymization-rules` 스킬 참조
2. `_workspace/kdb-revision/enrichment-mapping.md` 작성
   - 개정판 보강 사례 ↔ 사이트 모듈 매핑
   - 모듈별 추가 섹션 번호·작성 원칙

### Phase 2: 병렬 보강 작성 (서브 에이전트 패턴)

**실행 모드:** 서브 에이전트 (병렬 3개)

3개 사이트 모듈을 독립적으로 보강. 각 에이전트는 `revision-writer` 정의 참조.

```
메인 → Agent(revision-writer, module-4, model=opus) [run_in_background]
     → Agent(revision-writer, module-5, model=opus) [run_in_background]
     → Agent(revision-writer, module-6, model=opus) [run_in_background]
     → 결과 대기 및 수집
```

각 에이전트에 전달할 프롬프트:
- 담당 사이트 모듈 파일 (`site/content/module-N.md`)
- 추가할 신규 섹션 번호 (예: `섹션 6, 7`)
- 매핑된 개정판 사례 ID (예: `kdb_edu_final.md 모듈 3 보강 사례 3-A ~ 3-F`)
- 익명화 규칙: `_workspace/kdb-revision/anonymization-rules.md`
- 보강 매핑: `_workspace/kdb-revision/enrichment-mapping.md`
- 보안 원칙:
  - 사내 DB 컬럼명(SETL_, UTAMT_, ASSM_, RS_DIV_) → 한글 가상 명칭
  - 상품 코드값(110xxx) → 상품군 A/B/C/D
  - SmartON Tablet → 사내 영업 태블릿 단말
  - 새도약기금 → 정책금융 펀드

### Phase 3: QA 검증 (단일 에이전트)

**실행 모드:** 단일 에이전트 (content-qa)

`content-qa` 에이전트가 다음 검증 수행:

- **A. 사내 식별자 잔재 검색** (Grep 기반)
  - `SETL_|UTAMT_|ASSM_|RS_DIV_` 패턴 0건
  - `110103|110204|110301|110106` 0건
  - `SmartON` 0건
  - `새도약기금` 0건
- **B. 구조 검증**
  - Mermaid 구문 오류 0건
  - 테이블 열 수 일치
  - 코드 펜스(```) 짝수 개수
- **C. 보고서**
  - `_workspace/kdb-revision/qa-report.md` 작성
  - PASS/FAIL 판정

FAIL 시: 해당 `revision-writer`에 재작성 요청.

### Phase 4: 빌드 검증 (메인)

**실행 모드:** 단일 에이전트 (메인)

```bash
cd site && npm run build
```

- 성공 → Phase 5 진행
- 실패 → 에러 분석 후 관련 `revision-writer` 재호출

### Phase 5: 자동 배포 (메인)

**실행 모드:** 단일 에이전트 (메인)

1. `git status` 로 변경 파일 확인
2. `git add` 로 변경사항 스테이징 (site/content/, .claude/, _workspace/kdb-revision/)
3. `git commit` 로 커밋 (상세 메시지)
4. `git push origin main`
5. GitHub Actions가 자동으로 Pages 배포
6. 사용자에게 배포 URL 안내 (`https://namojo.github.io/ai-edu/`)

## 팀 구성

| 에이전트 | 역할 | 인스턴스 수 |
|---------|------|------------|
| (메인) | 오케스트레이션, 빌드, 배포 | 1 |
| revision-writer | 사이트 모듈별 보강 콘텐츠 작성 + 익명화 | 3 (병렬, 모듈 4·5·6 담당) |
| content-qa | 사내 식별자 잔재·구조·빌드 검증 | 1 |

## 참조 스킬

- `kdb-anonymization-rules` — 익명화 규칙 (writer·QA 모두 참조)

## 데이터 전달 프로토콜

- **파일 기반**: `site/content/*.md` 직접 수정, `_workspace/kdb-revision/`에 작업 로그·QA 보고서·중간 산출물
- **반환값 기반**: 서브 에이전트들의 완료 메시지를 메인이 수집

파일명 컨벤션:
- `_workspace/kdb-revision/anonymization-rules.md` — 익명화 규칙
- `_workspace/kdb-revision/enrichment-mapping.md` — 보강 매핑
- `_workspace/kdb-revision/writer-log-module-N.md` — writer 작업 로그
- `_workspace/kdb-revision/qa-report.md` — QA 종합 보고서

## 에러 핸들링

| 에러 유형 | 전략 |
|----------|------|
| revision-writer 실패 | 1회 재시도, 재실패 시 해당 모듈 수동 개입 |
| QA 사내 식별자 잔재 | 해당 revision-writer 재호출하여 타겟 수정 |
| 빌드 실패 | 에러 스택 분석, 영향 모듈 식별 후 재작성 |
| git push 실패 | 사용자에게 원인 알림, 자동 force push 금지 |

## 산출물 체크리스트

작업 완료 시 확인:

- [ ] `site/content/module-4.md` — 분석·계리·IT 6개 + 문서작성 6개 사례 추가됨
- [ ] `site/content/module-5.md` — 정보 조회 6개 사례 추가됨
- [ ] `site/content/module-6.md` — IT 시나리오 4종 추가됨
- [ ] 사내 식별자(SETL_, UTAMT_, ASSM_, RS_DIV_, 11xxxx, SmartON, 새도약기금) 잔존 0건
- [ ] `npm run build` 성공
- [ ] git commit + push 완료
- [ ] GitHub Pages 배포 트리거됨

## 테스트 시나리오

### 정상 흐름

1. 사용자: "kdb_edu_final.md 보강 내용을 사이트에 반영해줘. 사내 데이터는 노출 안 되게."
2. Phase 0~5 순차 실행
3. 최종: 사이트 URL 회신 + 변경 이력 보고

### 부분 재실행 흐름

1. 사용자: "module-6의 IT 시나리오 부분만 다시 작성해줘"
2. Phase 0: `_workspace/kdb-revision/` 존재 → 부분 재실행 모드
3. Phase 2: module-6 revision-writer만 재실행
4. Phase 3~5: QA·빌드·배포

### 에러 흐름 (사내 식별자 잔재 발견)

1. Phase 3 QA에서 `SETL_YM` 잔재 발견
2. 해당 모듈의 revision-writer 재호출
3. Phase 3 재검증 → PASS
4. Phase 4~5 진행
