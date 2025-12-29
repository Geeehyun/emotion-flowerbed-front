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

## 🔮 향후 배포 예정 작업

### 운영 배포 시
- [ ] 환경 변수 설정 확인 (API URL 등)
- [ ] HTTPS 설정
- [ ] Gzip 압축 설정
- [ ] 로깅 설정
- [ ] 모니터링 설정
