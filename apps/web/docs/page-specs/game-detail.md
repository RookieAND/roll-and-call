# 구인 상세 (`/games/[id]`)

> 전역 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md) 참조.
> 기준: 커밋 전 작업 트리 포함 현재 코드(join-game 버튼 분리, `games.discord_thread_id` 추가).

## 1. 개요

- **라우트**: `/games/[id]`
- **파일 위치**
  - `src/app/games/[id]/page.tsx` — `params.id`를 받아 `GameDetailView`에 넘기기만 한다.
  - `src/app/games/[id]/loading.tsx` — 스켈레톤
  - `src/views/game-detail/ui/game-detail-view.tsx` — 서버 조회, notFound 처리
  - `src/views/game-detail/ui/game-detail.tsx` — 화면 조립, 파생값 계산
  - `src/views/game-detail/ui/game-detail-header.tsx`, `game-gm-menu.tsx`, `game-info-table.tsx`, `game-roster-preview.tsx`, `game-detail-actions.tsx`, `game-action-zone.tsx`
  - `src/views/game-detail/model/derive-action-view.ts` (+ `derive-action-view.test.ts`)
- **페이지 목적**: 구인글 하나의 정보(룰, GM, 인원, 마감, 세션 일정, 시놉시스, 참여자)를 보여 준다. 보는 사람의 자격에 따라 참여 신청, 대기 신청, 취소, 일정 조율 진입, 로그인을 제공한다. GM에게는 수정, 삭제, 참여자 관리 메뉴와 일정 조율 현황 진입을 준다.

## 2. 접근 조건

페이지 자체에는 인증 가드가 없다. 비로그인 사용자도 볼 수 있다. `src/proxy.ts`는 세션 쿠키 갱신만 하고 리다이렉트는 하지 않는다.

| 조건                                      | 결과                                                                                                        | 근거                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `getGameById(id)`가 `undefined` (없는 id) | `notFound()` → `src/app/not-found.tsx` "페이지를 찾을 수 없습니다" / "주소가 바뀌었거나 삭제된 페이지예요." | `src/views/game-detail/ui/game-detail-view.tsx:6`            |
| id가 uuid 형식이 아님                     | ❓ 확인 필요: `games.id`(uuid) 비교에서 Postgres 캐스트 오류가 나 `src/app/error.tsx`로 가는지              | `src/shared/server/games.ts:80-91`                           |
| 비로그인                                  | 모든 정보 표시. 액션 존은 로그인 유도(또는 확정/마감 안내)                                                  | `src/views/game-detail/ui/game-action-zone.tsx:92-101`       |
| 로그인, 무관한 사용자                     | 참여하기 / 대기 신청하기                                                                                    | `game-action-zone.tsx:126-128`                               |
| 로그인, 참여자(확정)                      | 일정 조율하기(coordinate) + 참여 취소 또는 취소 불가 안내                                                   | `game-action-zone.tsx:103-124`                               |
| 로그인, 대기자                            | 대기 안내 + 가능 시간 입력(coordinate) + 대기 취소                                                          | `game-action-zone.tsx:72-86`                                 |
| GM (`games.gm_id === user.id`)            | 헤더에 ⋯ 메뉴. 하단 바는 모드와 확정 여부에 따라 조율 현황 링크, 확정 안내, 또는 없음                       | `game-detail-header.tsx:23`, `game-detail-actions.tsx:22-24` |

GM 여부는 `isGameGm` (`src/entities/game/model/is-game-gm.ts:2-4`)으로 판단한다. 뷰어 id는 `getCurrentUser()` (`src/shared/server/supabase.ts:7-13`, `supabase.auth.getUser()`)에서 온다.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발                                        | 방식                                                                                             | 근거                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| 구인 목록 `/games` 카드                     | `Link href={/games/${game.id}}`                                                                  | `src/views/games/ui/game-list.tsx:41`                                                         |
| 홈 모집 미리보기                            | `Link`                                                                                           | `src/views/home/ui/landing-recruiting-preview.tsx:28`                                         |
| 홈 게임 리스트 아이템                       | `Link`                                                                                           | `src/views/home/ui/game-list-item.tsx:44`                                                     |
| 내 세션 목록(`/me`, `/me/sessions/*`) 카드  | `sessionHref`: 참여자이거나 dim 상태면 `/games/${id}`, 호스트이면서 dim이 아니면 `/participants` | `src/widgets/session-list/ui/session-list.tsx:7,14`                                           |
| 구인 등록 완료                              | `createGame` → `{ redirect: /games/${id} }`                                                      | `src/features/write-game/api/create-game.ts:46`                                               |
| 구인 수정 완료                              | `updateGame` → `{ redirect: /games/${id} }`                                                      | `src/features/write-game/api/update-game.ts:49`                                               |
| 다음 회차 생성 완료                         | `createSecondRound` → `{ redirect: /games/${newId} }` (새 회차 상세)                             | `src/features/create-second-round/api/create-second-round.ts:107`                             |
| 세션 확정 완료                              | `confirmSession` → `{ redirect: /games/${gameId} }`, 토스트 "세션이 확정되었습니다"              | `src/features/confirm-session/api/confirm-session.ts:26`, `ui/confirm-session-form.tsx:33-34` |
| 수정 페이지 권한 없음                       | `redirect(/games/${id})`                                                                         | `src/views/edit-game/ui/edit-game-view.tsx:11`                                                |
| 참여자 관리 권한 없음                       | `redirect(/games/${id})`                                                                         | `src/views/manage-participants/ui/manage-participants-view.tsx:13`                            |
| 하위 페이지 AppBar 뒤로                     | `back={/games/${id}}` (수정, 일정 조율, 참여자 관리)                                             | `edit-game-view.tsx:15`, `game-schedule-view.tsx:20`, `participant-manager.tsx:43`            |
| Discord 알림 embed 링크 / "▶ 참여하러 가기" | `gameUrl(id)`, `NEXT_PUBLIC_SITE_URL` 또는 `VERCEL_URL`이 있을 때만                              | `src/shared/server/discord-notify.ts:15-20,38`                                                |

