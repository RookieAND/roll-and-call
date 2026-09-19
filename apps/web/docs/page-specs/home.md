# 홈 (`/`)

> 전역 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md) 참고.

## 1. 개요

- **라우트**: `/`
- **파일 위치**
  - page: `src/app/page.tsx:1-4`. `HomeView`만 렌더합니다.
  - view 진입: `src/views/home/ui/home-view.tsx:6-9`
  - loading.tsx: 없음 (`src/app/loading.tsx` 파일 없음)
  - error: 전용 파일은 없고 루트 `src/app/error.tsx`, `src/app/not-found.tsx`가 적용됩니다.
  - 관련 인증 라우트: `src/app/auth/callback/route.ts`
- **페이지 목적**: 같은 `/` 라우트가 로그인 여부에 따라 다른 화면을 그립니다 (`home-view.tsx:5` 주석).
  - 비로그인이면 **랜딩**(`HomeLanding`)을 보여줍니다. 서비스 소개, Discord 로그인, 모집 중인 구인글 2건 미리보기가 들어 있습니다.
  - 로그인이면 **대시보드**(`HomeDashboard`)를 보여줍니다. 인사말, 내 구인글/참여 구인글 최대 4건, 시작 안내가 들어 있습니다.

## 2. 접근 조건

| 사용자              | 결과                                                                                                                          | 근거                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 비로그인            | `HomeLanding` 렌더                                                                                                            | `home-view.tsx:7-8` (`getCurrentUser()` → null) |
| 로그인              | `HomeDashboard` 렌더                                                                                                          | `home-view.tsx:8`                               |
| GM(호스트) / 참여자 | 라우트 단위 차이는 없습니다. 대시보드의 각 행이 `role`("host"/"player")에 따라 서브라인과 조율 링크를 다르게 표시합니다 (5장) | `home-dashboard.tsx:18-21`                      |

- 리다이렉트나 `notFound` 호출은 없습니다.
- `getCurrentUser()`는 `supabase.auth.getUser()`를 호출합니다 (`src/shared/server/supabase.ts:7-13`). 세션 쿠키는 `src/proxy.ts:5-33`이 모든 요청(정적 자원 제외, `proxy.ts:35-37`)에서 갱신합니다.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발                      | 요소                                         | 근거                                                                  |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| 에러/404 화면             | "메인으로 돌아가기" 버튼                     | `src/shared/ui/error-screen.tsx:30`                                   |
| Discord OAuth 콜백        | 로그인 성공 시 `next`(기본값 `/`)로 redirect | `src/app/auth/callback/route.ts:6,18,20`                              |
| Discord OAuth 콜백        | 실패 시 `/?auth_error=1`로 redirect          | `route.ts:24`                                                         |
| `/me` (비로그인)          | `redirect("/")`                              | `src/views/my-page/ui/my-page-view.tsx:14`                            |
| `/me/sessions` (비로그인) | `redirect("/")`                              | `src/views/my-sessions/ui/my-sessions-view.tsx:41`                    |
| `/me/edit` (비로그인)     | `redirect("/")`                              | `src/views/edit-profile/ui/edit-profile-view.tsx:10`                  |
| `/games/new` (비로그인)   | `redirect("/")`                              | `src/views/create-game/ui/create-game-view.tsx:6`                     |
| 직접 URL 입력             | -                                            | BottomNav에는 `/` 탭이 없습니다 (`src/shared/ui/bottom-nav.tsx:8-11`) |

### 이탈

