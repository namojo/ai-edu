# Gemini Image Generation — 프롬프트 가이드

## 공통 스타일 프리픽스

모든 이미지 프롬프트 앞에 이 프리픽스를 붙인다:

```
Minimalist hand-drawn line-art illustration in warm ink pen style. Key characteristics:
- Line weight varies slightly (NOT perfectly uniform computer lines) to feel hand-drawn
- Limited color palette: black ink linework on warm off-white (#FFFDF7) background
- ONLY accent color: warm orange (#E8863A) used sparingly for highlights
- Caricature-style characters: oversized heads, simplified dot-and-line faces, elongated limbs
- Clean whitespace composition like an illustrated diary or sketchbook page
- NO gradients, NO 3D effects, NO complex shading
- Color fills slightly imperfect, as if colored with markers - small gaps and overlaps
- Architectural blueprint-style for processes and flows
- Historical figures depicted realistically within the line-art style
- Text labels in clean sans-serif font, technical terms in English, descriptions in Korean
```

## 모듈별 이미지 테마

### 모듈 1: 프롬프트 엔지니어링
- **주요 메타포**: 대화, 말풍선, 키보드 타이핑, 레시피/요리
- **캐릭터**: 직장인이 컴퓨터 앞에서 프롬프트를 작성하는 모습
- **소품**: 노트북, 체크리스트, 돋보기, 연필
- **color usage**: 좋은 프롬프트 결과에 오렌지 하이라이트

### 모듈 2: AI/LLM 비교
- **주요 메타포**: 도구 상자, 다양한 로봇/AI 캐릭터, 비교 차트
- **캐릭터**: 각 AI 도구를 의인화한 캐릭터들 (다른 모자/장비)
- **소품**: ChatGPT/Claude/Gemini 로고 스타일화, 비교 표
- **color usage**: 각 AI를 구분하되 오렌지 계열 내에서 변형

### 모듈 3: 보고서 작성
- **주요 메타포**: 문서, 타자기, 편집, 구조화된 페이지
- **캐릭터**: 보고서를 작성하고 편집하는 직장인
- **소품**: 서류, 스테이플러, 형광펜, 폴더
- **color usage**: 완성된 보고서에 오렌지 체크마크

### 모듈 4: 리서치와 검색
- **주요 메타포**: 탐험, 돋보기, 지도, 서재
- **캐릭터**: 탐정/탐험가 스타일 직장인
- **소품**: 돋보기, 책, 망원경, 나침반, 서류함
- **color usage**: 발견한 핵심 정보에 오렌지 하이라이트

### 모듈 5: 할루시네이션 방지
- **주요 메타포**: 팩트체크, 경고, 필터, 방패
- **캐릭터**: 경비원/검수관 스타일 직장인
- **소품**: 방패, 체크마크/X표, 경고 삼각형, 저울
- **color usage**: 위험에 검정 강조, 안전에 오렌지 체크

### 모듈 6: 산업별 시나리오
- **주요 메타포**: 공장 라인, 금융 차트, 실전 현장
- **캐릭터**: 제조 엔지니어 (안전모), 금융 분석가 (정장)
- **소품**: 디스플레이 패널, 반도체 웨이퍼, 금융 차트, 보험 서류
- **color usage**: 산업별 아이콘에 오렌지 포인트

## 슬라이드 타입별 구도 가이드

### title (제목 슬라이드)
```
Center composition. Large symbolic object in the middle (related to module theme).
2-3 small caricature characters around it, each holding props related to the topic.
Module title text area at the bottom (leave space for web overlay text).
Aspect ratio: 16:9 or 4:3.
```

### concept (개념 설명)
```
Split or floating composition. Main concept visualized as a metaphor on one side.
A character interacting with or observing the concept.
Small annotation arrows pointing to key parts.
Clean labels in English for technical terms.
```

### comparison (Before/After)
```
Left-right split composition with a vertical dividing line.
LEFT side: chaotic, confused - character with question marks, messy desk, tangled lines.
RIGHT side: organized, clear - character with lightbulb, neat desk, clean flow.
Small "Before" and "After" labels.
```

### example (프롬프트 예시)
```
Character sitting at desk with laptop/computer.
Speech bubble or thought bubble containing key prompt keywords.
The computer screen shows simplified text lines.
Warm, productive atmosphere.
```

### diagram (프로세스/흐름도)
```
Architectural blueprint-style flowchart.
Connected boxes/circles with arrows showing flow.
Each step has a small icon inside.
Isometric perspective optional for complex flows.
Orange highlights on key decision points.
```

### tip (팁/핵심 포인트)
```
Character holding or pointing at a lightbulb (idea) or a signpost.
The tip content is visualized as a small notecard or sticky note.
Warm, encouraging mood.
```

### practice (실습)
```
Character with pencil/pen actively writing on a large notepad or whiteboard.
Interactive, hands-on feeling.
Some blank spaces suggesting "fill in here".
```

### summary (요약)
```
Completed puzzle or assembled pieces.
Character holding a finished document with a checkmark.
Or: a bird's-eye view of all key concepts as small icons arranged neatly.
Achievement/completion mood.
```

## 프롬프트 작성 팁

1. **구체적으로**: "a person" 대신 "a professional office worker in business casual attire"
2. **구도를 명시**: "center composition", "left-right split", "bird's-eye view"
3. **분위기를 명시**: "warm, encouraging", "focused, professional", "curious, exploring"
4. **텍스트 최소화**: 이미지 내 텍스트는 영어 키워드만 2~3개
5. **배경 지시**: "clean off-white background with minimal detail" (항상)
6. **금지 항목 명시**: "no gradients, no 3D effects, no photorealistic elements"

## Gemini API 호출 파라미터

```json
{
  "model": "gemini-2.0-flash-exp",
  "contents": [{
    "parts": [{ "text": "{style_prefix}\n\n{slide_specific_prompt}" }]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "temperature": 0.8
  }
}
```

**대체 모델 (이미지 생성 전용):**
- `imagen-3.0-generate-002` — 더 높은 품질, 별도 엔드포인트
- `gemini-2.0-flash-exp` — 텍스트+이미지 혼합 출력

**이미지 추출:**
응답에서 `inlineData.mimeType === "image/png"` 또는 `"image/jpeg"`인 part를 찾아 base64 디코딩 후 파일로 저장.