### 이탈

| 요소                                                                        | 목적지                                     | 근거                                         |
| --------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------- |
| AppBar 뒤로                                                                 | `/games` (진입 경로와 관계없이 고정)       | `game-detail.tsx:25`                         |
| GM 메뉴 "구인 수정"                                                         | `/games/${id}/edit`                        | `game-gm-menu.tsx:31`                        |
| GM 메뉴 "참여자 관리"                                                       | `/games/${id}/participants`                | `game-gm-menu.tsx:34`                        |
| GM 메뉴 "구인 삭제" 확인                                                    | 성공 시 `router.push("/games")`            | `use-delete-game.ts:22`, `delete-game.ts:16` |
| "일정 조율 현황" / "일정 조율 보기" / "가능 시간 입력" (`GameScheduleLink`) | `/games/${id}/schedule`                    | `game-schedule-link.tsx:17`                  |
| "일정 조율하기" (참여자)                                                    | `/games/${id}/schedule`                    | `game-action-zone.tsx:110`                   |
| "Discord로 로그인"                                                          | Supabase OAuth → `${origin}/auth/callback` | `src/features/auth/api/sign-in.ts:4-7`       |
| BottomNav                                                                   | [_shared-layout.md](./_shared-layout.md)   | —                                            |

로그인 후 복귀: `signInWithDiscord`는 `next`를 넘기지 않는다(`sign-in.ts:6`). 콜백 기본값이 `next ?? "/"`라서(`src/app/auth/callback/route.ts:6`) 로그인하면 상세가 아니라 홈 `/`로 간다. 실패 시 `/?auth_error=1` (`route.ts:24`).

## 4. 데이터

### params / searchParams

| 이름                  | 사용                                                  |
| --------------------- | ----------------------------------------------------- |
| `params.id` (Promise) | `await params` → `GameDetailView id` (`page.tsx:2-4`) |
| searchParams          | 사용하지 않음                                         |

### 조회

- `getGameById(id)` (`src/shared/server/games.ts:80-91`): `games` 전체 컬럼, `gm { username, avatarUrl }`, `participants { userId, joinedAt, status, user { username, avatarUrl } }`
- `getCurrentUser()` (`src/shared/server/supabase.ts:7`): 게임 조회 **후 순차로** 호출 (`game-detail-view.tsx:5-8`)

### 필드 표

| 테이블.컬럼                                                                | 화면 사용                                                                                       | 위치                                                   |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `games.id`                                                                 | 링크, 액션 인자                                                                                 | 전반                                                   |
| `games.title`                                                              | h1 제목                                                                                         | `game-detail-header.tsx:18-20`                         |
| `games.thumbnail_url`                                                      | 상단 썸네일(없으면 그라데이션)                                                                  | `game-detail.tsx:28-32`                                |
| `games.rule`                                                               | 정보 표 "룰"                                                                                    | `game-info-table.tsx:11`                               |
| `games.gm_id`                                                              | GM 판정                                                                                         | `game-detail.tsx:11`                                   |
| `profiles.username`, `profiles.avatar_url` (gm)                            | 정보 표 "GM"                                                                                    | `game-info-table.tsx:13-22`                            |
| `games.max_players`                                                        | "인원", "참여자 N/M", 상태 계산                                                                 | `game-info-table.tsx:24`, `game-roster-preview.tsx:20` |
| `games.play_time`                                                          | "플레이타임" (값 있을 때만)                                                                     | `game-info-table.tsx:25`                               |
| `games.end_date`                                                           | "모집 마감일", 상태(마감), 대기 안내 마감                                                       | `game-info-table.tsx:26`, `waitlist-notice.tsx:25`     |
| `games.schedule_mode`                                                      | `canCoordinate` → 조율 링크 노출, "세션 일정" 포맷                                              | `game-detail-actions.tsx:19`, `format.ts:56-72`        |
| `games.range_start`, `games.range_end`                                     | "세션 일정" (`M월 D일 ~ M월 D일 조율`)                                                          | `format.ts:68-70`                                      |
| `games.confirmed_at`                                                       | "세션 일정", 확정 안내, 액션 분기 최우선                                                        | `game-action-zone.tsx:41,57-70`                        |
| `games.synopsis`                                                           | "시놉시스" 섹션 (값 있을 때만)                                                                  | `game-detail.tsx:48-55`                                |
| `games.images` (`drizzle/0009_game_images_waitlist.sql`, text[] 기본 `{}`) | "진행 이미지" 갤러리 (1장 이상일 때만, 배열 순서대로)                                           | `game-detail.tsx:57`                                   |
| `games.waitlist_enabled` (0009, boolean 기본 true)                         | 모집 상태 `full` 판정 → 배지 "모집 마감", 액션 존 마감 처리. 화면에 설정값 자체는 표시하지 않음 | `game-detail.tsx:22`, `game-action-zone.tsx:46, 51`    |
| `participants.user_id`                                                     | 뷰어 자격 판정                                                                                  | `game-detail.tsx:15`                                   |
| `participants.status`                                                      | 확정/대기 분리, 정원 계산                                                                       | `split-roster.ts:26-32`                                |
| `participants.joined_at`                                                   | 신청 순 정렬 → 대기 순번                                                                        | `split-roster.ts:19-21`                                |
| `profiles.username/avatar_url` (participant)                               | 아바타 그룹                                                                                     | `game-roster-preview.tsx:30`                           |
| `games.round`, `games.parent_game_id`                                      | 이 페이지에서 표시하지 않음 (회차 배지 없음)                                                    | —                                                      |
| `games.notified_at`                                                        | 사용하지 않음                                                                                   | —                                                      |
| `games.discord_thread_id` (신규, `drizzle/0008_discord_thread_id.sql`)     | 화면 표시 없음. 참여/취소 알림의 스레드 대상                                                    | `schema.ts:54`, `discord-notify.ts:87,122`             |

