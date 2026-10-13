# SeolMyeongTang AGENTS

## Required Reading

- When working inside the SMT spec workspace, read `../constitution.md` and
  `../AGENTS.md` before applying these local rules. Resolve paths relative to this file.

## Scope

- This repository is a `pages/`-based Next.js client.

## Feature Structure

| Location | Responsibility |
| --- | --- |
| `pages/` | Routing, metadata, static data fetching, and dynamic imports |
| `components/<Feature>/` | Feature UI, feature state, and local view helpers |
| `components/Common/` | Shared layout UI |
| `api/<feature>.ts` | Feature HTTP calls through the shared `api/index.ts` transport |
| `types/<feature>.ts` | Shared request, response, and feature types |
| `utils/` | Helpers reused across features |
| `public/` | Static assets |
| `styles/` | Shared styles |

- Reuse layout UI from `components/Common` and existing feature components before
  adding repeated markup or page-specific overrides.
- Treat `components/Vnc/core` and `components/Vnc/vendor` as vendored code; do not edit them unless the task explicitly targets the VNC implementation.

## Naming And Dependencies

- Use PascalCase for component files and type names; keep `index.tsx` for existing
  feature entry points. Match feature names across `api/` and `types/`.
- Name request and response types by operation, entity, and role, such as
  `CreateSessionRequest` and `CreateSessionResponse`.
- Preserve wire field names and casing; naming cleanup must not change JSON contracts.
- Update `types/` first when request or response shapes change; pages and components
  must consume those types instead of redefining API shapes locally.
- Give shared API helpers explicit input and return types. Use `unknown` for
  untrusted data until validated; do not hide contract mismatches with `any`
  or unchecked type assertions.
- UI code must call `api/` clients rather than axios directly. Keep transport setup
  in `api/index.ts`, not in feature components.
- Shared types and utilities must not import pages or feature UI components.

## Resource Lifecycle

- Initialize sockets, terminal widgets, timers, and listeners in effects or event
  handlers, not during rendering.
- Pair setup with cleanup: remove listeners, cancel timers, and disconnect or
  dispose owned resources when their owner changes or unmounts.
- Register interceptors once per HTTP client instance, not once per request.
  Read the current authentication state inside the interceptor.

## Working Rules

- Preserve public route behavior unless the task or spec explicitly changes it.
- Keep browser-only widgets client-only; do not read browser-only globals from
  code that can run during server rendering.
- Preserve static-export and SVG-import compatibility when changing page data
  fetching or build configuration.
- Keep business rules in server/spec layers, not hidden inside client-only branches.
- Core client logic includes input validation, request/response mapping, persisted
  identity/state, and browser-only resource initialization.
- Core user flows include reading or changing external resources and establishing,
  recovering, or closing external connections.