| 화면              | 요소                  | 목적지                                                  | 근거                                                           |
| ----------------- | --------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| 랜딩              | "Discord로 로그인"    | Discord OAuth → `/auth/callback` → `/`                  | `src/features/auth/api/sign-in.ts:4-7`                         |
| 랜딩              | "전체 보기"           | `/games`                                                | `landing-recruiting-preview.tsx:17`                            |
| 랜딩              | 구인글 행(GameRow)    | `/games/{id}`                                           | `landing-recruiting-preview.tsx:28`                            |
| 대시보드          | 게임 행(GameListItem) | `/games/{id}`                                           | `game-list-item.tsx:44`                                        |
| 대시보드          | "일정 조율하기"       | `/games/{id}/schedule`                                  | `src/features/coordinate-session/ui/game-schedule-link.tsx:17` |
| 대시보드          | "구인 목록 보기"      | `/games`                                                | `home-dashboard.tsx:74`                                        |
| 대시보드          | "로그아웃"            | 같은 페이지 `router.refresh()`로 랜딩이 다시 렌더됩니다 | `src/features/auth/ui/sign-out-button.tsx:10-13`               |
| 대시보드(빈 상태) | "구인 목록 둘러보기"  | `/games`                                                | `home-start-empty.tsx:15`                                      |
| 대시보드(빈 상태) | "새 구인 등록"        | `/games/new`                                            | `home-start-empty.tsx:18`                                      |
| 대시보드(빈 상태) | "설정"                | `/me/edit`                                              | `home-dashboard.tsx:48`                                        |

## 4. 데이터

### params / searchParams

- `page.tsx`는 `params`와 `searchParams`를 받지 않습니다.
- `auth_error` 쿼리는 `/auth/callback`이 붙여 보내지만 `src/` 안에서 이 값을 읽는 코드는 없습니다 (`grep auth_error` 결과 `route.ts:24` 한 곳뿐).

### 캐시

- `export const dynamic` 선언이 없습니다. `getCurrentUser()`가 `cookies()`를 사용하므로(`supabase.ts:16`) 요청 시점에 렌더됩니다.
- `revalidatePath("/")`를 호출하는 곳은 없습니다 (`grep` 결과 없음).

### 랜딩: `getRecruitingGamesPage(1, {}, 2)` (`src/shared/server/games.ts:9-47`)

- 조건: `games.end_date > now`이고, `games.confirmed_at IS NULL` 또는 `confirmed_at > now`여야 합니다 (`games.ts:20-21`). 정원이 찬 구인글도 포함됩니다 (commit 097e713).
- 정렬: 기본값 `games.created_at desc` (`games.ts:30`)
- limit 2 (`landing-recruiting-preview.tsx:8,11`)

| 표시 필드      | 테이블.컬럼                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| 제목           | `games.title`                                                                                              |
| 룰             | `games.rule`                                                                                               |
| GM 이름/아바타 | `profiles.username`, `profiles.avatar_url` (`games.gm_id` 관계)                                            |
| 확정 참여자 수 | `participants.status = 'confirmed'` 건수 (`countConfirmed`, `src/entities/game/model/participant.ts:9-11`) |
| 정원           | `games.max_players`                                                                                        |

### 대시보드: `getGamesByGm(user.id)` + `getJoinedGames(user.id)` (`games.ts:49-76`)

- `getGamesByGm`: `games.gm_id = userId`, `created_at desc`. 기간이나 완료 여부로 거르지 않습니다.
- `getJoinedGames`: `participants.user_id = userId`, `participants.joined_at desc`. `status`가 `confirmed`인 행과 `waiting`인 행을 모두 가져오고, 기간이나 완료 여부로 거르지 않습니다.
- 병합 순서: hosted 전체 뒤에 joined를 붙이고 `.slice(0, 4)` (`home-dashboard.tsx:11,18-21`)

| 표시 필드        | 테이블.컬럼 / 출처                                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사용자 이름      | `user.user_metadata.full_name` → `name` → `user.email` → `""` 순서로 대체 (`src/entities/profile/model/display.ts:8`). profiles 행은 넘기지 않습니다 |
| 아바타           | `user.user_metadata.avatar_url` (`display.ts:9`)                                                                                                     |
| 게임 제목 / 회차 | `games.title`, `games.round`                                                                                                                         |
| 상태 뱃지        | `games.max_players`, `games.end_date`, 확정 참여자 수, `games.waitlist_enabled`로 계산 (`deriveGameStatus`)                                          |
| 서브라인         | `games.rule`, `games.max_players`, `games.confirmed_at`, `profiles.username`                                                                         |
| 조율 링크 노출   | `games.schedule_mode`, `games.confirmed_at`, status                                                                                                  |
| 카운트 문구      | `joined.length`, `hosted.length` (slice 이전의 전체 길이)                                                                                            |

