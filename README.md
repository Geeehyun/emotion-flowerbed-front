# 감정 화단 (Emotion Flowerbed) - Frontend

<img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/ed109f8f-1fad-41b8-a712-9c5b6d98060a" />
<img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/92ba0362-e724-4e2d-add2-5607668718a3" />

Vue 3로 구현된 감정 일기 서비스의 프론트엔드입니다.
사용자가 작성한 일기를 AI가 분석하여 감정에 맞는 꽃을 화단에 심어주고, 선생님은 학급 학생들의 감정 상태를 모니터링할 수 있습니다.

## 기술 스택

- **프레임워크**: Vue 3 (Composition API)
- **스타일링**: CSS (Custom)
- **상태 관리**: Vue 3 Reactivity (ref, computed)
- **HTTP 클라이언트**: Axios
- **차트**: Chart.js
- **아이콘**: Heroicons
- **이미지 처리**: html2canvas
- **날짜 선택**: Vue Datepicker
- **빌드 도구**: Vite

## 주요 기능

### 학생 화면

#### 1. 화단 화면 (Garden.vue)
- 월별 일기를 3D 스타일 꽃으로 시각화
- 격자 레이아웃으로 일기 배치 (최대 31일)
- 꽃 호버 시 툴팁 표시 (꽃말, 날짜, 감정)
- 물뿌리개 애니메이션 효과
- 이미지 레이지 로딩 (LazyImage 컴포넌트)

#### 2. 일기 작성
- 날짜 선택 모달 (Vue Datepicker)
- 일기 내용 입력 (Textarea)
- AI 감정 분석 (실제 분석 / 테스트 랜덤)
- 분석 중 로딩 애니메이션

#### 3. 일기 읽기 (Flip Card)
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

#### 4. 감정 도감
- 전체 36가지 감정 카탈로그
- 획득/미획득 상태 표시
- 감정 무드미터 기준 감정 색상 구분
- 상세 정보 패널 (획득한 감정만 전체 정보 표시)

#### 5. 주간 감정 레터
- 주간 일기 기반 AI 감정 분석 리포트
- 레터 알림 시스템
- 레터 목록 조회 (우편함 UI)
- 상세 레터 보기 (감정 통계, 꽃 정보, 하이라이트)

#### 6. 월간 감정 화단
- 월별 감정 화단 시각화
- 날짜별 꽃 클릭 시 상세 정보 표시
- 감정 분포 그래프

### 선생님 화면

#### 1. 대시보드 (DashboardView.vue)
- **학급 감정 분포 현황**
  - 날짜별 학생 감정 분포 조회
  - 영역별(빨강/노랑/파랑/초록) 학생 수 표시
  - 감정 무드미터 정보 모달
- **위험 학생 관리**
  - CAUTION/DANGER 레벨 학생 모니터링
  - 위험도 변화 이력 조회
  - DANGER 상태 해제 기능
- **학생 목록**
  - 최근 감정 정보 포함
  - 스켈레톤 UI 로딩 상태

#### 2. 학생별 감정 레터 (StudentDetailView.vue)
- 학생별 주간 리포트 목록 조회
- 리포트 상세 보기
- 월간 감정 화단 모달
  - 학생의 월별 일기 감정 시각화
  - 날짜별 감정 상세 정보
  - 감정 분포 차트

#### 3. 이달의 학급 화단 (ClassEmotionMapView.vue)
- **그래프형 뷰**
  - Chart.js 기반 월별 감정 추이 라인 차트
  - 영역별 감정 데이터 시각화
  - 툴팁으로 상세 정보 제공
- **달력형 뷰**
  - 월별 캘린더 레이아웃
  - 날짜별 감정 분포 세그먼트 바
  - 커스텀 툴팁 (영역, 인원수, 비율)
- **이달의 학급 현황**
  - 총 학생 수
  - 데이터 수집 일수

#### 4. UI/UX 기능
- 반응형 사이드바 및 모바일 메뉴
- 스켈레톤 로딩 UI
- 이미지 레이지 로딩
- 토큰 자동 갱신 시스템

## 프로젝트 구조