### 파생값

| 값                      | 계산                                                                                                                                                                                                                           | 위치                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `confirmed`, `waiting`  | `splitRoster(game.participants)`: joinedAt 오름차순, `applicationRank`, `waitlistRank` 부여                                                                                                                                    | `game-detail.tsx:12`                                  |
| `me`                    | 뷰어가 참여 목록에 있으면 해당 멤버                                                                                                                                                                                            | `game-detail.tsx:15`                                  |
| `status` (`GameStatus`) | `deriveGameStatus({ maxPlayers, endDate, participantCount: confirmed.length, waitlistEnabled })`: 기한 경과 → `closed`, 확정 인원 < 정원 → `recruiting`, 정원 충족이면 `waitlist_enabled`가 true → `confirmed`, false → `full` | `game-detail.tsx:18-23`, `derive-game-status.ts:7-23` |
| 상태 라벨               | `recruiting` "모집 중"(primary), `confirmed` "대기 모집"(success), `full` "모집 마감"(gray), `closed` "모집 마감"(gray)                                                                                                        | `src/entities/game/model/status.ts:13-26`             |
| `canSchedule`           | `scheduleMode === "coordinate"` (마감 여부는 보지 않음). 확정된 세션(A1)에서는 쓰지 않는다                                                                                                                                     | `game-detail-actions.tsx`                             |

### 캐시

- `export const dynamic`/`revalidate` 선언 없음(`src/app/games/[id]/page.tsx`). `cookies()`(Supabase)를 쓰므로 요청 시점 렌더링이다. ❓ 확인 필요: Next 16.3 빌드에서 실제로 dynamic으로 분류되는지.
- 이 경로를 무효화하는 `revalidatePath(/games/${id})` 호출: `joinGame` (`join-game.ts:71`), `leaveGame` (`leave-game.ts:39`), `createSecondRound` (원본 게임, `create-second-round.ts:105`), adjust-roster의 `revalidate(gameId)` (`/games/${id}/participants`, `/games/${id}`, `/games`; `src/features/adjust-roster/api/adjust-roster.ts:10-14`).
- `updateGame`, `confirmSession`은 redirect만 반환한다. `updateGame`은 `revalidatePath`를 호출하지 않는다(`update-game.ts:9-50`).
- `deleteGame`은 `revalidatePath`를 호출하지 않는다 (`delete-game.ts:6-17`).

## 5. UI 구성 요소

```
AppBar
Container(size="md", px-0) > VStack gap4
├─ GameThumbnail
├─ VStack px-4 gap4
│  ├─ GameDetailHeader (h1 제목 · GameStatusBadge · [GM] GameGmMenu)
│  ├─ GameInfoTable
│  ├─ 시놉시스 (조건부)
│  ├─ GameImageGallery (images 1장 이상일 때)
│  └─ GameRosterPreview
└─ GameDetailActions (sticky 하단 바)
   ├─ [GM·coordinate·미확정] GameScheduleLink "일정 조율 현황"
   └─ [그 외] GameActionZone (6장 표 참조)
```

- **AppBar** — `src/views/game-detail/ui/game-detail.tsx:25` (`src/shared/ui/app-bar.tsx`)
  - 표시: 뒤로 아이콘(ChevronLeft), 제목 "구인 상세"
  - 인터랙션: 뒤로 → `/games`
- **GameThumbnail** — `game-detail.tsx:28-32` (`src/entities/game/ui/game-thumbnail.tsx`)
  - 표시: `thumbnail_url`이 없으면 primary 그라데이션 박스. 있으면 `next/image fill`로 그리고, 로드 전에는 Skeleton을 덮는다. 높이 `h-42`, 전체 폭, `sizes="(max-width: 896px) 100vw, 896px"`, `alt=""`