## 5. UI 구성 요소

### 5-A. 비로그인: 랜딩 (`src/views/home/ui/home-landing.tsx:7-15`)

`Container size="sm" className="px-0"` 안의 `VStack gap={6}` 구조입니다.

- **LandingHero**: `src/views/home/ui/landing-hero.tsx:6-28`
  - **로고 행** (`:10-13`): 26px 사각 색 블록(`bg-primary-600`) 옆에 "롤앤콜"
  - **표제** (`:14-18`, `<h1>`): "TRPG 세션, 모집부터" / 줄바꿈 / "일정 확정까지 한 곳에서"
  - **설명** (`:19-21`): "구인 글을 올려 플레이어를 모으고, 서로 가능한 시간을 겹쳐 세션 일시를 정합니다."
  - **LoginButton** (`:22`, `src/features/auth/ui/login-button.tsx:6-12`): 흰 점과 "Discord로 로그인" (variant `discord`, size `lg`, 전체 폭)
    - 클릭하면 `signInWithDiscord()`가 `supabase.auth.signInWithOAuth({ provider: "discord", redirectTo: origin + "/auth/callback" })`를 호출합니다 (`sign-in.ts:2-8`).
  - **각주** (`:23-25`): "디스코드 계정으로 시작합니다. 닉네임과 아바타만 가져옵니다."
- **LandingRecruitingPreview**: `src/views/home/ui/landing-recruiting-preview.tsx:10-34` (async 서버 컴포넌트가 직접 조회)
  - **헤더 행** (`:15-26`): 제목 "지금 모집 중", 오른쪽에 링크 "전체 보기 ›"
    - 클릭하면 `/games`로 이동합니다.
  - **구인글 행 × 최대 2** (`:27-31`): `Link /games/{id}`로 감싼 `GameRow` (`src/entities/game/ui/game-row.tsx:12-27`)
    - GM 아바타(size `stack`, 34px). 아바타 이미지가 없으면 이름 첫 글자, 이름도 없으면 "?"
    - 제목 `games.title` (한 줄 말줄임)
    - "`{rule}` · GM `{username ?? "?"}`" (한 줄 말줄임)
    - 오른쪽 "`{확정 참여자 수}/{max_players}`" (`GameSeatCount`, tabular-nums)
    - 상태 뱃지는 **없습니다**.

### 5-B. 로그인: 대시보드 (`src/views/home/ui/home-dashboard.tsx:14-83`)

`Container size="sm"` 안의 `VStack gap={6} py-8` 구조입니다. AppBar는 없습니다.

- **인사 헤더** (`:27-39`)
  - `Avatar` size `xl`(52px)
  - 제목: "`{name}`님, 처음이시네요"(게임 0건) 또는 "`{name}`님, 반갑습니다"
  - 부제: "아직 참여 중인 게임이 없습니다"(0건) 또는 "참여 중 `{joined.length}` · 내가 만든 구인 `{hosted.length}`"
- **[게임 0건] 시작 안내**
  - **HomeStartEmpty** (`src/views/home/ui/home-start-empty.tsx:5-24`, 셸은 `src/shared/ui/empty-state.tsx`, 점선 카드)
    - 이미지 `/empty-states/empty-my-games.png` 140px, alt "아직 참여 중인 게임이 없습니다"
    - 제목 "두 가지 방법으로 시작합니다"
    - 설명 "모집 중인 세션에 참여하거나, GM이 되어 직접 구인을 올리세요."
    - 버튼 "구인 목록 둘러보기"(primary) → `/games`
    - 버튼 "새 구인 등록"(outline) → `/games/new`
  - **설정 행** (`home-dashboard.tsx:44-57`): "프로필과 기본 가능 시간대 설정" 옆에 링크 "설정 ›" → `/me/edit`
  - 이 상태에서는 "로그아웃" 버튼과 "구인 목록 보기" 버튼이 렌더되지 **않습니다**.
