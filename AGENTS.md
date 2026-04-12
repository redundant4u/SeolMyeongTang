# SeolMyeongTang AGENTS

## Scope

- This repository is a `pages/`-based Next.js client.
- Active code lives in `pages/`, `components/`, `api/`, `types/`, `utils/`, `public/`, and `styles/`.
- Most interactivity is browser-only, so SSR safety matters on nearly every change.

## App Context

- `/` is the post list and navigation entrypoint.
- `/post/[id]` is a statically generated markdown post page.
- `/me` is a browser-only terminal intro page backed by WebSocket.
- `/session` is the VNC session management page.
- `/vnc` is a noVNC-based remote viewer page.
- `components/Home/Chat.tsx` exists but is currently not exposed in the live home UI.

## Structure Rules

- Keep page files focused on routing, metadata, static data fetching, and dynamic imports.
- Put screen UI in `components/<Feature>/` rather than growing logic directly in `pages/`.
- Keep shared layout UI in `components/Common`.
- Add or update HTTP clients in `api/*.ts`; do not call axios directly from UI components.
- Update `types/` first when a server response shape changes.
- Treat `components/Vnc/core` and `components/Vnc/vendor` as vendored code; do not edit them unless the task explicitly targets the VNC implementation.

## Current Behavior Constraints

- Posts are fetched at build time through `getStaticProps` and `getStaticPaths`.
- Post rendering depends on `react-markdown`, `remark-gfm`, and `rehype-raw`.
- Code blocks and images are customized through `components/Code` and `components/ImageZoom`.
- `/me`, `/session`, and `/vnc` rely on browser APIs such as sockets, local storage, screen size, or `window`.
- The session flow depends on `localStorage.clientId`; create the client id before assuming session APIs will work.
- `/vnc` must stay client-only and currently redirects back to `/session` on disconnect.
- `next.config.js` assumes static export output and SVG loading through SVGR.

## Environment and Integration Assumptions

- Default local dev runs on port `3001`.
- `NEXT_PUBLIC_DEFAULT_API_URL` is the general API base URL.
- `NEXT_PUBLIC_POST_API_URL` is used for post reads.
- `NEXT_PUBLIC_VNC_API_URL` is used to build VNC session links.
- `NEXT_PUBLIC_TERMINAL_SOCKET_URL` is used in production; development falls back to `http://localhost:3000/terminal`.
- The axios wrapper attaches `localStorage.accessToken` to the `Authorization` header on each request.

## Working Rules

- Preserve public route behavior unless the task or spec explicitly changes it.
- Do not read browser-only globals from code that can run during server rendering.
- Keep business rules in server/spec layers, not hidden inside client-only branches.
- If client-visible behavior or API assumptions change, update the relevant specs first.
