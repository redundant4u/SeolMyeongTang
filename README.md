# SeolMyeongTang

<img src="https://redundant4u.com/logo.jpeg" width="200" alt="seolmyeongtang" />

개인 블로그 프로젝트 [설명탕](https://redundant4u.com/)

## 기능 요약

-   [대문](https://redundant4u.com/)
    -   간단한 블로그 설명
    -   CRDT 기술을 활용한 캔버스
-   글
    -   여러 컴퓨터 주제로 한 글 모음
-   [자기소개](https://redundant4u.com/me)
    -   웹 터미널을 이용한 자기소개

## 주요 기술

-   프론트엔드 (NextJS)
    -   이미지 확대: [medium-zoom](https://github.com/francoischalifour/medium-zoom)
    -   소켓 통신: [socket.io-client](https://github.com/socketio/socket.io-client)
    -   웹 터미널: [xterm](https://github.com/xtermjs/xterm.js)
    -   마크다운 컴포넌트: [react-markdown](https://github.com/remarkjs/react-markdown)
    -   CSS 프레임워크: [tailwind](https://github.com/tailwindlabs/tailwindcss)
-   백엔드
    -   [글 조회](https://github.com/redundant4u/SeolMyeongTang-Server/tree/main/lambda)
    -   [소켓 통신](https://github.com/redundant4u/SeolMyeongTang-Server/tree/main/socket)
-   인프라
    -   Docker
    -   GitHub Actions
    -   NGINX
    -   Shell script

## 테스트

- Node 24와 `package.json`에 지정된 pnpm으로 `pnpm install --frozen-lockfile`을 실행합니다.
- `pnpm test:coverage`: API, 화면, 페이지, CRDT 테스트를 실행합니다. 전체 문장·행·함수·분기
  커버리지가 각각 90% 미만이거나 소스 파일이 보고서에서 빠지면 실패합니다.
- 직접 관리하는 애플리케이션 코드를 모두 측정하며, 외부에서 가져온 VNC `core/`와 `vendor/`는
  제외합니다. 자체 VNC 연결 컴포넌트는 포함합니다. 보고서는 `coverage/index.html`에 생성됩니다.
- `pnpm typecheck`: 테스트를 포함한 TypeScript 타입을 확인합니다.
- `pnpm exec playwright install chromium` 후 `pnpm test:e2e`: 실제 Next 페이지 이동과 세션
  생성·삭제·실패 흐름을 Chromium에서 검증합니다. 4317·4318 포트를 사용하는 테스트 서버가
  자동으로 시작하고 종료되므로 실제 API나 배포용 환경변수는 필요하지 않습니다.
- 외부 HTTP, 소켓, 터미널, VNC 라이브러리는 테스트 경계에서 대체합니다. 실제 Kubernetes,
  DynamoDB, 원격 터미널과 VNC 서버의 연결 호환성은 별도 통합 환경에서 확인해야 합니다.

검증 중 확인한 기존 결함 두 가지는 `it.fails`로 명시했습니다. 정상 동작을 기대하는 검증이
현재 코드에서 실패한다는 뜻이며, 결함을 수정하면 일반 `it` 테스트로 바꿔야 합니다.

- 처음 발급받은 client ID가 화면 상태에 반영되지 않아 생성 직후 삭제가 실패합니다.
- 서로 다른 색상 팔레트를 병합하면 기존 픽셀 색상이 바뀔 수 있습니다.

이번 변경은 이 결함을 기록하고 재현하는 테스트까지만 포함합니다.

## 참고

-   이전 `.yarn` 파일로 git clone을 하면 release 브랜치 떄문에 크기가 커지므로 아래의 명령어를 이용
    ```
    git clone --depth 1 https://github.com/redundant4u/SeolMyeongTang.git
    ```
