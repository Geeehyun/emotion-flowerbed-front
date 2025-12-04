# 🌸 일기 화단 프로젝트

감정을 꽃으로 피우는 일기 서비스

## 📋 프로젝트 개요

사용자가 일기를 작성하면 OpenAI를 통해 감정을 분석하고, 그에 맞는 꽃과 꽃말을 제공하여 한 달 동안의 감정을 화단으로 표현하는 프로젝트입니다.

## 🛠️ 기술 스택

- **Frontend**: Vue 3 + Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Java Spring Boot (별도 리포지토리)
- **AI**: OpenAI API (감정 분석 및 이미지 생성)
- **Deployment**: AWS + Docker

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
emotion-flowerbed-front/
├── public/              # 정적 파일
├── src/
│   ├── assets/         # 이미지, 스타일 등
│   │   └── styles/
│   │       └── main.css
│   ├── components/     # Vue 컴포넌트
│   ├── views/          # 페이지 뷰
│   ├── App.vue         # 루트 컴포넌트
│   └── main.js         # 앱 진입점
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 주요 기능 (예정)

- [ ] 일기 작성
- [ ] OpenAI 감정 분석
- [ ] 감정별 꽃 매칭
- [ ] 월별 화단 시각화
- [ ] 일기 히스토리

## 📝 라이선스

MIT
