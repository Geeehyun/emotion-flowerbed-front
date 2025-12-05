# 일기 감정 분석 - Frontend (Vue)

## 개요

사용자가 작성한 일기의 감정을 AI로 분석하고, 감정에 맞는 꽃을 보여주는 서비스의 프론트엔드

## 기술 스택

- Vue.js 3.x
- [상태 관리 라이브러리]
- [UI 라이브러리]
- Axios (API 통신)

---

## 주요 기능

### 1. 일기 작성

- 날짜 선택
- 텍스트 입력 (최대 5000자)
- 작성 완료 시 AI 감정 분석 요청

### 2. 감정 분석 결과 표시

- 대표 감정에 해당하는 꽃 이미지 표시
- 꽃말 및 감정 요약 표시
- 감정 비율 차트 (선택사항)

### 3. 화단 화면

- 3D 스타일 꽃 일러스트로 감정 히스토리 시각화
- 월별 일기 목록

### 4. 일기 상세 보기

- 실사 스타일 꽃 이미지
- 전체 일기 내용 및 분석 결과

---

## API 연동

### Base URL

```javascript
const API_BASE_URL = process.env.VUE_APP_API_URL || "http://localhost:8080/api";
```

### 엔드포인트

#### 1. 일기 감정 분석

```javascript
POST /diaries/{diaryId}/analyze

Request:
{
  "diaryContent": "일기 내용...",
  "diaryDate": "2025-12-04"
}

Response:
{
  "summary": "일기 요약",
  "emotions": [
    {"emotion": "JOY", "percent": 60},
    {"emotion": "SADNESS", "percent": 40}
  ],
  "coreEmotion": "JOY",
  "reason": "선택 이유",
  "flower": "해바라기",
  "floriography": "당신을 보면 행복해요"
}
```

#### 2. 일기 목록 조회 (월별)

```javascript
GET /diaries?yearMonth=2025-12

Response:
{
  "yearMonth": "2025-12",
  "diaries": [
    {
      "id": 1,
      "date": "2025-12-04",
      "coreEmotion": "JOY",
      "flower": "해바라기",
      "summary": "일기 요약..."
    }
  ],
  "totalCount": 15,
  "hasNextMonth": true,
  "hasPrevMonth": true
}
```

---

## 감정별 이미지 에셋

### 이미지 파일 구조

```
src/assets/images/flowers/
├── 3d/                    # 화단 화면용
│   ├── sunflower.png      # 기쁨
│   ├── cosmos.png         # 행복
│   ├── pink-rose.png      # 감사
│   └── ...
└── realistic/             # 상세 화면용
    ├── sunflower.jpg
    ├── cosmos.jpg
    └── ...
```

### 감정-이미지 매핑

| 감정   | 꽃            | 3D 파일명              | 실사 파일명            |
| ------ | ------------- | ---------------------- | ---------------------- |
| 기쁨   | 해바라기      | `sunflower.png`        | `sunflower.jpg`        |
| 행복   | 코스모스      | `cosmos.png`           | `cosmos.jpg`           |
| 감사   | 핑크 장미     | `pink-rose.png`        | `pink-rose.jpg`        |
| 설렘   | 프리지아      | `freesia.png`          | `freesia.jpg`          |
| 평온   | 은방울꽃      | `lily-valley.png`      | `lily-valley.jpg`      |
| 성취감 | 노란 튤립     | `yellow-tulip.png`     | `yellow-tulip.jpg`     |
| 사랑   | 빨간 장미     | `red-rose.png`         | `red-rose.jpg`         |
| 희망   | 데이지        | `daisy.png`            | `daisy.jpg`            |
| 활력   | 거베라        | `gerbera.png`          | `gerbera.jpg`          |
| 재미   | 스위트피      | `sweet-pea.png`        | `sweet-pea.jpg`        |
| 슬픔   | 파란 수국     | `blue-hydrangea.png`   | `blue-hydrangea.jpg`   |
| 외로움 | 물망초        | `forget-me-not.png`    | `forget-me-not.jpg`    |
| 불안   | 라벤더        | `lavender.png`         | `lavender.jpg`         |
| 분노   | 노란 카네이션 | `yellow-carnation.png` | `yellow-carnation.jpg` |
| 피곤   | 민트          | `mint.png`             | `mint.jpg`             |
| 후회   | 보라색 팬지   | `purple-pansy.png`     | `purple-pansy.jpg`     |
| 무기력 | 백합          | `lily.png`             | `lily.jpg`             |
| 혼란   | 아네모네      | `anemone.png`          | `anemone.jpg`          |
| 실망   | 노란 수선화   | `yellow-daffodil.png`  | `yellow-daffodil.jpg`  |
| 지루함 | 흰 카모마일   | `white-chamomile.png`  | `white-chamomile.jpg`  |

