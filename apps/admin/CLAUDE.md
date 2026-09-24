운영진 전용 어드민(PC 1280px 기준). 규칙은 사용자 앱과 같다: @../web/docs/frontend-conventions.md

- 시안: 저장소 루트의 design_handoff_admin/(README.md, SCREENS.md, design/admin/*.jsx).
- 서버 데이터는 전부 `src/shared/server/admin-data`를 거친다. 지금은 메모리 목업이고, 실제 API로 바꿀 곳은 이 폴더 하나다.
- 확정 조치는 `AUDIT_ACTIONS` 하나에 대응하고 활동 기록을 한 건 남긴다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
