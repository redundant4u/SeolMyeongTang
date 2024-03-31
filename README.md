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

## 참고

-   이전 `.yarn` 파일로 git clone을 하면 release 브랜치 떄문에 크기가 커지므로 아래의 명령어를 이용
    ```
    git clone --depth 1 https://github.com/redundant4u/SeolMyeongTang.git
    ```
