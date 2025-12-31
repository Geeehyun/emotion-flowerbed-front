#!/bin/bash

# Git 명령 검증 스크립트
# Claude가 git commit 또는 git push를 실행하기 전에 민감정보를 검증합니다.

set -e

# Claude가 전달하는 JSON 입력 (tool_input 포함)
# $1은 JSON 형식의 도구 입력
INPUT="$1"

# Git Bash 환경에서 jq가 없을 수 있으므로 간단한 파싱 사용
# Bash tool의 command 필드 추출
COMMAND=$(echo "$INPUT" | grep -oP '"command"\s*:\s*"\K[^"]+' || echo "")

if [ -z "$COMMAND" ]; then
  # command가 없으면 통과 (다른 Bash 명령)
  exit 0
fi

# git commit 또는 git push 명령인지 확인
if [[ $COMMAND =~ ^git[[:space:]]+(commit|push) ]]; then
  echo "🔒 Git commit/push 감지 - 민감정보 검증 실행 중..."

  # 민감정보 검증 스크립트 실행
  HOOKS_DIR="$(dirname "$0")"

  if ! bash "$HOOKS_DIR/check-sensitive-info.sh"; then
    echo "❌ 민감정보 검증 실패 - Git 명령 차단됨"
    exit 2  # exit 2 = 도구 실행 차단
  fi

  echo "✅ 민감정보 검증 통과 - Git 명령 진행"
fi

exit 0