- **[게임 1건 이상] 내 게임**
  - **섹션 제목** (`:62-64`): "내 게임"
  - **GameListItem × 최대 4** (`src/views/home/ui/game-list-item.tsx:25-59`): `rounded-xl` 테두리 박스
    - `Link /games/{id}` 안에 `GameSummary`가 들어갑니다 (`src/entities/game/ui/game-summary.tsx:9-34`).
      - 1행: 회차 뱃지(round ≥ 2일 때만 "`{round}`회차", `game-round-badge.tsx:5-10`), 제목(말줄임), 상태 뱃지
      - 2행 서브라인 (`src/views/home/model/game-subline.ts:10-27`)
        - GM(host): "`{rule}` · `{확정 참여자 수}/{max_players}`"
        - 참여자(player) + `confirmed_at` 있음: "GM `{username}` · `{formatDateTime(confirmedAt)}`". 출력 예: "8월 16일 (일) 20:00" (KST, 24h, `src/shared/lib/format.ts:2-17`)
        - 참여자 + `confirmed_at` 없음 + status `closed` 또는 `full`(대기 신청 끔 + 정원 충족): "GM `{username}` · 마감" (`game-subline.ts:25-26`)
        - 그 밖의 참여자: "GM `{username}` · 조율 중"
    - **GameScheduleLink** "일정 조율하기 ›" (`game-list-item.tsx:56`): `role === "player"`이면서 `canCoordinateSchedule`(schedule_mode `coordinate` + `confirmed_at` 없음 + status ≠ `closed`)일 때만 보입니다. `full`은 `closed`가 아니므로 대기 신청을 끈 구인글이 정원을 채워도 링크가 보입니다(`src/entities/game/model/can-coordinate-schedule.ts:17`). 클릭하면 `/games/{id}/schedule`로 이동합니다.
  - **하단 버튼 행** (`:72-77`)
    - "구인 목록 보기" (size lg, h 50px, flex-1) → `/games`
    - **SignOutButton** "로그아웃" (outline, 104px) → `supabase.auth.signOut()` 후 `router.refresh()` (`sign-out-button.tsx:10-13`)

### 상태 뱃지 문구 (`src/entities/game/model/status.ts:13-26`, 판정은 `derive-game-status.ts:7-23`)

| status       | 조건                                                    | 라벨        | 색      |
| ------------ | ------------------------------------------------------- | ----------- | ------- |
| `recruiting` | 기한 내, 확정 참여자 < 정원                             | "모집 중"   | primary |
| `confirmed`  | 기한 내, 확정 참여자 ≥ 정원, `waitlist_enabled = true`  | "대기 모집" | success |
| `full`       | 기한 내, 확정 참여자 ≥ 정원, `waitlist_enabled = false` | "모집 마감" | gray    |
| `closed`     | `end_date < now` (정원·대기 설정보다 우선)              | "모집 마감" | gray    |

## 6. 상태별 화면

