# 배포 TODO 리스트

> Claude가 직접 수행할 수 없는 배포/인프라 관련 작업 목록

---

## 🚀 개발서버 배포 (v0.1.0-dev)

### 📋 배포 전 체크리스트

#### Nginx 설정
- [ ] **이미지 캐싱 헤더 설정**
  ```nginx
  # nginx.conf 또는 사이트 설정 파일에 추가

  server {
      # ... 기존 설정 ...

      # 정적 파일 캐싱 설정
      location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
          expires 1y;                          # 1년간 캐시
          add_header Cache-Control "public, immutable";
          access_log off;
      }

      # CSS, JS 파일 캐싱
      location ~* \.(css|js)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
          access_log off;
      }

      # HTML 파일은 캐시하지 않음 (항상 최신 버전 확인)
      location ~* \.html?$ {
          expires -1;
          add_header Cache-Control "no-cache, no-store, must-revalidate";
      }
  }
  ```
  - **이유**: vite.config.js에서 파일명 해시를 추가했으므로, 브라우저 캐싱을 활성화하여 성능 향상
  - **효과**: 이미지 로딩 속도 개선, 서버 부하 감소

---

## 📝 작업 이력

### 2024-12-26
- 이미지 최적화 1단계 완료 (lazy loading + vite 빌드 설정)
- DEPLOYMENT_TODO.md 파일 생성

---

## 🐳 Docker + GitHub Actions 자동 배포 전환

### 📋 EC2 서버 설정
- [ ] **EC2 nginx 리버스 프록시 설정**
  ```nginx
  # /etc/nginx/sites-available/emotion-flowerbed
  server {
      listen 443 ssl;
      server_name emotion-flowerbed.duckdns.org;

      # SSL 인증서 설정
      ssl_certificate /path/to/cert.pem;
      ssl_certificate_key /path/to/key.pem;

      # 프론트엔드 프록시 (Docker 컨테이너 :3000)
      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      # API 프록시 (Docker 컨테이너 :8080)
      location /api {
          proxy_pass http://localhost:8080;
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```

- [ ] **docker-compose.yml 배포**
  - `study/docker-compose.yml.example` 참고
  - EC2 서버의 `/home/ubuntu/emotion-flowerbed/docker-compose.yml` 위치에 배포
  - 민감정보 포함되므로 Git에 올리지 말 것!

- [ ] **GitHub Secrets 설정**
  - `GHCR_TOKEN`: GitHub Container Registry 접근 토큰
  - `EC2_HOST`: EC2 서버 IP 또는 도메인
  - `EC2_USER`: SSH 사용자명
  - `EC2_SSH_KEY`: EC2 접속용 SSH private key

### 📝 프론트엔드 빌드 체크리스트
- [x] Dockerfile 작성 완료
- [x] nginx.conf 작성 (Vue Router + 캐싱 설정)
- [x] .dockerignore 작성
- [x] 로컬 Docker 빌드 테스트 완료
- [ ] GitHub Actions 워크플로우 작성 (.github/workflows/deploy-front.yml)
- [ ] GHCR에 이미지 푸시 테스트
- [ ] EC2에서 docker-compose 테스트

---

## 🔮 향후 배포 예정 작업

### 감정레터 API 개발 (백엔드 작업)

#### DB 스키마
```sql
-- 레터 테이블
CREATE TABLE letters (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,  -- 목록용 요약
  content TEXT NOT NULL,  -- HTML 콘텐츠
  thumbnail_url VARCHAR(500),
  published_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_published_at (published_at DESC)
);

-- 사용자별 레터 읽음 여부
CREATE TABLE user_letter_read (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  letter_id BIGINT NOT NULL,
  read_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_user_letter (user_id, letter_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE,

  INDEX idx_user_id (user_id),
  INDEX idx_letter_id (letter_id)
);
```

#### API 엔드포인트
- [ ] **POST /api/v1/auth/login** - 응답에 `unreadLetterCount` 추가
  ```json
  {
    "accessToken": "...",
    "user": { ... },
    "unreadLetterCount": 2
  }
  ```

- [ ] **GET /api/v1/letters/unread-count** - 안 읽은 레터 수 조회
  ```json
  { "count": 2, "hasNew": true }
  ```

- [ ] **GET /api/v1/letters** - 레터 목록 조회 (읽음 여부 포함)
  ```json
  {
    "letters": [
      {
        "id": 123,
        "title": "1월 첫째주 감정 레터",
        "summary": "...",
        "publishedAt": "2025-01-06T00:00:00",
        "isRead": false,
        "thumbnailUrl": "/images/letters/2025-w1.png"
      }
    ],
    "totalCount": 10,
    "unreadCount": 2
  }
  ```

- [ ] **GET /api/v1/letters/{letterId}** - 레터 상세 조회 (조회 시 자동 읽음 처리)
  ```json
  {
    "id": 123,
    "title": "...",
    "content": "<div>...</div>",
    "publishedAt": "2025-01-06T00:00:00",
    "isRead": true,
    "readAt": "2025-01-07T14:30:00"
  }
  ```

#### 배치 작업
- [ ] **매주 월요일 00:00 레터 발행 배치**
  - 새 레터 생성 (letters 테이블에 INSERT)
  - user_letter_read는 사용자 조회 시 자동 생성

#### 프론트엔드 연동
- [ ] letterApi.js 생성
- [ ] Garden.vue에 하루 1회 체크 로직 추가
- [ ] 로그인 시 unreadLetterCount localStorage 저장
- [ ] 메뉴바에 'N' 뱃지 표시

---

### 운영 배포 시
- [ ] 환경 변수 설정 확인 (API URL 등)
- [ ] HTTPS 설정
- [ ] Gzip 압축 설정
- [ ] 로깅 설정
- [ ] 모니터링 설정