- **GameDetailHeader** — `game-detail-header.tsx:16-26`
  - **제목** — `:18-20` `<h1>` heading1, `games.title`
  - **GameStatusBadge** — `:22` 라벨/색은 4장 파생값 참조
  - **GameGmMenu** (GM만) — `game-gm-menu.tsx:12-58`
    - 트리거: IconButton(⋯, `aria-label="구인 관리 메뉴"`) → Sheet 열림
    - Sheet 제목 "구인 관리"
    - "구인 수정" → `/games/${id}/edit`, 시트 닫힘
    - "참여자 관리" → `/games/${id}/participants`, 시트 닫힘
    - "구인 삭제"(빨강) → ConfirmDialog: 제목 "구인 삭제", 설명 "이 구인을 삭제할까요? 되돌릴 수 없습니다.", 확인 "삭제"(danger, pending 표시) → `deleteGame` (8장)
- **GameInfoTable** — `game-info-table.tsx:9-47`. 둥근 테두리 표, 행마다 좌측 키(82px) / 우측 값
  - "룰" — `games.rule`
  - "GM" — 아바타 + 이름(`showRole=false`, 이름이 없으면 "?")
  - "인원" — `${확정 인원}  / ${max_players}명` (슬래시 앞에 공백 두 칸, `:24`)
  - "플레이타임" — `play_time`이 있을 때만
  - "모집 마감일" — `formatDateTime(end_date)` → 예: "8월 16일 (일) 20:00" (KST, 24h)
  - "세션 일정" — `formatGameSchedule`: `confirmed_at`이 있으면 일시, coordinate이면서 기간이 있으면 "8월 16일 ~ 8월 20일 조율", 그 외 "미정"
- **시놉시스** — `game-detail.tsx:48-55`. `synopsis`가 있을 때만 제목 "시놉시스" + 본문(`whitespace-pre-wrap`, muted)
- **GameImageGallery** — `src/views/game-detail/ui/game-image-gallery.tsx:9-56` (`"use client"`), `game-detail.tsx:57`에서 `images.length > 0`일 때만
  - 제목 "진행 이미지"(heading3, `render` 없음 → `<span>`) (`:16`)
  - 가로 스크롤 줄(`-mx-4 flex gap-2 overflow-x-auto px-4 pb-1`, `:17-30`). 타일은 올린 순서대로 160×112px(`h-28 w-40`), 둥근 테두리, `object-cover`, `loading="lazy"`, `alt=""`. 타일 자체가 `<button aria-label="진행 이미지 {n} 크게 보기">`이고 포커스 링이 있다. 손코딩 버튼은 `ponytail:` 주석으로 예외 표시(`:19`)
  - 타일을 누르면 라이트박스(Base UI `Dialog`, `:32-53`): 화면 전체 `bg-black/80` 배경, 이미지 `max-h-full max-w-full object-contain`(`alt="진행 이미지 {n}"`), sr-only 제목 "진행 이미지 {n}", 우측 상단 IconButton `aria-label="닫기"`(X). 이전/다음 이동 버튼은 없다
  - ❓ 확인 필요: 백드롭 클릭과 Esc로 닫히는지(Base UI `Dialog` 기본 동작, `onOpenChange`만 연결됨)
- **GameRosterPreview** — `game-roster-preview.tsx:17-39`
  - 제목 "참여자 {확정 수}/{정원}"
  - 확정자 0명: "아직 참여자가 없어요."
  - 그 외: `AvatarGroup`(max 5, size "stack"), 확정자만
  - 대기자가 있으면 "대기 {n}명"
  - 인터랙션 없음(주석: 명단 전체는 GM 참여자 관리 화면에서)
- **GameDetailActions** — `game-detail-actions.tsx:18-36`
  - 컨테이너: `sticky bottom-[58px] z-10 border-t bg-surface px-4 py-4` (BottomNav 높이 58px에 맞춘 값, `:26` 주석)
  - 표시할 내용이 없으면(GM·fixed·미확정) `null`, 바 자체가 없다 (`:24`)
  - **GameScheduleLink "일정 조율 현황"** — `:30`, tinted 버튼 + ChevronRight → `/games/${id}/schedule`
  - **GameActionZone** — `game-action-zone.tsx:31-129`. 분기는 6장 표 참조. 사용 요소:
    - **ConfirmedSessionNotice** — `confirmed-session-notice.tsx:5-16`: success 박스, "세션 확정" + `formatDateTime(confirmedAt)`
    - **WaitlistNotice** — `waitlist-notice.tsx:6-29`: "정원이 차서 대기로 접수됐습니다" / "앞 순번이 빠지면 자동으로 확정됩니다. 마감까지 순번이 오지 않아도 GM이 대기자를 모아 다음 회차를 열 수 있습니다." / "대기 {rank}/{waitingCount} · 마감 {formatDateTime(endDate)}"
    - **GameScheduleLink** — label "일정 조율 보기" 또는 "가능 시간 입력", `h-12 w-full text-sm`
    - **"일정 조율하기" 링크 버튼** — `:109-113`, primary lg `Button asChild` + `Link` (GameScheduleLink와 다른 컴포넌트)
    - **LeaveGameButton** — `leave-game-button.tsx:9-41`: outline lg, 라벨 "대기 취소"(`waiting`) 또는 "참여 취소", 요청 중 `loading`
    - **JoinGameButton** — `join-game-button.tsx:9-34`: primary lg, 라벨 "대기 신청하기"(`isFull`) 또는 "참여하기", 요청 중 `loading`
    - **LoginButton** — `login-button.tsx:6-13`: discord variant, "Discord로 로그인"
    - **StatusNotice** (muted) — "모집이 마감되었습니다" 또는 "참여가 확정되었습니다 · 모집이 마감되어 취소는 GM에게 문의하세요"

