# 감정 화단 (Emotion Flowerbed) - Frontend

Vue 3로 구현된 감정 일기 서비스의 프론트엔드입니다.
사용자가 작성한 일기를 AI가 분석하여 감정에 맞는 꽃을 화단에 심어줍니다.

## 기술 스택

- **프레임워크**: Vue 3 (Composition API)
- **스타일링**: Tailwind CSS
- **상태 관리**: Vue 3 Reactivity (ref, computed)
- **HTTP 클라이언트**: Axios
- **차트**: Chart.js
- **아이콘**: Heroicons
- **이미지 처리**: html2canvas
- **빌드 도구**: Vite

## 주요 기능

### 1. 화단 화면 (Garden.vue)

- 월별 일기를 3D 스타일 꽃으로 시각화
- 격자 레이아웃으로 일기 배치 (최대 31일)
- 꽃 호버 시 툴팁 표시 (꽃말, 날짜, 감정)
- 물뿌리개 애니메이션 효과

### 2. 일기 작성

- 날짜 선택 모달 (월/일 선택)
- 일기 내용 입력 (Textarea)
- AI 감정 분석 (실제 분석 / 테스트 랜덤)
- 분석 중 로딩 애니메이션

### 3. 일기 읽기 (Flip Card)

- **앞면**: 일기 내용 + AI 분석 정보
  - 요약, 감정 비율, 대표 감정, 선정 이유
  - 수채화 스타일 배경 이미지
  - 미분석 일기: 재분석 / 삭제 버튼
- **뒷면**: 꽃 정보 도감
  - 꽃 이름 (한글/학명)
  - 꽃말 및 유래
  - 색상, 원산지, 향기, 재미있는 사실
  - 드래그 가능한 포스트잇
  - 이미지 저장 기능

### 4. 감정 도감

- 전체 20가지 감정 카탈로그
- 획득/미획득 상태 표시
- 긍정/부정 감정 색상 구분
- 상세 정보 패널 (획득한 감정만 전체 정보 표시)

### 5. 이미지 저장

- html2canvas를 이용한 화면 캡쳐
- 포스트잇/상세정보 포함 옵션
- 다운로드 기능 (데스크톱/안드로이드)
- iPhone 길게 눌러 저장 안내

## 프로젝트 구조

```
src/
├── assets/
│   ├── images/
│   │   ├── flowers/
│   │   │   ├── 3d/           # 화단용 3D 꽃 이미지 (PNG)
│   │   │   └── realistic/    # 상세화면용 실사 꽃 이미지 (PNG)
│   │   ├── garden-bg-rectangle.png
│   │   ├── waterting-can.png
│   │   └── trowel.png
│   └── styles/
│       ├── main.css          # Tailwind 설정
│       └── garden.css        # Garden 컴포넌트 전용 스타일
├── components/
│   └── modals/               # 모달 컴포넌트들
│       ├── LoadingModal.vue
│       ├── AlertModal.vue
│       ├── ImagePreviewModal.vue
│       ├── DiaryWriteModal.vue
│       ├── DatePickerModal.vue
│       ├── DiaryReadModal.vue
│       └── EncyclopediaModal.vue
├── services/
│   └── diaryApi.js           # API 통신 서비스
├── utils/
│   └── flowerMapper.js       # 감정-꽃 매핑 유틸리티
└── views/
    └── Garden.vue            # 메인 화단 화면
```

## API 연동

### Base URL

```javascript
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
```

### 주요 엔드포인트

#### 1. 월별 일기 목록 조회

```
GET /diaries?yearMonth=YYYY-MM
```

#### 2. 특정 날짜 일기 조회

```
GET /diaries/date/{date}
```

#### 3. 일기 작성

```
POST /diaries
Body: { diaryDate, content }
```

#### 4. 일기 감정 분석 (AI)

```
POST /diaries/{diaryId}/analyze
```

#### 5. 일기 감정 분석 (테스트 - 랜덤)

```
POST /diaries/{diaryId}/analyze-test
```

#### 6. 획득한 감정 목록 조회

```
GET /flowers/my-emotions
```

#### 7. 전체 감정 목록 조회

```
GET /flowers/all-emotions
```

#### 8. 일기 수정 / 삭제

```
PUT /diaries/{diaryId}
DELETE /diaries/{diaryId}
```

## 감정-꽃 매핑

총 20가지 감정:
\*\* 추후 수정 예정(감정 무드미터 기반)

### 긍정 감정 (10가지)

| 감정 코드   | 한글   | 꽃 이름   | 꽃말                 |
| ----------- | ------ | --------- | -------------------- |
| JOY         | 기쁨   | 해바라기  | 당신을 보면 행복해요 |
| HAPPINESS   | 행복   | 코스모스  | 평화로운 사랑        |
| GRATITUDE   | 감사   | 핑크 장미 | 감사의 마음          |
| EXCITEMENT  | 설렘   | 프리지아  | 순수한 마음          |
| PEACE       | 평온   | 은방울꽃  | 행복의 재림          |
| ACHIEVEMENT | 성취감 | 노란 튤립 | 성공을 기원해요      |
| LOVE        | 사랑   | 빨간 장미 | 사랑해요             |
| HOPE        | 희망   | 데이지    | 희망과 평화          |
| VITALITY    | 활력   | 거베라    | 항상 기운차게        |
| FUN         | 재미   | 스위트피  | 즐거운 추억          |

### 부정 감정 (10가지)

| 감정 코드      | 한글   | 꽃 이름       | 꽃말             |
| -------------- | ------ | ------------- | ---------------- |
| SADNESS        | 슬픔   | 파란 수국     | 당신을 이해해요  |
| LONELINESS     | 외로움 | 물망초        | 나를 잊지 말아요 |
| ANXIETY        | 불안   | 라벤더        | 마음의 평온      |
| ANGER          | 분노   | 노란 카네이션 | 실망했어요       |
| FATIGUE        | 피곤   | 민트          | 힐링이 필요해요  |
| REGRET         | 후회   | 보라색 팬지   | 생각에 잠기다    |
| LETHARGY       | 무기력 | 백합          | 순수한 마음으로  |
| CONFUSION      | 혼란   | 아네모네      | 기대와 희망      |
| DISAPPOINTMENT | 실망   | 노란 수선화   | 새로운 시작      |
| BOREDOM        | 지루함 | 흰 카모마일   | 역경 속의 힘     |

## 개발 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 향후 개선사항

- [ ] 감정 무드미터 기준으로 감정 - 꽃 매칭 변경
- [ ] 교사와 학생 role 구분
- [ ] 교사용 화면 구현 (동일한 화면에서 role만 구별할지, 분리할지 고려 필요)
- [ ] 감정 히스토리 차트 (월별/연도별 통계)
- [ ] 반응형 디자인 개선 (태블릿 최적화)
- [ ] 이미지 Lazy loading
- [ ] PWA 지원