| 상태                  | 화면                                                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로딩                  | `loading.tsx`와 `Suspense`가 없어 서버 렌더가 끝날 때까지 이전 화면이 유지됩니다. ❓ 확인 필요: 상위 레이아웃 수준의 로딩 UI 존재 여부(현재 `src/app/loading.tsx` 없음)                              |
| 에러                  | 루트 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도" + "메인으로 돌아가기"                                                                                  |
| 랜딩, 모집 글 0건     | 헤더 "지금 모집 중 / 전체 보기"만 남고 행과 빈 상태 문구가 없습니다 (`landing-recruiting-preview.tsx:27` `rows.map`만 존재)                                                                          |
| 대시보드, 내 게임 0건 | 5-B의 "처음이시네요"와 HomeStartEmpty, 설정 행                                                                                                                                                       |
| 대시보드, 1건 이상    | 최대 4건 목록. 5건 이상이어도 "더 보기" 링크가 없습니다                                                                                                                                              |
| 도메인 상태           | 행마다 "모집 중" / "대기 모집" / "모집 마감" 뱃지는 대시보드에만 표시되고 랜딩 `GameRow`에는 없습니다. "모집 마감"은 기한 경과(`closed`)와 대기 신청 끔 구인글의 정원 충족(`full`)이 같은 모양입니다 |
| 대기자                | `getJoinedGames`가 `waiting` 행도 포함하지만 GameListItem에는 대기 여부 표시가 없습니다                                                                                                              |
| 권한별                | host 행은 룰과 인원, player 행은 GM과 일정을 표시하며 조율 링크는 player에게만 보입니다                                                                                                              |
| 로그인 실패           | `/?auth_error=1`로 오지만 화면 변화는 없습니다 (읽는 코드 없음)                                                                                                                                      |

## 7. 폼과 유효성 검사

해당 없음.

## 8. 액션과 부수효과

| 액션           | 구현                                                                                                                                     | 성공                                                                                                                                                                         | 실패                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Discord 로그인 | 클라이언트 `signInWithOAuth` (`sign-in.ts:2-8`) → Discord → `GET /auth/callback` (`route.ts:3-25`)가 `exchangeCodeForSession(code)` 실행 | `x-forwarded-host`가 있고 development가 아니면 `https://{host}{next}`, 그 밖에는 `{origin}{next}`로 redirect. `next`가 `/`로 시작하지 않으면 `/`로 바꿉니다 (`route.ts:6-8`) | `code`가 없거나 교환 오류면 `/?auth_error=1`. 토스트나 안내 문구는 없습니다 |
| 로그아웃       | 클라이언트 `supabase.auth.signOut()` (`sign-out.ts:3-6`) → `router.refresh()`                                                            | 같은 `/`가 랜딩으로 다시 렌더됩니다                                                                                                                                          | `signOut()` 결과를 확인하지 않습니다. 토스트 없음                           |

- `signInWithDiscord`는 `redirectTo`에 `next` 파라미터를 붙이지 않으므로(`sign-in.ts:6`) 로그인 뒤에는 항상 `/`로 돌아옵니다.
- Server Action, `revalidatePath`, Discord Webhook 알림은 없습니다.

## 9. 반응형과 접근성 현황

- **breakpoint 클래스**: 홈 컴포넌트에는 `sm:`/`md:`/`lg:`가 없습니다. 폭은 `Container size="sm"`(`max-w-2xl`, `packages/ui/src/container.tsx:5`)로 제한됩니다.
- **시맨틱**: 랜딩 표제만 `<h1>`입니다 (`landing-hero.tsx:14`). 대시보드와 "지금 모집 중", "내 게임" 섹션 제목은 `Text`이며 heading 태그로 렌더되는지는 ❓ 확인 필요: `@trpg/ui` `Text` 기본 렌더 태그.
- **aria**: 장식 아이콘에 `aria-hidden`이 있습니다 (`ChevronRight` `landing-recruiting-preview.tsx:23`, `home-dashboard.tsx:54`, 로그인 버튼 흰 점 `login-button.tsx:9`, `game-schedule-link.tsx:18`).
- **alt**
  - HomeStartEmpty 이미지 alt는 "아직 참여 중인 게임이 없습니다"로, 바로 위 부제 문구와 같습니다.
  - `Avatar` 이미지 alt는 `name ?? ""`이고(`packages/ui/src/avatar.tsx:55`) 이미지가 없으면 첫 글자만 렌더합니다.