### 이미지 매핑 유틸리티

```javascript
// src/utils/flowerMapper.js
export const EMOTION_FLOWER_MAP = {
  JOY: { name: "해바라기", nameEn: "Sunflower", file: "sunflower" },
  HAPPINESS: { name: "코스모스", nameEn: "Cosmos", file: "cosmos" },
  GRATITUDE: { name: "핑크 장미", nameEn: "Pink Rose", file: "pink-rose" },
  EXCITEMENT: { name: "프리지아", nameEn: "Freesia", file: "freesia" },
  PEACE: { name: "은방울꽃", nameEn: "Lily of the Valley", file: "lily-valley" },
  ACHIEVEMENT: { name: "노란 튤립", nameEn: "Yellow Tulip", file: "yellow-tulip" },
  LOVE: { name: "빨간 장미", nameEn: "Red Rose", file: "red-rose" },
  HOPE: { name: "데이지", nameEn: "Daisy", file: "daisy" },
  VITALITY: { name: "거베라", nameEn: "Gerbera", file: "gerbera" },
  FUN: { name: "스위트피", nameEn: "Sweet Pea", file: "sweet-pea" },
  SADNESS: { name: "파란 수국", nameEn: "Blue Hydrangea", file: "blue-hydrangea" },
  LONELINESS: { name: "물망초", nameEn: "Forget-me-not", file: "forget-me-not" },
  ANXIETY: { name: "라벤더", nameEn: "Lavender", file: "lavender" },
  ANGER: { name: "노란 카네이션", nameEn: "Yellow Carnation", file: "yellow-carnation" },
  FATIGUE: { name: "민트", nameEn: "Mint", file: "mint" },
  REGRET: { name: "보라색 팬지", nameEn: "Purple Pansy", file: "purple-pansy" },
  LETHARGY: { name: "백합", nameEn: "Lily", file: "lily" },
  CONFUSION: { name: "아네모네", nameEn: "Anemone", file: "anemone" },
  DISAPPOINTMENT: { name: "노란 수선화", nameEn: "Yellow Daffodil", file: "yellow-daffodil" },
  BOREDOM: { name: "흰 카모마일", nameEn: "White Chamomile", file: "white-chamomile" },
};

// 감정명 한글 매핑
export const EMOTION_KR_MAP = {
  JOY: "기쁨",
  HAPPINESS: "행복",
  GRATITUDE: "감사",
  EXCITEMENT: "설렘",
  PEACE: "평온",
  ACHIEVEMENT: "성취감",
  LOVE: "사랑",
  HOPE: "희망",
  VITALITY: "활력",
  FUN: "재미",
  SADNESS: "슬픔",
  LONELINESS: "외로움",
  ANXIETY: "불안",
  ANGER: "분노",
  FATIGUE: "피곤",
  REGRET: "후회",
  LETHARGY: "무기력",
  CONFUSION: "혼란",
  DISAPPOINTMENT: "실망",
  BOREDOM: "지루함",
};

export function getFlowerImage(emotionCode, style = "3d") {
  const flower = EMOTION_FLOWER_MAP[emotionCode];
  if (!flower) return null;

  const ext = style === "3d" ? "png" : "jpg";
  return require(`@/assets/flowers/${style}/${flower.file}.${ext}`);
}

export function getEmotionName(emotionCode, lang = "kr") {
  return lang === "kr" ? EMOTION_KR_MAP[emotionCode] : emotionCode;
}
```

