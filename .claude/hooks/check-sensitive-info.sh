#!/bin/bash

# 민감정보 검증 스크립트
# Git staged 파일에서 민감정보 패턴을 검사합니다.

set -e

PROJECT_DIR="$(git rev-parse --show-toplevel)"
cd "$PROJECT_DIR"

echo "🔍 민감정보 검증 시작..."

# Staged 파일 목록
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  echo "✅ 검증할 파일이 없습니다."
  exit 0
fi

# 민감정보 발견 플래그
FOUND_SENSITIVE=0

# 1. 차단할 파일명 패턴
BLOCKED_FILES=(
  "docker-compose.yml"
  "docker-compose.yaml"
  ".env.local"
  "secrets.json"
  "credentials.json"
  "private-key.pem"
  "id_rsa"
)

echo "📄 파일명 검증 중..."
for file in $STAGED_FILES; do
  filename=$(basename "$file")
  for blocked in "${BLOCKED_FILES[@]}"; do
    if [[ "$filename" == "$blocked" ]]; then
      echo "❌ 차단된 파일 발견: $file"
      echo "   이유: $blocked 파일은 민감정보를 포함할 수 있습니다."
      FOUND_SENSITIVE=1
    fi
  done
done

# 2. 파일 내용에서 민감정보 패턴 검증
echo "🔎 파일 내용 검증 중..."

# Staged 파일의 내용 가져오기
STAGED_CONTENT=$(git diff --cached)

# API 키 패턴
if echo "$STAGED_CONTENT" | grep -qiE 'sk-ant-api03-[a-zA-Z0-9_-]{95}'; then
  echo "❌ Claude API Key 발견!"
  FOUND_SENSITIVE=1
fi

if echo "$STAGED_CONTENT" | grep -qiE 'sk-[a-zA-Z0-9]{48}'; then
  echo "❌ OpenAI API Key 발견!"
  FOUND_SENSITIVE=1
fi

# AWS 키 패턴
if echo "$STAGED_CONTENT" | grep -qE 'AKIA[0-9A-Z]{16}'; then
  echo "❌ AWS Access Key 발견!"
  FOUND_SENSITIVE=1
fi

if echo "$STAGED_CONTENT" | grep -qE 'aws_secret_access_key.*[A-Za-z0-9/+=]{40}'; then
  echo "❌ AWS Secret Key 발견!"
  FOUND_SENSITIVE=1
fi

# 데이터베이스 비밀번호 패턴 (실제 값이 있는 경우만)
if echo "$STAGED_CONTENT" | grep -qiE '(password|passwd|pwd)\s*[:=]\s*["\047][^"\047]{3,}["\047]'; then
  echo "❌ 데이터베이스 비밀번호 패턴 발견!"
  FOUND_SENSITIVE=1
fi

# JWT 토큰 (실제 긴 토큰만)
if echo "$STAGED_CONTENT" | grep -qE '(jwt|token)\s*[:=]\s*["\047]eyJ[a-zA-Z0-9_-]{100,}["\047]'; then
  echo "❌ JWT 토큰 발견!"
  FOUND_SENSITIVE=1
fi

# Redis 비밀번호
if echo "$STAGED_CONTENT" | grep -qiE 'redis.*password\s*[:=]\s*["\047][^"\047]{3,}["\047]'; then
  echo "❌ Redis 비밀번호 발견!"
  FOUND_SENSITIVE=1
fi

# DB 연결 문자열 (실제 IP나 도메인 포함)
if echo "$STAGED_CONTENT" | grep -qE 'jdbc:(mysql|mariadb|postgresql)://[0-9a-zA-Z.-]+:[0-9]+'; then
  # 이건 괜찮을 수도 있지만 경고
  if echo "$STAGED_CONTENT" | grep -qE 'user=|password='; then
    echo "❌ DB 연결 문자열 (계정 정보 포함) 발견!"
    FOUND_SENSITIVE=1
  fi
fi

# Private key
if echo "$STAGED_CONTENT" | grep -qE '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'; then
  echo "❌ Private Key 발견!"
  FOUND_SENSITIVE=1
fi

# 결과 출력
if [ $FOUND_SENSITIVE -eq 1 ]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ 민감정보 검증 실패!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Git commit이 차단되었습니다."
  echo "민감정보를 제거하고 다시 시도해주세요."
  echo ""
  echo "도움말:"
  echo "  - .gitignore에 파일을 추가하세요"
  echo "  - 민감정보는 환경변수나 secrets 파일로 관리하세요"
  echo "  - docker-compose.yml은 study/ 폴더에 보관하세요"
  echo ""
  exit 1
fi

echo "✅ 민감정보 검증 통과!"
exit 0
