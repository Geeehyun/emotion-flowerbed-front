# 이미지 폴더 구조 변경 가이드

## 📁 새로운 폴더 구조

README에서 제안된 새로운 이미지 폴더 구조로 변경이 필요합니다.

```
src/assets/images/
├── flowers/
│   ├── 3d/                    # 화단 화면용 (PNG 형식, 투명 배경)
│   │   ├── sunflower.png      # 기쁨 (JOY)
│   │   ├── cosmos.png         # 행복 (HAPPINESS)
│   │   ├── pink-rose.png      # 감사 (GRATITUDE)
│   │   ├── freesia.png        # 설렘 (EXCITEMENT)
│   │   ├── lily-valley.png    # 평온 (PEACE)
│   │   ├── yellow-tulip.png   # 성취감 (ACHIEVEMENT)
│   │   ├── red-rose.png       # 사랑 (LOVE)
│   │   ├── daisy.png          # 희망 (HOPE)
│   │   ├── gerbera.png        # 활력 (VITALITY)
│   │   ├── sweet-pea.png      # 재미 (FUN)
│   │   ├── blue-hydrangea.png # 슬픔 (SADNESS)
│   │   ├── forget-me-not.png  # 외로움 (LONELINESS)
│   │   ├── lavender.png       # 불안 (ANXIETY)
│   │   ├── yellow-carnation.png # 분노 (ANGER)
│   │   ├── mint.png           # 피곤 (FATIGUE)
│   │   ├── purple-pansy.png   # 후회 (REGRET)
│   │   ├── lily.png           # 무기력 (LETHARGY)
│   │   ├── anemone.png        # 혼란 (CONFUSION)
│   │   ├── yellow-daffodil.png # 실망 (DISAPPOINTMENT)
│   │   ├── white-chamomile.png # 지루함 (BOREDOM)
│   │   └── unknown.png        # 감정 분석 실패 시
│   └── realistic/             # 상세 화면용 (JPG 형식, 실사)
│       ├── sunflower.jpg
│       ├── cosmos.jpg
│       ├── pink-rose.jpg
│       ├── freesia.jpg
│       ├── lily-valley.jpg
│       ├── yellow-tulip.jpg
│       ├── red-rose.jpg
│       ├── daisy.jpg
│       ├── gerbera.jpg
│       ├── sweet-pea.jpg
│       ├── blue-hydrangea.jpg
│       ├── forget-me-not.jpg
│       ├── lavender.jpg
│       ├── yellow-carnation.jpg
│       ├── mint.jpg
│       ├── purple-pansy.jpg
│       ├── lily.jpg
│       ├── anemone.jpg
│       ├── yellow-daffodil.jpg
│       ├── white-chamomile.jpg
│       └── unknown.jpg
└── (기타 이미지들 - note.png, garden-bg-rectangle.png, trowel.png 등)
```

## 📝 작업 순서

### 1. 폴더 생성 (이미 완료됨)

```bash
mkdir -p src/assets/images/flowers/3d
mkdir -p src/assets/images/flowers/realistic
```

### 2. 기존 이미지 이동

현재 `src/assets/images/` 에 있는 꽃 이미지들을 다음과 같이 이동해주세요:

#### 화단용 이미지 (3D 스타일, PNG)
- 기존: `src/assets/images/rose.png`
- 새 위치: `src/assets/images/flowers/3d/rose.png` (또는 해당하는 이름으로 변경)

### 3. 파일명 매핑 참고

README의 감정-이미지 매핑 테이블을 참고하여 파일명을 맞춰주세요:

