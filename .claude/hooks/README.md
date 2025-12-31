# Claude Code Hooks - 민감정보 검증

이 디렉토리에는 Git commit/push 전에 자동으로 실행되는 민감정보 검증 스크립트가 포함되어 있습니다.

## 파일 구조

```
.claude/hooks/
├── README.md                      (이 파일)
├── validate-git-command.sh        (Git 명령 감지)
└── check-sensitive-info.sh        (민감정보 검증 로직)
```

## 동작 방식

1. Claude가 `git commit` 또는 `git push` 명령을 실행하려고 함
2. **PreToolUse 훅**이 `validate-git-command.sh`를 실행
3. `validate-git-command.sh`가 Git 명령인지 확인
4. Git 명령이면 `check-sensitive-info.sh` 실행
5. 민감정보가 발견되면 **커밋/푸시 차단** (exit 2)
6. 검증 통과하면 정상 진행

## 검증 항목

### 차단되는 파일명
- `docker-compose.yml`
- `.env.local`
- `secrets.json`, `credentials.json`
- `private-key.pem`, `id_rsa`

### 차단되는 내용 패턴
- Claude/OpenAI API 키
- AWS Access/Secret Key
- 데이터베이스 비밀번호
- JWT 토큰
- Private Key
- Redis 비밀번호

## 설정 위치

`.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-git-command.sh \"$TOOL_INPUT\"",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

## 수동 테스트

```bash
# 민감정보 검증 스크립트 직접 실행
cd /d/vision/emotion-flowerbed-front
bash .claude/hooks/check-sensitive-info.sh
```

## 주의사항

- 이 스크립트는 **자동으로 실행**됩니다
- 민감정보가 발견되면 커밋이 **자동 차단**됩니다
- Git Bash 환경에서 실행됩니다
- 실행 권한 필요 (`chmod +x`)

## 패턴 추가/수정

`check-sensitive-info.sh` 파일을 수정하여 검증 패턴을 추가할 수 있습니다.
