---
name: kdb-anonymization-rules
description: "KDB생명 사내 데이터 식별자(DB 컬럼명·테이블명·상품 코드값·시스템명·그룹사 사업명)를 사이트 게재 전 익명화하는 규칙 모음. 'KDB 데이터 노출 방지', '사내 식별자 마스킹', '컬럼명 익명화', '상품 코드 일반화' 요청 시 또는 site/content/*.md에 보강 콘텐츠를 추가할 때 반드시 사용."
---

# KDB 사내 데이터 익명화 규칙

`namojo.github.io/ai-edu` 공개 사이트에 KDB생명 임직원용 교육 콘텐츠를 게재할 때, 사내 데이터 식별자가 외부에 노출되지 않도록 강제하는 규칙 모음. revision-writer / content-qa / content-transformer가 모두 동일한 규칙을 참조한다.

## 적용 대상

- `site/content/module-*.md` (사이트 콘텐츠)
- 보강·개정 작업으로 추가되는 모든 사례·예시·코드 블록
- 특히 SQL 사례, 시스템 설계 사례, 그룹사 관련 사례

## 절대 금지 패턴 (그대로 노출 불가)

> 상세 표는 `references/anonymization-table.md` 참조. 이 SKILL.md는 핵심 패턴만 담고, 매핑표는 references로 분리.

### 1. 사내 DB 식별자 (Prefix 기반 패턴)

| Prefix | 의미 영역 | 게재용 |
|---|---|---|
| `SETL_*` | 결제·납입 관련 컬럼 | `[기준월컬럼]`, `[납입경과월컬럼]` 등 한글 가상 명칭 |
| `UTAMT_*` | 금액 관련 컬럼 | `[해지환급금컬럼]`, `[기납입보험료컬럼]` 등 |
| `ASSM_*` | 가정 관련 컬럼 | `[가정구분코드컬럼]`, `[가정파일ID컬럼]` 등 |
| `RS_DIV_*` | 리스크 구분 컬럼 | `[리스크구분컬럼]` |

### 2. 사내 코드값

| 영역 | 원본 예 | 게재용 |
|---|---|---|
| 상품군 코드 (4~6자리) | `110103`, `110204` | `상품군 A/B/C/D` |
| 가정구분 코드 | `'05'` | `'XX'` |

### 3. 사내 시스템·고유명

| 원본 | 게재용 |
|---|---|
| `SmartON Tablet` | `사내 영업 태블릿 단말` |
| `새도약기금` | `정책금융 펀드` (또는 `그룹사 정책금융 동향`) |

## 노출 허용 (보험업·금융 일반 용어)

- 회계·건전성 표준: K-ICS, IFRS 17, CSM, BEL, RA, ALM, LAT
- 계리 약어: LC (Life Contingency)
- 상품 카테고리: 무/저해지 종신보험, 환급률 100% 도래 시점, 변액보험, 종신보험 등
- 공개 법령: 보험업법, 보험업감독규정, 개인정보보호법, 신용정보법
- 공개 기관: 보험개발원, 생명보험협회, KIRI, 금감원, DART, 한은 ECOS
- 공개 표준: 마이데이터, OAuth 2.0, OWASP Top 10
- 일반 기술: Oracle, SAS, R, PROC LOGISTIC, ROW_NUMBER, glm

## 더미 치환 방식

### SQL 예시 (방식 A — 한글 가상 명칭, 기본 권장)

```sql
-- 사내 실제 컬럼명·코드값은 모두 마스킹된 예시입니다
SELECT [기준월], [해지환급금], [기납입보험료]
FROM 보유계약테이블
WHERE [가정구분코드] = 'XX' AND [가정파일ID] = 'LC'
  AND [상품코드] IN ('상품군A', '상품군B', '상품군C', '상품군D')
```

### SQL 예시 (방식 B — 영문 일반 명칭, IT 학습자용)

```sql
SELECT MONTH_KEY, SURRENDER_AMT, PAID_PREM_AMT
FROM POLICY_INFORCE
WHERE ASSUMPTION_CODE = 'XX' AND ASSUMPTION_FILE = 'LC'
  AND PRODUCT_CODE IN ('PROD_A', 'PROD_B', 'PROD_C', 'PROD_D')
```

> 학습 효과를 위해 비즈니스 의미는 그대로 전달하되, 사내 식별자는 일반화한다.

## 사이트 게재 시 메타 메시지

각 보강 사례 끝(특히 SQL/코드/시스템 관련)에는 다음 안내를 삽입한다:

> 💡 **사이트 게재 주의**: 본 사례의 SQL·코드·시스템명은 **모두 더미 치환된 일반화 예시**입니다. 실제 사내 컬럼명·코드값·시스템 식별자를 외부 LLM에 입력할 때는 반드시 마스킹 후 사용하세요.

## 자체 검증 명령 (writer/QA 공통)

작업 완료 후 다음 Grep 패턴으로 잔재 0건 확인:

```bash
# Grep 도구 사용
pattern: "SETL_[A-Z_]+|UTAMT_[A-Z_]+|ASSM_[A-Z_]+|RS_DIV_[A-Z]+"
glob: "site/content/*.md"

pattern: "\b110(103|204|301|106)\b"
glob: "site/content/*.md"

pattern: "SmartON|새도약기금"
glob: "site/content/*.md"
```

세 명령 모두 결과 0건이어야 PASS.

## 사용 시점 (트리거)

이 스킬은 다음 작업 시 반드시 참조:

1. `kdb_edu_final.md`(개정판) 보강 콘텐츠를 사이트에 추가하는 모든 작업
2. `site/content/*.md`에 새 SQL·코드·시스템 사례를 추가하는 모든 작업
3. `kdb-revision-deploy` 오케스트레이터 실행 중
4. `content-qa` 검증 단계
5. 사용자가 *"KDB 사내 데이터 노출 방지"*, *"식별자 마스킹"*, *"컬럼명 익명화"*를 요청한 모든 시점

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-04-28 | 초기 익명화 규칙 정의 (개정판 보강 콘텐츠 사이트 게재용) |