GM 뷰에 `RoundSheet`(create-second-round), `ConfirmSessionForm`(confirm-session)은 **렌더되지 않는다**. 각각 참여자 관리(`next-round-banner.tsx`)와 일정 조율(`game-schedule-view.tsx`)에서 쓴다.

## 6. 상태별 화면

### 로딩

`src/app/games/[id]/loading.tsx:3-34`: AppBar("구인 상세", 뒤로 `/games`), 168px 썸네일 스켈레톤, 제목+배지 스켈레톤, 키/값 4줄, 시놉시스 3줄, 50px 버튼 스켈레톤. 버튼 스켈레톤은 sticky가 아니고 본문 흐름 안에 있다.

버튼 단위 로딩: `JoinGameButton` / `LeaveGameButton` / ConfirmDialog 확인 버튼이 `useTransition`의 pending 동안 `loading`(=disabled)이 된다.

### 빈 상태

- 참여자 0명: "아직 참여자가 없어요." (`game-roster-preview.tsx:22-25`)
- 시놉시스 없음: 섹션 생략. 플레이타임 없음: 행 생략. 썸네일 없음: 그라데이션.
- 세션 일정이 없는 경우: "미정"

### 에러

- 게임 없음: `notFound()` → 전역 not-found (2장)
- 렌더 예외: `src/app/error.tsx` "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도". "다시 시도"는 Next 16.3이 넘기는 `retry` prop을 호출한다(`node_modules/next/dist/client/components/error-boundary.d.ts:6`).
- 액션 실패: `toast.error(서버 메시지)` (8장). 인라인 에러 표시는 없다(삭제된 `JoinButton`에는 있었다).

### 도메인 상태와 권한별 차이: 하단 액션 바 전체 분기

입력: `isGm`, `confirmed_at`, 뷰어 참여 상태(`me.status`), `status`(recruiting / confirmed=정원 충족·대기 신청 켬 / full=정원 충족·대기 신청 끔 / closed=기한 경과), 로그인 여부, `schedule_mode`.

1단계 `GameDetailActions` (`game-detail-actions.tsx:19-33`):

| #   | GM  | confirmed_at | schedule_mode | 결과                              |
| --- | --- | ------------ | ------------- | --------------------------------- |
| G1  | ✔   | 없음         | coordinate    | GameScheduleLink "일정 조율 현황" |
| G2  | ✔   | 없음         | fixed         | 하단 바 없음(`null`)              |
| G3  | ✔   | 있음         | any           | GameActionZone → 아래 A1          |
| —   | ✘   | any          | any           | GameActionZone                    |

2단계 `deriveActionView` 우선순위: 확정 > 대기 > 참여중 > 마감 > 비로그인 > 참여가능 (`derive-action-view.ts:25-30`). 각 행의 결과 (`game-action-zone.tsx`):

| #   | actionView  | 조건                                         | status                                 | schedule_mode | 표시                                                                                                                           | 근거                                  |
| --- | ----------- | -------------------------------------------- | -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| A1  | `confirmed` | 세션 잠김 (뷰어 자격 무관, 비로그인·GM 포함) | any                                    | any           | ConfirmedSessionNotice만. 확정 후에는 [일정 조율] 버튼을 숨긴다(2026-09-16). GM은 ⋯ 메뉴 "확정 시간 변경"으로 조율 화면에 간다 | `confirmed-actions.tsx`               |
| A2  | `waiting`   | 뷰어 = 대기자                                | any (마감 포함)                        | coordinate    | WaitlistNotice + "가능 시간 입력" + "대기 취소"                                                                                | `:72-86`                              |
| A2' | `waiting`   | 〃                                           | any                                    | fixed         | WaitlistNotice + "대기 취소"                                                                                                   | 〃                                    |
| A3  | `joined`    | 뷰어 = 확정 참여자                           | recruiting                             | coordinate    | "일정 조율하기"(primary) + "참여 취소"(outline)                                                                                | `:103-116`                            |
| A3' | `joined`    | 〃                                           | recruiting                             | fixed         | "참여 취소"만                                                                                                                  | 〃                                    |
| A4  | `joined`    | 〃                                           | confirmed(정원 충족), full 또는 closed | coordinate    | "일정 조율하기" + 안내 "참여가 확정되었습니다 · 모집이 마감되어 취소는 GM에게 문의하세요"                                      | `:51-59, 107-128`                     |
| A4' | `joined`    | 〃                                           | confirmed, full 또는 closed            | fixed         | 위 안내만                                                                                                                      | 〃                                    |
| A5  | `closed`    | 미참여(로그인/비로그인 무관)                 | closed 또는 full                       | any           | StatusNotice "모집이 마감되었습니다". 비로그인에게도 로그인 버튼이 없다                                                        | `:46, 92-94`                          |
| A6  | `anon`      | 비로그인                                     | recruiting                             | any           | "참여하려면 로그인이 필요합니다." + "Discord로 로그인"                                                                         | `:51-53,92-101`                       |
| A6' | `anon`      | 비로그인                                     | confirmed(정원 충족, 대기 신청 켬)     | any           | "정원이 찼지만 대기 신청은 가능합니다. 로그인 후 신청하세요." + "Discord로 로그인"                                             | 〃                                    |
| A7  | `joinable`  | 로그인, 미참여, GM 아님                      | recruiting                             | any           | "참여하기"                                                                                                                     | `:126-128`, `join-game-button.tsx:19` |
| A7' | `joinable`  | 〃                                           | confirmed(정원 충족, 대기 신청 켬)     | any           | "대기 신청하기"                                                                                                                | 〃                                    |

