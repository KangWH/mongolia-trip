# 몽골 2026

카카오톡 채팅을 기준으로 정리한 8/23–8/28 몽골 일정 페이지입니다.
개인정보(이메일, 생년월일, 여권 이름, 계좌)는 넣지 않았습니다.

## 로컬에서 보기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## 하루 일정 지도

날짜별 화면에 Google 지도로 그날 거점을 찍고 경로를 그립니다.
[Google Cloud](https://console.cloud.google.com/google/maps-apis)에서 **Maps JavaScript API**를 켠 뒤, 브라우저용 API 키를 만듭니다. HTTP 리퍼러를 `http://localhost:3000/*`와 GitHub Pages 주소로 제한하는 것이 좋습니다.

로컬:

```bash
echo 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=키' > .env.local
```

배포는 GitHub **Settings → Secrets and variables → Actions**에 `GOOGLE_MAPS_API_KEY`를 넣으면 됩니다. 키가 없으면 지도 대신 Google 지도 앱/웹으로 여는 링크만 나갑니다.

울란바토르 에어비앤비는 주소가 없어 시내(수흐바타르 광장) 기준으로만 찍습니다.

## GitHub Pages 배포

`main`에 푸시하면 `gh-pages` 브랜치로 정적 파일이 올라갑니다.
첫 배포 뒤 **Settings → Pages → Branch**를 `gh-pages` / `/ (root)` 로 두면 됩니다.

## 스택

- Next.js (정적보내기 `output: "export"`)
- React, TypeScript, Tailwind CSS