| 감정 코드 | 한글 감정명 | 꽃 이름 | 3D 파일명 | 실사 파일명 |
|----------|------------|---------|-----------|------------|
| JOY | 기쁨 | 해바라기 | `sunflower.png` | `sunflower.jpg` |
| HAPPINESS | 행복 | 코스모스 | `cosmos.png` | `cosmos.jpg` |
| GRATITUDE | 감사 | 핑크 장미 | `pink-rose.png` | `pink-rose.jpg` |
| EXCITEMENT | 설렘 | 프리지아 | `freesia.png` | `freesia.jpg` |
| PEACE | 평온 | 은방울꽃 | `lily-valley.png` | `lily-valley.jpg` |
| ACHIEVEMENT | 성취감 | 노란 튤립 | `yellow-tulip.png` | `yellow-tulip.jpg` |
| LOVE | 사랑 | 빨간 장미 | `red-rose.png` | `red-rose.jpg` |
| HOPE | 희망 | 데이지 | `daisy.png` | `daisy.jpg` |
| VITALITY | 활력 | 거베라 | `gerbera.png` | `gerbera.jpg` |
| FUN | 재미 | 스위트피 | `sweet-pea.png` | `sweet-pea.jpg` |
| SADNESS | 슬픔 | 파란 수국 | `blue-hydrangea.png` | `blue-hydrangea.jpg` |
| LONELINESS | 외로움 | 물망초 | `forget-me-not.png` | `forget-me-not.jpg` |
| ANXIETY | 불안 | 라벤더 | `lavender.png` | `lavender.jpg` |
| ANGER | 분노 | 노란 카네이션 | `yellow-carnation.png` | `yellow-carnation.jpg` |
| FATIGUE | 피곤 | 민트 | `mint.png` | `mint.jpg` |
| REGRET | 후회 | 보라색 팬지 | `purple-pansy.png` | `purple-pansy.jpg` |
| LETHARGY | 무기력 | 백합 | `lily.png` | `lily.jpg` |
| CONFUSION | 혼란 | 아네모네 | `anemone.png` | `anemone.jpg` |
| DISAPPOINTMENT | 실망 | 노란 수선화 | `yellow-daffodil.png` | `yellow-daffodil.jpg` |
| BOREDOM | 지루함 | 흰 카모마일 | `white-chamomile.png` | `white-chamomile.jpg` |

### 4. unknown 이미지 준비

감정 분석 실패 시 사용할 기본 이미지:
- `src/assets/images/flowers/3d/unknown.png`
- `src/assets/images/flowers/realistic/unknown.jpg`

### 5. 이미지 최적화 권장사항

#### 3D 이미지 (화단용)
- 형식: PNG (투명 배경 지원)
- 권장 크기: 256x256px 이상
- 최적화: 파일 크기 최소화를 위해 TinyPNG 등 사용 권장

#### 실사 이미지 (상세 화면용)
- 형식: JPG
- 권장 크기: 512x512px 이상
- 품질: 80-90% 압축 권장

## ⚙️ 코드 변경 사항

이미 적용된 코드 변경사항:
- ✅ `src/utils/flowerMapper.js`: 감정-꽃 매핑 유틸리티 생성
- ✅ `src/services/diaryApi.js`: API 통신 서비스 생성
- ✅ `src/views/Garden.vue`: 새로운 구조 적용
- ✅ `.env.development`, `.env.production`: 환경 변수 설정

## 🚀 테스트 방법

이미지 이동이 완료되면:

1. 개발 서버 재시작 (이미 실행 중이면 HMR로 자동 반영됨)
```bash
npm run dev
```

2. 브라우저에서 확인:
   - 화단에 꽃 이미지가 정상적으로 표시되는지 확인
   - 일기 상세 모달에서 꽃 정보가 제대로 표시되는지 확인
   - 감정 분석 실패 시 unknown.png가 표시되는지 테스트

3. 콘솔 에러 확인:
   - 이미지를 찾을 수 없다는 에러가 없는지 확인
   - Network 탭에서 404 에러가 없는지 확인

## 📌 주의사항

1. **파일명 정확성**:
   - README의 매핑 테이블과 `flowerMapper.js`의 `file` 속성이 정확히 일치해야 합니다
   - 대소문자, 하이픈(-) 위치 등을 정확히 지켜주세요

2. **이미지 형식**:
   - 3D 폴더: 반드시 PNG 형식
   - realistic 폴더: 반드시 JPG 형식

3. **fallback 처리**:
   - 이미지가 없는 경우 자동으로 `unknown.png` / `unknown.jpg`로 대체됩니다
   - `getFlowerImage()` 함수에서 자동 처리됨

## 🔄 향후 작업

- [ ] 20개 감정 각각에 대한 3D 꽃 이미지 준비
- [ ] 20개 감정 각각에 대한 실사 꽃 이미지 준비
- [ ] unknown 이미지 디자인
- [ ] 이미지 최적화 및 압축
- [ ] Lazy loading 구현 (추후 성능 개선)
