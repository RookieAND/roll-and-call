운영진 전용 어드민(PC 1280px 기준). 규칙은 사용자 앱과 같다: @../web/docs/frontend-conventions.md

- 시안: 저장소 루트의 design_handoff_admin/(README.md, SCREENS.md, design/admin/*.jsx).
- 서버 데이터는 전부 `src/shared/server/admin-data`를 거친다. 쿼리는 `@roll-and-call/database/<도메인>`(rulebooks·certifications·moderation 등)에 있고 모두 `serverId`를 받는다(앱은 `getCurrentServer()`의 id를 넘긴다). 조회는 `loadSnapshot()`(요청마다 현재 서버의 표 전체를 읽는다), 조치는 트랜잭션 + 조건부 UPDATE로 충돌을 가린다.
- 확정 조치는 `AUDIT_ACTIONS` 하나에 대응하고 활동 기록을 한 건 남긴다.

## 서버 분리 (2026-10 핸드오프)

- 서버 화면은 `app/[server]/…`(주소 `/{slug}/…`), 서버 밖은 `/`(서버 선택)·`/login`·`/denied`·`/platform/*`(룰북 카탈로그). proxy가 slug를 헤더로 넘기고 `getCurrentServer()`가 그 서버를 돌려준다(`botConnected` 포함).
- 서버 안 링크: `<ServerLink path="/users/1" />`, 클라이언트 이동 `useServerPath()`, 서버 쪽 `serverPath({ slug, path })`. model 함수·상수는 slug 없는 경로를 돌려준다.
- 권한: 서버 액션 첫 줄에서 `requireStaff()`(운영진 이상) / `requireOwner()`(설정) / `requirePlatformAdmin()`(카탈로그). 다른 서버면 `forbidden()`(403). 소유자는 디스코드 서버장, 플랫폼 관리자는 `ADMIN_OWNER_DISCORD_IDS`. `requireStaff()`가 돌려주는 staff를 그대로 `actor`로 넘기면 활동 기록에 플랫폼 관리자가 표시된다(`kind`). 시스템 조치는 `recordAudit({ actor: null })`.
- 뱃지: `Tag`(`@/shared/ui`) — 글자가 `STATUS_TONE`에 있으면 그 색이 우선. 뱃지에 아이콘을 넣지 않는다(`essentialIcon`만 예외).
- 확인 모달: `Dialog.Header`/`AlertDialog.Header` 맨 앞에 `<ModalServerLabel />`(서버 아이콘 + 「{이름} 서버」).
- 패널 제목은 heading3(`Panel`), 페이지 제목은 heading1(`AdminHeader`, 뒤로 가기는 「{label} ›」 글자 링크).
- 퀴즈 문항·전자책 판매처는 서버별(server_id). 룰북·카테고리만 전역.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