참고:

- **fixed 모드는 사실상 항상 A1'이다.** 구인 폼은 fixed 모드에서 `confirmedAt`을 필수로 요구하고(`src/features/write-game/model/game-form.ts:29-35`, "세션 일시를 입력하세요."), 등록과 수정 모두 그 값을 `games.confirmed_at`에 저장한다(`create-game.ts:33`, `update-game.ts:42`). 폼으로 만든 fixed 게임은 모든 뷰어(GM 포함)에게 ConfirmedSessionNotice만 보인다. 표의 G2, A2', A3', A4'와 fixed 조합의 A5~A7은 폼 밖에서 `confirmed_at`이 비워진 행에서만 도달한다. ❓ 확인 필요: 그런 행(시드, 이전 데이터)이 실제로 있는지.
- 헤더 상태 배지는 `status`만 따른다. `confirmed_at`이 있어도 배지는 "모집 중"/"대기 모집"/"모집 마감" 중 하나다(`game-detail-header.tsx:22`).
- GM이 `joinable`/`anon`에 도달하는 경로는 없다(GM이면 G1~G3에서 끝남).
- `full`(대기 신청 끔 + 확정 인원 ≥ 정원, `derive-game-status.ts:20-22`)은 액션 존에서 `closed`와 같이 마감으로 취급된다(`game-action-zone.tsx:46, 51`). 미참여자는 로그인 여부와 무관하게 A5, 확정 참여자는 A4, 대기자는 A2다. 대기 신청 끔 게임에도 대기 행이 있을 수 있다(설정을 끄기 전의 대기자, GM "대기로 이동", 다음 회차 정원 초과분). GM 하단 바(G1 "일정 조율 현황")와 GM 메뉴 "참여자 관리"는 `full`에서도 그대로다(`game-detail-actions.tsx`는 `status`를 보지 않음).
- `canSchedule`은 `canCoordinate`(모드만)라서, 마감(closed)됐지만 확정 전인 coordinate 게임에서도 참여자·대기자·GM에게 조율 링크가 보인다. 주석상 의도다(`derive-action-view.ts`). 확정된 뒤에는 A1로 가서 링크가 없다.

## 7. 폼과 유효성 검사

이 페이지에는 입력 폼이 없다. 클라이언트 검증도 없다. 서버 액션의 거부 조건은 다음과 같다.

| 액션         | 거부 조건 → 에러 문구(토스트)                                                                                                                                                                                                                                                                                                             | 근거                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `joinGame`   | 비로그인 "로그인이 필요합니다." / 게임 없음 "존재하지 않는 게임입니다." / GM "GM은 참여자로 참여할 수 없습니다." / 세션 잠김(`isSessionLocked`) "이미 일정이 확정된 게임입니다." / 기한 경과 "모집이 마감되었습니다." / `waitlist_enabled = false`이고 확정 인원 ≥ 정원 "정원이 가득 차 신청할 수 없습니다." / 중복 "이미 참여 중입니다." | `join-game.ts:18-68`  |
| `leaveGame`  | "로그인이 필요합니다." / "존재하지 않는 게임입니다." / "참여 중이 아닙니다." / 확정 세션 "확정된 게임은 취소할 수 없습니다. GM에게 문의하세요." / 확정자이면서 정원 충족 또는 기한 경과 "마감된 게임은 취소할 수 없습니다. GM에게 문의하세요." (대기자는 제한 없음)                                                                       | `leave-game.ts:10-31` |
| `deleteGame` | "로그인이 필요합니다." / GM이 아니거나 없는 게임 "삭제 권한이 없습니다."                                                                                                                                                                                                                                                                  | `delete-game.ts:8-14` |

## 8. 액션과 부수효과

### 참여하기 / 대기 신청하기 — `joinGame` (`src/features/join-game/api/join-game.ts`)

