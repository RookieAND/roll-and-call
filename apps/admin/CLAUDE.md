운영진 전용 어드민(PC 1280px 기준, 1024px 미만은 같은 라우트의 모바일 반응형. 명세는 사용자가 넘긴 `design_handoff_admin_mobile/`). 규칙은 사용자 앱과 같다: @../web/docs/frontend-conventions.md

- 시안: design_handoff_admin/(README.md, SCREENS.md, design/admin/*.jsx)은 저장소에 없다. 필요하면 사용자에게 받는다.
- 서버 데이터는 `src/shared/server/admin-data`(스냅숏·DB 쿼리 재노출)와 `src/entities/<도메인>`(목록 가공 규칙은 `index.ts`, 스냅숏을 읽는 조회는 `server.ts`)을 거친다. 쿼리는 `@roll-and-call/database/<도메인>`(rulebooks·certifications·moderation 등)에 있고 모두 `serverId`를 받는다(앱은 `getCurrentServer()`의 id를 넘긴다). 조회는 `loadSnapshot()`(요청마다 현재 서버의 표 전체를 읽는다), 조치는 트랜잭션 + 조건부 UPDATE로 충돌을 가린다.
- 확정 조치는 `AUDIT_ACTIONS` 하나에 대응하고 활동 기록을 한 건 남긴다.

## 서버 분리 (2026-10 핸드오프)

- 서버 화면은 `app/[server]/…`(주소 `/{slug}/…`), 서버 밖은 `/`(서버 선택)·`/login`·`/denied`. proxy가 slug를 헤더로 넘기고 `getCurrentServer()`가 그 서버를 돌려준다(`botConnected` 포함).
- 서버 안 링크: `<ServerLink path="/users/1" />`, 클라이언트 이동 `useServerPath()`, 서버 쪽 `serverPath({ slug, path })`. model 함수·상수는 slug 없는 경로를 돌려준다.
- 권한: 서버 액션 첫 줄에서 `requireStaff()`(운영진 이상) / `requireOwner()`(설정). 다른 서버면 `forbidden()`(403). 소유자는 디스코드 서버장, 플랫폼 관리자는 `ADMIN_OWNER_DISCORD_IDS`. `requireStaff()`가 돌려주는 staff를 그대로 `actor`로 넘기면 활동 기록에 플랫폼 관리자가 표시된다(`kind`). 시스템 조치는 `recordAudit({ actor: null })`.
- 뱃지: `Tag`(`@/shared/ui`) — 글자가 `STATUS_TONE`에 있으면 그 색이 우선. 뱃지에 아이콘을 넣지 않는다(`essentialIcon`만 예외).
- 확인 모달: `ResponsiveDialog`(`@/shared/ui`, 데스크톱 Dialog / 모바일 Sheet, 되돌릴 수 없으면 `Root alert`). `Header` 맨 앞에 `<ModalServerLabel />`(서버 아이콘 + 「{이름} 서버」, 모바일에선 숨김).
- 모바일 조각: `@/shared/ui`의 `ListRow`(path 없으면 눌리지 않는 줄)·`ListSortBar`·`InfiniteList`·`ListEndHint`·`StatusBadges`·`KeyValueList`·`SkeletonListRows`·`MobileActionBar`(폼·확정, `note`로 비활성 이유)·`MobileDetailBar`(상세: 조치 1개 + ⋯)·`MobileMoreSheet`·`MobileSection`·`UrlFilterChips`. 모바일 헤더는 각 화면의 `AdminHeader`가 맡는다(trail이 있으면 뒤로, 없으면 햄버거).
- 데스크톱/모바일 View는 따로 만든다(`*-mobile-view.tsx`, JSX 공유 없음). page·loading은 데이터를 한 번 읽고 `<div data-view="desktop" className="contents max-lg:hidden">`·`<div data-view="mobile" className="contents lg:hidden">`로 둘 다 렌더한다. `data-view`가 있어야 `globals.css`의 본문 최대 폭(1280px)이 안쪽 칸에 걸린다.
- 패널 제목은 heading3(`Panel`), 페이지 제목은 heading1(`AdminHeader`, 뒤로 가기는 「{label} ›」 글자 링크).
- 룰북·카테고리·퀴즈 문항·전자책 판매처·추가 요청 모두 서버별(server_id). 새 서버는 DB 트리거가 trpia의 룰북·카테고리·판매처를 복사한다(퀴즈 제외). 룰북 관리는 `/[server]/rules`. 무료 배포 = 그 서버 룰북의 `cert_required = false`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
