# 몽골 2026

카카오톡 채팅을 기준으로 정리한 8/23–8/28 몽골 일정 페이지입니다.
개인정보(이메일, 생년월일, 여권 이름, 계좌)는 넣지 않았습니다.

## 로컬에서 보기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## GitHub Pages 배포

1. GitHub에 이 폴더를 리포지토리로 올립니다. 리포지토리 이름은 `mongolia-trip`을 권장합니다.
2. GitHub → **Settings** → **Pages** → Source를 **GitHub Actions**로 둡니다.
3. `main`에 푸시하면 `.github/workflows/deploy.yml`이 정적 파일을 빌드해 배포합니다.

프로젝트 사이트(`https://<계정>.github.io/mongolia-trip/`)와
사용자 사이트(`https://<계정>.github.io/`) 모두 동작합니다.
후자는 리포지토리 이름이 `<계정>.github.io`일 때 경로 접두사 없이 배포됩니다.

## 스택

- Next.js (정적보내기 `output: "export"`)
- React, TypeScript, Tailwind CSS
