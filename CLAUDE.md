# ai-edu — 생성형 AI 교육 사이트

## 하네스: KDB 교육자료 변환

**목표:** KDB생명 임직원 대상 생성형 AI 교육 사이트. 사이트(`site/`) 콘텐츠 변환·검증·배포를 자동화.

**트리거:** KDB 교육자료 변환·제조업 제거·금융권 맞춤·연도 변경·GitHub Pages 배포 요청 시 `kdb-content-migration` 스킬을 사용. 사이트 프론트엔드 구조 변경은 `frontend-builder` 에이전트 사용.

**보호 파일 (수정 금지):**
- 루트 `/교육자료_*.md` (원본 마스터)
- 루트 `/교육자료_목차.md`

**변경 대상:**
- `site/content/module-*.md` (사이트 렌더링 대상)
- `site/app/**` (UI)
- 루트 `/KDB_교육자료_통합정리.md` (생성)

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-23 | 초기 KDB 하네스 구성 | agents/{kdb-domain-expert,content-transformer,content-qa} + skills/kdb-content-migration | 제조업 → KDB 금융 콘텐츠 변환 자동화 |
| 2026-04-24 | KDB생명 맞춤 변환 | site/content/module-*.md, site/app/lib/modules.ts, site/app/page.tsx | KDB 산업은행 → KDB생명(생명보험사) 전면 변환, 팩트체크 완료 |