```
src/
├── assets/
│   ├── images/
│   │   ├── flowers/
│   │   │   ├── 3d/           # 화단용 3D 꽃 이미지 (PNG)
│   │   │   └── realistic/    # 상세화면용 실사 꽃 이미지 (PNG)
│   │   ├── garden-bg-rectangle.png
│   │   ├── letterbox.png
│   │   ├── waterting-can.png
│   │   └── trowel.png
│   └── styles/
│       ├── main.css          # 전역 스타일
│       ├── garden.css        # 학생 화면 스타일
│       └── teacher.css       # 선생님 화면 스타일
│
├── components/
│   ├── common/               # 공통 컴포넌트
│   │   ├── EmotionContinuousToast.vue  # 연속 감정 알림
│   │   ├── FlowerSkeleton.vue          # 꽃 스켈레톤 로딩
│   │   ├── LazyImage.vue               # 레이지 이미지 로딩
│   │   └── modals/           # 공통 모달
│   │       ├── BaseModal.vue
│   │       ├── AlertModal.vue
│   │       ├── LoadingModal.vue
│   │       ├── LoginModal.vue
│   │       ├── EmotionControlModal.vue
│   │       └── ImagePreviewModal.vue
│   │
│   ├── diary/                # 일기 관련
│   │   ├── DiaryWriteModal.vue
│   │   ├── DiaryReadModal.vue
│   │   └── DiaryReportTemplate.vue
│   │
│   ├── encyclopedia/         # 감정도감
│   │   └── EncyclopediaModal.vue
│   │
│   ├── guide/                # 가이드
│   │   └── MoodMeterGuideModal.vue
│   │
│   ├── letter/               # 레터 관련
│   │   ├── LetterNotificationModal.vue
│   │   ├── LetterListModal.vue
│   │   └── LetterDetailModal.vue
│   │
│   ├── landing/              # 랜딩 페이지
│   │   └── AboutModal.vue
│   │
│   ├── layout/               # 학생 레이아웃
│   │   ├── SidebarMenu.vue
│   │   └── DatePickerModal.vue
│   │
│   └── teacher/              # 선생님 화면
│       ├── dashboard/        # 대시보드 섹션
│       │   ├── AttentionCareSection.vue
│       │   ├── EmotionDistributionSection.vue
│       │   ├── EmotionDistributionSkeleton.vue
│       │   ├── RiskHistorySection.vue
│       │   └── StudentListSkeleton.vue
│       ├── layout/           # 선생님 레이아웃
│       │   ├── TeacherHeader.vue
│       │   ├── TeacherSidebar.vue
│       │   └── TeacherMobileMenu.vue
│       ├── modals/           # 선생님 모달
│       │   ├── MoodMeterInfoModal.vue
│       │   ├── ResolveDangerModal.vue
│       │   ├── RiskHistoryMobileModal.vue
│       │   └── StudentMonthlyGardenModal.vue
│       └── views/            # 선생님 뷰
│           ├── DashboardView.vue
│           ├── ClassEmotionMapView.vue
│           ├── StudentDetailView.vue
│           └── TeacherLetterDetailView.vue
│
├── config/
│   ├── apiConfig.js          # API 설정
│   ├── menuConfig.js         # 학생 메뉴 설정
│   └── teacherMenuConfig.js  # 선생님 메뉴 설정
│
├── services/
│   ├── authApi.js            # 인증 API
│   ├── codeApi.js            # 코드 API
│   ├── diaryApi.js           # 일기 API
│   ├── teacherApi.js         # 선생님 API
│   └── weeklyReportApi.js    # 주간 리포트 API
│
├── utils/
│   └── flowerMapper.js       # 감정-꽃 매핑 유틸리티
│
└── views/
    ├── Landing.vue           # 랜딩 페이지
    ├── Garden.vue            # 학생 메인 화면
    └── Teacher.vue           # 선생님 메인 화면
```

## API 연동

### Base URL

```javascript
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
// 개발: http://localhost:8080/api/v1
```

### API 문서

자세한 API 명세는 백엔드 저장소의 문서를 참고하세요:

- **[학생 API 문서](../emotion-flowerbed-api/docs/api/student.md)** - 일기 작성/조회, 감정 분석, 주간 리포트 등
- **[선생님 API 문서](../emotion-flowerbed-api/docs/api/teacher.md)** - 학생 관리, 감정 현황, 위험 학생 모니터링 등

> 📍 백엔드 저장소 위치: `D:\vision\emotion-flowerbed-api\`

## 감정-꽃 매핑

감정 무드미터 기반으로 20가지 감정과 꽃이 매핑됩니다.

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

## 환경 변수 설정

`.env.development` 파일 생성:

```
VITE_APP_API_URL=http://localhost:8080/api/v1
```

## 향후 개선사항

- [ ] 감정 히스토리 차트 (연도별 통계)
- [ ] 반응형 디자인 개선 (태블릿 최적화)
- [ ] PWA 지원
- [ ] 감정 현황 기반 감정 관리 미션 시스템
  - 특정 감정 연속 발생 시 맞춤형 감정 관리 미션 제공
  - 과거 감정 미션 이행 활동 로그 및 히스토리 조회 기능
- [ ] 선생님 알림 시스템
- [ ] 학생별 감정 분석 리포트 다운로드 기능

## 완료된 기능 (v1.0)

- ✅ 감정 무드미터 기준으로 감정-꽃 매핑
- ✅ 교사와 학생 role 구분
- ✅ 교사용 화면 구현 (완전 분리)
- ✅ 이미지 Lazy loading
- ✅ 주간 감정 분석 레터 발행
- ✅ 위험 학생 관리 시스템
- ✅ 학급 감정 분포 시각화 (그래프형/달력형)