- 트랜잭션에서 `games` 행을 `FOR UPDATE`로 잠근다(`:28-29`). 확정 인원 < 정원이면 `confirmed`, 아니면 `waiting`으로 insert한다(`:41-52`, `onConflictDoNothing`).
- Discord (트랜잭션 후, `await`, 전부 봇 REST):
  - 항상: `notifyGameJoined` — 모집 공지 **스레드에만** 보낸다(`game.discordThreadId`가 없으면 건너뜀)
    - embed "🙋 {title}" "**{신청자}**님이 참여했어요." (초록) / "⏳ {title}" "**{신청자}**님이 대기열에 등록했어요." (노랑), 상태, 현재 인원 `{확정}/{정원}`, footer "GM {name}"
    - 대기열 등록일 때만 필드 "대기 인원 {n}명"을 더한다. n은 방금 등록한 사람을 포함한 대기자 수(`announce-new-application.ts`)
  - 이번 신청으로 확정 정원이 **막 찼을 때** 추가로: `notifyRecruitmentComplete`
    - 채널: `DISCORD_CLOSED_CHANNEL_ID`, 스레드 아님
    - content 없음. **멘션하지 않는다**(2026-09-15)
    - embed: "🎉 {title} — 구인 완료!", 사용 룰, 인원 `{max}/{max}`, 시간(`formatGameSchedule`), "🙋 참여자"(확정자 이름을 신청 순으로 쉼표로 이음, 1024자에서 자름), footer "GM {name}", 분홍색
  - 마지막으로 `refreshRecruitPost` — 모집 공지 메시지의 인원을 PATCH로 갱신
- `revalidatePath`: `/games/${id}`, `/games/${id}/participants`, `/games` (`:71-73`)
- 반환 `{ waiting }` → 토스트: 성공 "대기로 접수했습니다"(waiting) / "참여했습니다", 실패 `toast.error(error)` (`join-game-button.tsx:23-25`). 버튼 라벨은 렌더 시점 `isFull` 기준이지만 토스트는 서버 결과를 따른다.
- redirect 없음

### 참여 취소 / 대기 취소 — `leaveGame` (`src/features/join-game/api/leave-game.ts`)

- 트랜잭션 없이 `participants` 행을 삭제한다(`:34-36`). 대기열 승격(`promoteWaitlistHead`)은 호출하지 않는다. 그 함수는 `adjust-roster.ts:136`에만 있다. 확정자 자가 취소는 정원 충족 시 막히므로(`:26-31`) 대기자가 있는 상태에서 확정자가 빠지는 경로는 이 액션에 없다.
- Discord: `notifyGameLeft(gameId, userId, false)` (`:37`; `discord-notify.ts:92-123`). 삭제 후 재조회해 확정 인원을 계산한다. content 없음. embed "🚪 {title}", "**{name}**님이 참여를 취소했어요.", 현재 인원 `{확정}/{정원}`, footer "GM {name}", 회색. `discordThreadId` 스레드 또는 채널 본문으로 간다.
- `revalidatePath`: `/games/${id}`, `/games/${id}/participants`, `/games` (`:39-41`)
- 토스트: 성공 "대기를 취소했습니다" / "참여를 취소했습니다", 실패 `toast.error` (`leave-game-button.tsx:20-27`)
- redirect 없음

### 구인 삭제 — `deleteGame` (`src/features/delete-game/api/delete-game.ts`) via `useDeleteGame`

- `games` 삭제(`gm_id` 조건). participants/availabilities는 FK `onDelete: cascade`로 함께 삭제된다(`schema.ts`).
- 반환 `{ redirect: "/games" }` → 다이얼로그/시트 닫힘(`onSettled`) → 성공 토스트 "삭제되었습니다" → `router.push("/games")` (`use-delete-game.ts:15-22`). 실패 시 `toast.error`.
- `revalidatePath` 없음, Discord 알림 없음. 이미 열린 스레드도 정리하지 않는다.

### 로그인 — `signInWithDiscord` (`src/features/auth/api/sign-in.ts`)

- 클라이언트 Supabase `signInWithOAuth({ provider: "discord", redirectTo: origin + "/auth/callback" })`. 토스트 없음.

### 공통: Discord 전송 규칙 (`packages/discord`, `@trpg/discord`)

- webhook은 쓰지 않는다. 모든 메시지는 봇 토큰(`DISCORD_BOT_TOKEN`)으로 채널 id·스레드 id에 REST로 보낸다(`api/discord-bot-api.ts`). 채널 id가 없으면 `console.warn` 후 건너뛴다. 타임아웃 8초, 실패는 로그만 남기고 삼킨다(`message/send-discord-message.ts`).
- 요청 본문의 `@everyone`/`@here` 문자열은 지우고, `allowed_mentions.parse`는 비워 역할·전체 멘션이 울리지 않는다.
- 스레드는 구인 등록 시 `notifyGameCreated` → `startDiscordThread`로 만든다. 그 id를 `games.discord_thread_id`에 저장한다(`create-game.ts`). 이 페이지는 스레드를 만들지 않는다.
- 알림은 `revalidatePath`와 서버 액션 반환보다 먼저 `await`된다. 버튼 pending 시간에 포함된다.

## 9. 반응형과 접근성 현황

**반응형 (구현된 것)**

- `Container size="md" className="px-0"`, 본문 좌우 `px-4` (`game-detail.tsx:26,34`)
- 썸네일 전체 폭, `sizes="(max-width: 896px) 100vw, 896px"` (`:30`)
- 하단 액션 바 `sticky bottom-[58px]`로 BottomNav 위에 고정 (`game-detail-actions.tsx:28`)
- 헤더: 제목과 배지를 `justify-between`, 배지 영역 `shrink-0` (`game-detail-header.tsx:17-21`)
- 정보 표 키 열 고정 폭 82px (`game-info-table.tsx:37`)
- breakpoint별 분기(`sm:`/`md:` 등)는 이 페이지 파일에 없다.

