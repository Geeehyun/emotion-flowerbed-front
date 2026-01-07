# 한국어 사용 지침

모든 응답을 한국어로만 제공해주세요.

- 코드 주석과 커밋 메시지도 한국어로 작성
- 영어는 기술 용어만 사용

# 코드 구현 지침

프로젝트 코드를 파악하여 유사하게 구현해주세요.

## CSS 파일 관리 규칙

CSS 파일의 경우 내부 스타일 시트 방식이나 인라인 스타일 방식이 아닌, 각 뷰에 맞는 CSS 파일에 작성해 주세요:

### 학생 화면 (Garden.vue)
- **파일**: `\src\assets\styles\garden.css`
- **규칙**: 주석으로 영역을 표시 후 추가
- **네이밍**: 일반 클래스명 사용 (예: `.card`, `.button`)

### 선생님 화면 (Teacher.vue)
- **파일**: `\src\assets\styles\teacher.css`
- **규칙**: **모든 최상위 클래스는 반드시 `teacher-` prefix 사용**
- **네이밍 예시**:
  - ✅ `.teacher-header`, `.teacher-card`, `.teacher-button`
  - ❌ `.header`, `.card`, `.button` (garden.css와 충돌)
- **하위 요소**: `.teacher-card .card-title` 형태는 허용
- **이유**: garden.css와 teacher.css의 클래스명 충돌 방지

### Landing 화면 (Landing.vue)
- **파일**: `\src\assets\styles\garden.css` (공유)
- **규칙**: 주석으로 영역을 표시 후 추가

# 작업 진행 지침

로직을 수정/추가할 때는 어떤식으로 구현할지 먼저 개요를 보여준 후 사용자에게 확인 받고 작업을 진행해주세요.
작업 진행 중 사용자가 알아야할 사항이 발생 시 지체없이 사용자에게 고지 후 확인 받고 작업을 이어가주세요.

# 배포/인프라 관련 지침

Claude가 직접 수행할 수 없는 작업(서버 설정, 배포, 인프라 구성 등)이 필요한 경우:
1. 해당 작업을 DEPLOYMENT_TODO.md 파일에 기록해주세요
2. 버전별로 구분하여 체크리스트 형태로 작성해주세요
3. 설정 코드나 명령어가 있다면 코드 블록으로 포함해주세요
4. 작업이 필요한 이유와 예상 효과를 간단히 설명해주세요

# Git Commit/Push 보안 검증 지침

**중요: Git commit/push 전에 자동으로 민감정보 검증이 실행됩니다.**

`.claude/hooks/` 디렉토리에 민감정보 검증 스크립트가 설정되어 있습니다:
- `validate-git-command.sh`: git commit/push 명령 감지
- `check-sensitive-info.sh`: 민감정보 패턴 검증

## 차단되는 민감정보 패턴:

### 파일명
- docker-compose.yml / docker-compose.yaml
- .env.local
- secrets.json, credentials.json
- private-key.pem, id_rsa

### 파일 내용
- API 키 (Claude, OpenAI, AWS 등)
- 데이터베이스 비밀번호
- JWT 토큰
- Private Key
- Redis 비밀번호
- DB 연결 문자열 (계정 정보 포함 시)

## 민감정보 관리 규칙:

1. **환경변수 파일**: `.env.development`, `.env.production`은 상대 경로만 사용 (실제 값 금지)
2. **민감정보 파일**: `study/` 디렉토리에 보관 (Git에 올라가지 않음)
3. **Docker Compose**: 실제 배포용 설정은 EC2 서버에만 보관
4. **API 키**: GitHub Secrets 사용

검증이 실패하면 커밋/푸시가 자동으로 차단됩니다.

---

# 학습 노트 기록 지침

사용자가 학습적인 질문을 하는 경우:
1. 답변을 완료한 후 "study 디렉토리에 이 내용을 학습 노트로 기록할까요?" 라고 물어보세요
2. 사용자가 승인하면 `study/YYYY-MM-DD-주제.md` 형식으로 파일을 생성하세요
3. 학습 노트에는 다음 내용을 포함하세요:
   - 배운 내용의 핵심 요약
   - 코드 예시 (Before/After 비교 포함)
   - 왜 그렇게 하는지 이유 설명
   - 실제 프로젝트에 적용한 사례
   - 참고 자료 링크 (있을 경우)
4. study 디렉토리는 .gitignore에 등록되어 Git에 올라가지 않습니다

학습적인 질문의 예시:
- "왜 ~~ 를 사용해야 하나요?"
- "~~와 ~~의 차이가 뭔가요?"
- "~~ 는 어떻게 동작하나요?"
- "이게 왜 필요한가요?"