- **키보드**: 모든 이동이 `next/link`와 `<button>`이라 기본 포커스가 동작합니다. 별도 키보드 처리는 없습니다.
- **sr-only**: 없습니다.

## 10. 현재 UX 문제점 메모

1. **로그인 실패가 표시되지 않습니다.** `/auth/callback`은 `/?auth_error=1`로 보내지만(`route.ts:24`) 이 값을 읽는 코드가 없어 사용자는 아무 안내 없이 랜딩으로 돌아옵니다.
2. **로그인 후 원래 페이지로 돌아가지 않습니다.** 콜백은 `next`를 지원하지만(`route.ts:6`) `signInWithDiscord`가 `next`를 넘기지 않습니다(`sign-in.ts:6`). 그래서 구인 상세(`src/views/game-detail/ui/game-action-zone.tsx:98`)에서 로그인해도 `/`로 돌아옵니다.
3. **비로그인 사용자가 로그인 필요 화면에 가면 조용히 `/`로 튕깁니다.** `/games/new`, `/me` 등이 설명 없이 `redirect("/")`만 합니다 (3장 진입 표).
4. **`/`로 가는 내비게이션이 없습니다.** BottomNav에 `/` 탭이 없고(`bottom-nav.tsx:8-11`) 앱 안에서 `/`로 가는 링크는 에러 화면의 "메인으로 돌아가기"뿐입니다. `/`에서는 어떤 탭도 active가 아닙니다 (`pathname.startsWith`, `bottom-nav.tsx:19`).
5. **랜딩 미리보기에 상태 뱃지가 없습니다.** 097e713 이후 정원이 찬 구인글도 목록에 들어오는데(`games.ts:8`), `GameRow`에는 뱃지가 없어 "지금 모집 중" 제목 아래에 "4/4" 같은 꽉 찬 구인글이 구분 없이 나올 수 있습니다.
6. **랜딩 미리보기 0건일 때 빈 상태가 없습니다.** 제목과 "전체 보기"만 남습니다.
7. **대시보드 목록이 GM 구인글에 치우칩니다.** hosted를 먼저 붙이고 4건으로 자르므로(`home-dashboard.tsx:18-21`) 구인글을 4개 이상 올린 GM에게는 참여 게임이 보이지 않습니다. 목록이 잘려도 전체 보기 링크(예: `/me/sessions`)가 없습니다.
8. **대시보드가 완료되거나 마감된 게임도 섞어 보여줍니다.** `getGamesByGm`과 `getJoinedGames`에 기간/완료 필터가 없습니다 (`games.ts:49-76`).
9. **대기자 표시가 없습니다.** `waiting` 참여도 "참여 중" 카운트와 목록에 포함되고, 행에는 대기 여부 표시가 없습니다.
10. **"조율 중" 서브라인이 고정 일정 게임에도 나올 수 있습니다.** 참여자 서브라인은 `confirmed_at`이 없으면 schedule_mode와 관계없이 "조율 중"입니다 (`game-subline.ts:26`). ❓ 확인 필요: `fixed` 모드 구인글이 생성 시 항상 `confirmed_at`을 갖는지 (`src/features/write-game/api/create-game.ts:33`은 값이 없으면 null 저장).
11. **빈 상태 대시보드에는 로그아웃 버튼이 없습니다.** 로그아웃 수단은 다른 페이지(`src/views/edit-profile/ui/edit-profile-view.tsx`)에만 남습니다.
12. **인사말 이름이 profiles를 무시합니다.** `profileDisplay({ user })`에 profile을 넘기지 않아(`home-dashboard.tsx:15`) `/me/edit`에서 바꾼 `profiles.username`이 반영되지 않고 Discord 메타데이터 이름이 표시됩니다.
13. **상태 라벨과 코드 명칭이 다릅니다.** status 값 `confirmed`(정원 충족)의 라벨은 "대기 모집"이고, `games.confirmed_at`(확정 세션)과 이름이 겹칩니다 (`status.ts:1,14`, `derive-game-status.ts:4` 주석).