---

## 컴포넌트 구조 (제안)

```
src/
├── components/
│   ├── diary/
│   │   ├── DiaryEditor.vue        # 일기 작성 폼
│   │   ├── DiaryCard.vue          # 일기 카드
│   │   └── EmotionResult.vue      # 감정 분석 결과
│   ├── flower/
│   │   ├── FlowerDisplay.vue      # 꽃 이미지 표시
│   │   └── EmotionChart.vue       # 감정 비율 차트
│   └── garden/
│       └── FlowerGarden.vue       # 화단 화면
├── views/
│   ├── DiaryWrite.vue             # 일기 작성 페이지
│   ├── DiaryDetail.vue            # 일기 상세 페이지
│   └── Garden.vue                 # 화단 페이지
├── services/
│   └── diaryApi.js                # API 호출 서비스
└── utils/
    └── flowerMapper.js            # 감정-꽃 매핑
```

---

## 에러 처리

### API 에러 핸들링

```javascript
// services/diaryApi.js
async analyzeDiary(diaryId, content, date) {
  try {
    const response = await axios.post(`/diaries/${diaryId}/analyze`, {
      diaryContent: content,
      diaryDate: date
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      // 입력 값 검증 실패
      throw new Error('일기 내용이 너무 길거나 잘못되었습니다.');
    } else if (error.response?.status === 429) {
      // Rate Limit
      throw new Error('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response?.status === 500) {
      // AI 분석 실패
      throw new Error('감정 분석에 실패했습니다. 다시 시도해주세요.');
    }
    throw new Error('일기 분석 중 문제가 발생했습니다.');
  }
}
```

### 기본값 처리

AI 분석 실패 시 기본 감정 표시:

```javascript
const DEFAULT_EMOTION = {
  coreEmotion: "PEACE",
  flower: "은방울꽃",
  floriography: "행복의 재림",
  summary: "일기 분석에 실패했지만 괜찮아요.",
};
```

---

## 로딩 상태 처리

### 분석 중 UI

- 로딩 스피너 또는 애니메이션
- "일기를 분석하고 있어요..." 메시지
- 예상 소요 시간: 3-5초

```javascript
// DiaryEditor.vue
const isAnalyzing = ref(false);

async function submitDiary() {
  isAnalyzing.value = true;
  try {
    const result = await diaryApi.analyzeDiary(diaryId, content, date);
    // 결과 처리
  } finally {
    isAnalyzing.value = false;
  }
}
```

---

## 환경 변수

```bash
# .env.development
VUE_APP_API_URL=http://localhost:8080/api

# .env.production
VUE_APP_API_URL=https://emotion-flowerbed.com/api
```

---

## 개발 시 참고사항

### 1. 감정 분석은 비동기

- 사용자가 일기 작성 완료 후 즉시 결과가 나오지 않을 수 있음
- 로딩 상태 필수

### 2. 이미지 최적화

- 3D 이미지: PNG, 투명 배경
- 실사 이미지: JPEG
- Lazy loading 적용

### 3. 감정 데이터 일관성

- 백엔드의 감정 목록(20개)과 프론트의 이미지 파일명이 정확히 일치해야 함
- 감정명 오타 주의

### 4. 접근성

- 꽃 이미지에 대체 텍스트 제공
- 색각 이상자를 위한 텍스트 레이블 병행

---

## 테스트 체크리스트

- [ ] 일기 작성 후 감정 분석 정상 동작
- [ ] 20개 감정 모두 이미지 정상 표시
- [ ] API 에러 시 적절한 에러 메시지 표시
- [ ] 로딩 상태 UI 표시
- [ ] 5000자 초과 입력 시 경고
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)

---

## 향후 개선사항

- [ ] 감정 히스토리 차트 (월별/연도별)
- [ ] 감정 분석 결과 수정 기능 (v2)
- [ ] 일기 공유 기능