**접근성 (구현된 것)**

- 제목 `<h1>` (`game-detail-header.tsx:18`). "시놉시스"·"참여자" 소제목은 `Text typography="heading3"`인데 `render`를 지정하지 않아 `<span>`으로 렌더된다(`packages/ui/src/text.tsx:42`, `defaultTagName: "span"`). 제목 태그는 h1 하나뿐이다.
- AppBar 뒤로 `aria-label="뒤로"` (`app-bar.tsx:31`), GM 메뉴 `aria-label="구인 관리 메뉴"` (`game-gm-menu.tsx:22`)
- 장식 아이콘 `aria-hidden` (ChevronRight, MoreHorizontal)
- Sheet/ConfirmDialog는 Base UI `Dialog` 기반이다. `Dialog.Title` / `Dialog.Description`을 쓴다(`sheet.tsx`, `confirm-dialog.tsx:30-38`).
- Button: `loading` 시 `disabled`, `focus-visible:ring-2` (`packages/ui/src/button.tsx:7,65`)
- 썸네일 `alt=""` (장식 처리)
- 로그인 버튼의 흰 점 `aria-hidden` (`login-button.tsx:9`)

## 10. 현재 UX 문제점 메모

1. **뒤로 가기 고정**: 진입 경로(홈, 내 세션, Discord, 생성/수정 redirect)와 관계없이 AppBar 뒤로는 항상 `/games`다 (`game-detail.tsx:25`).
2. **"마감" 문구 불일치**: 정원만 찬 상태(`status=confirmed`, 배지 "대기 모집")에서도 확정 참여자에게 "모집이 마감되어 취소는 GM에게 문의하세요"가 보인다 (`game-action-zone.tsx:55,119`). 상태 정의상 정원 충족은 마감이 아니다(`status.ts:9`).
3. **확정 세션 후 배지**: `confirmed_at`이 있어도 헤더 배지는 모집 상태(예: "모집 중")를 표시한다. 액션 존만 "세션 확정"을 보여 준다.
4. **확정 세션 시 자격 정보 사라짐**: A1 분기는 뷰어가 참여자인지, 대기자인지, 무관한지를 구분하지 않는다. 대기자는 대기 순번 안내와 "대기 취소"가 사라지고(서버도 확정 후 취소를 막음), 비로그인도 같은 화면을 본다.
5. **fixed 모드 구인글은 참여할 수 없다**: fixed 게임은 `confirmed_at`이 항상 채워진다(6장 참고). 그래서 액션 존은 참여 버튼 없이 "세션 확정" 안내만 보여 주고(`game-action-zone.tsx:57-70`), 서버 `joinGame`도 "이미 일정이 확정된 게임입니다."로 거부한다(`join-game.ts:35`). 한편 목록 쿼리는 `confirmed_at`이 미래인 게임을 모집 중으로 노출한다(`games.ts:20`). fixed 게임은 목록에 보이지만 상세에서 신청할 방법이 없다.
   - 관련: GM·fixed·미확정 분기(G2)는 하단 바가 `null`이다(`game-detail-actions.tsx:22-24`). fixed 게임의 일정 조율 페이지는 "일시가 지정된 게임이라 조율이 필요 없어요."만 보여 주고 확정 폼이 없다(`src/views/game-schedule/ui/game-schedule-view.tsx:24-37`).
6. **인원 중복 표기**: 정보 표 "인원 N / M명"과 참여자 섹션 "참여자 N/M"이 같은 값을 두 번 보여 준다. 정보 표 문자열에는 공백이 두 칸 들어가 있다 (`game-info-table.tsx:24`).
7. **대기 인원 위치**: 대기자 수는 참여자 섹션의 "대기 N명"에만 있고 정보 표에는 없다.
8. **알림이 응답을 지연**: `joinGame`/`leaveGame`은 Discord 전송(각 최대 8초 타임아웃)을 기다린 뒤 반환한다. 그동안 버튼이 loading 상태로 남는다.
9. **삭제 후 캐시**: `deleteGame`은 `revalidatePath("/games")`를 호출하지 않는다. `/games`는 `force-dynamic`(`src/app/games/page.tsx:4`)이라 목록에는 영향이 없을 수 있다. Discord 모집 공지와 스레드는 남는다.
10. **로딩 스켈레톤 불일치**: 스켈레톤의 정보 행은 4개인데 실제 표는 5~6행이다. 버튼 스켈레톤은 sticky 하단 바 위치가 아니라 본문 안에 있다 (`loading.tsx:16,28`).
11. **로그인 후 복귀 안 됨**: 상세에서 "Discord로 로그인"을 누르면 콜백 기본값 때문에 홈 `/`로 돌아간다 (`sign-in.ts:6`, `auth/callback/route.ts:6`). 사용자가 상세를 다시 찾아 들어와야 한다.
12. **순차 조회**: `getGameById` 다음에 `getCurrentUser`를 순차 호출한다 (`game-detail-view.tsx:5-8`).
