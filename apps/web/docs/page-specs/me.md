# 마이페이지 (`/me`)

## 1. 개요

로그인한 사용자의 신원(아바타·표시 이름·Discord 핸들)과 내 세션 요약을 보여주는 화면이다. "참여 예정"/"운영 중" 숫자 카드 두 개, 섹션별 미리보기(최대 3건), 지난 세션 진입 링크로 구성된다. 전체 목록은 [`/me/sessions/joined` · `/me/sessions/hosted`](./me-sessions.md)로 넘기고, 프로필 수정은 [`/me/edit`](./me-edit.md)로 넘긴다.

- 라우트: `src/app/me/page.tsx:1-4` → `MyPageView` (`src/views/my-page/ui/my-page-view.tsx:12`)
- 공통 레이아웃(BottomNav, Toaster, 테마): [_shared-layout.md](./_shared-layout.md)

## 2. 접근 조건

| 조건                                 | 결과                                                                     | 근거                                          |
| ------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------- |
| 비로그인 (`getCurrentUser()`가 null) | `redirect("/")`. 복귀용 `next` 파라미터 없음                             | `src/views/my-page/ui/my-page-view.tsx:13-14` |
| 로그인                               | 본인 데이터만 렌더. 다른 사용자의 마이페이지를 볼 수 있는 라우트는 없음  | 같은 파일 `:16-20`                            |
| `profiles` 행이 없음                 | 에러 없이 Discord 메타데이터(`full_name` → `name` → `email`)로 대체 표시 | `src/entities/profile/model/display.ts:5-11`  |

- `src/proxy.ts`는 세션 쿠키만 갱신하고 경로별 인증 가드는 없다. 인증 판정은 뷰 안에서만 한다.
- notFound 규칙 없음. GM/참여자 권한별 화면 분기도 없고, 데이터 유무(운영/참여 건수)만 화면에 반영된다.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발                                         | 요소                                               | 근거                                                                                                          |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 모든 페이지                                  | BottomNav "마이페이지" 탭 (`/me`)                  | `src/shared/ui/bottom-nav.tsx:10`                                                                             |
| `/me/edit`                                   | AppBar 뒤로(`back="/me"`)                          | `src/views/edit-profile/ui/edit-profile-view.tsx:17`                                                          |
| `/me/edit` 저장 성공                         | `router.push("/me")` (서버 응답 `redirect: "/me"`) | `src/features/edit-profile/api/update-profile.ts:34`, `src/features/edit-profile/ui/edit-profile-form.tsx:39` |
| `/me/sessions/hosted`, `/me/sessions/joined` | AppBar 뒤로(`back="/me"`)                          | `src/views/my-sessions/ui/my-sessions-view.tsx:57`                                                            |

### 이탈

| 요소                               | 목적지                                                                                              | 근거                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 헤더 연필 아이콘 "프로필 편집"     | `/me/edit`                                                                                          | `src/views/my-page/ui/my-page-header.tsx:22-31`     |
| "참여 예정인 세션" 더 보기         | `/me/sessions/joined` (tab 없음 → 기본 탭 `confirmed`)                                              | `src/views/my-page/ui/my-page-view.tsx:48`          |
| "운영 중인 세션" 더 보기           | `/me/sessions/hosted` (기본 탭 `recruiting`)                                                        | 같은 파일 `:55`                                     |
| 세션 카드                          | 참여자 역할이거나 지난 세션이면 `/games/{id}`, GM이면서 진행 중이면 `/games/{id}/participants`      | `src/widgets/session-list/ui/session-list.tsx:6-8`  |
| 참여 예정 빈 상태 "구인 목록 보기" | `/games`                                                                                            | `src/views/my-page/ui/session-summary-empty.tsx:14` |
| 운영 중 빈 상태 "새 구인 등록"     | `/games/new`                                                                                        | 같은 파일 `:31`                                     |
| "지난 세션 N"                      | 참여한 종료 세션이 있으면 `/me/sessions/joined?tab=closed`, 없으면 `/me/sessions/hosted?tab=closed` | `src/views/my-page/model/my-page-summary.ts:24-27`  |
| 비로그인                           | `/` (redirect)                                                                                      | `src/views/my-page/ui/my-page-view.tsx:14`          |

## 4. 데이터

### 조회 (서버 컴포넌트, 병렬)

| 호출                      | 쿼리                                                                                                                                | 근거                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `getCurrentUser()`        | Supabase `auth.getUser()`                                                                                                           | `src/shared/server/supabase.ts:7-13` |
| `getProfile(user.id)`     | `profiles` where `id = user.id`                                                                                                     | `src/shared/server/profiles.ts:3-7`  |
| `getGamesByGm(user.id)`   | `games` where `gm_id = user.id`, `created_at desc`, with `gm(username, avatar_url)`, `participants(user_id, status, joined_at)`     | `src/shared/server/games.ts:49-58`   |
| `getJoinedGames(user.id)` | `participants` where `user_id = user.id`, `joined_at desc` → 각 `game` (+gm, participants). status가 `waiting`인 대기자 행도 포함됨 | `src/shared/server/games.ts:60-76`   |

### 표시 필드

| 화면 값             | 원천                                                                                                                                           | 비고                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 이름                | `profiles.username` ?? `user_metadata.full_name` ?? `.name` ?? `user.email` ?? `""`                                                            | `src/entities/profile/model/display.ts:8`                           |
| 아바타              | `profiles.avatar_url` ?? `user_metadata.avatar_url` ?? null                                                                                    | `:9`                                                                |
| 핸들 `@…`           | `user_metadata.user_name` ?? `.preferred_username` (DB에 없음)                                                                                 | `:10`                                                               |
| 세션 카드 제목/회차 | `games.title`, `games.round`                                                                                                                   | `src/widgets/session-list/model/session-card.ts:98-101`             |
| 세션 상태           | `games.confirmed_at`, `games.end_date`, `games.max_players`, `games.schedule_mode`, `participants.status`(confirmed 수) → `deriveSessionState` | `session-card.ts:70-80`, `src/entities/game/model/session.ts:18-41` |
| 대기 순번           | `participants.joined_at` 정렬 후 waiting 중 순번                                                                                               | `src/entities/game/model/split-roster.ts:18-35`                     |
| GM 이름             | `profiles.username` (gm 관계) ?? `"?"`                                                                                                         | `session-card.ts:82`                                                |

### 요약 가공 (`summarizeMySessions`, `src/views/my-page/model/my-page-summary.ts:10-28`)

| 값             | 정의                                                                                                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `upcoming`     | `bucketJoined(...).confirmed`: 참여한(대기 포함) 게임 중 종료가 아니고 카드 배지가 세션 D-n(`kind: "session"`)인 것. 상태 `confirmed`(세션 시각이 있고 아직 안 지남)이거나, 일시 지정형 모집 중에 내가 대기자가 아닌 경우다(`session-card.ts:112-142, 205-209`). **대기자라도 상태가 `confirmed`면 여기에 들어간다**(아래 "대기열(대기 신청) 표시") |
| `hosting`      | `[...bucketHosted(...).recruiting, ...bucketHosted(...).confirmed]`: 운영하는 게임 중 아직 끝나지 않은 것 전부. 모집 중(`recruiting` / `scheduling` / `pending_confirm`)을 앞에, 확정(`confirmed`)을 뒤에 둔다                                                                                                                                      |
| `hostedBefore` | 운영 closed 수 > 0. 운영 중 빈 상태 문구를 고른다                                                                                                                                                                                                                                                                                                   |
| `pastCount`    | 참여 closed 수 + 운영 closed 수 (`closed` + `finished`)                                                                                                                                                                                                                                                                                             |
| `pastHref`     | 위 "이탈" 표 참고                                                                                                                                                                                                                                                                                                                                   |

- 일시 지정형은 등록 때부터 `confirmed_at`이 있지만, 모집 마감 전이고 정원이 남아 있으면 `recruiting`이다(아래 판정 순서는 [me-sessions](./me-sessions.md) §4).
- 참여 중인 조율형 미확정 세션(joined `waiting` 탭)은 이 화면의 카드·숫자 어디에도 들어가지 않는다.
- 정렬: 확정 탭은 `confirmed_at` 오름차순, 모집 탭은 `end_date` 오름차순 (`session-card.ts:212-216, 241-246`).

### 대기열(대기 신청) 표시

`/me`에는 대기열 전용 섹션·지표·배지 요약이 **없다**. 대기 신청한 게임은 `getJoinedGames`(`participants.status = waiting` 행 포함, `src/shared/server/games.ts:60-76`)로 함께 조회되지만, 화면에 쓰이는 것은 `summarizeMySessions`가 고른 `upcoming`(joined `confirmed` 버킷)과 `pastCount`(joined `closed` 버킷 수)뿐이다(`src/views/my-page/model/my-page-summary.ts:18-30`). joined `waiting` 버킷은 이 화면에서 버려진다.

대기자인 게임이 어디에 나오는지는 카드 배지 판정 순서(`sessionBadge`, `session-card.ts:127-141`)가 정한다: ① 종료(`closed`/`finished`) → 배지 없음 ② 상태 `confirmed` + `confirmed_at` 있음 → 세션 D-n ③ 내가 대기자 → "대기 {n}번" ④ 참여자 + `confirmed_at` 있음 → 세션 D-n ⑤ 그 외 "마감 D-n". ②가 ③보다 앞선다.

| 내가 대기자인 게임의 상태                                      | `/me`에서                                                                                                                         | 근거                                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 조율형, GM 확정 전, 기한 전                                    | **보이지 않음**(참여 예정 카드·숫자 모두 제외)                                                                                    | 배지 ③ → joined `waiting` 버킷                                                                                                       |
| 일시 지정형, 확정 인원 < 정원, 기한 전 (정원을 늘린 경우 등)   | **보이지 않음**                                                                                                                   | 상태 `recruiting` → 배지 ③ → `waiting` 버킷                                                                                          |
| 조율형, GM이 세션을 확정함(`confirmed_at` 있음, 아직 안 지남)  | "참여 예정인 세션"과 "참여 예정" 숫자에 **포함**. 초록 "D-{n}", 서브라인 "{일시} · GM {이름}". 확정 참여자 카드와 구분되지 않는다 | 배지 ②. `confirmSession`은 `games`만 바꾸고 대기자 행을 건드리지 않는다(`src/features/confirm-session/api/confirm-session.ts:14-19`) |
| 일시 지정형, 확정 인원 ≥ 정원(대기자가 생기는 정상 경로)       | 위와 같이 **포함**, 초록 "D-{n}"                                                                                                  | `deriveSessionState`가 `confirmed` 반환(`src/entities/game/model/session.ts:38-44`) → 배지 ②                                         |
| 기한이 지났고 확정 없음(`closed`) 또는 세션이 지남(`finished`) | 카드 없음. 하단 "지난 세션 {n}" 숫자에만 더해진다                                                                                 | `my-page-summary.ts:24`                                                                                                              |
| 대기 취소·GM이 내보냄·게임 삭제                                | 참여 행이 삭제돼 어디에도 없음                                                                                                    | `leave-game.ts:34-36`, `adjust-roster.ts:121-124`, FK cascade                                                                        |

- 대기 순번 `{n}`은 `splitRoster`가 모든 참여자를 `joined_at` 오름차순으로 정렬한 뒤 `waiting` 행에만 1부터 매긴 값이다(`src/entities/game/model/split-roster.ts:18-35`). 저장된 값이 아니라 렌더마다 다시 계산하므로, 앞 대기자가 취소하거나 승격되면 번호가 당겨진다. 상세 화면의 "대기 {rank}/{waitingCount}"도 같은 함수를 쓴다.
- **"더 보기"로 대기 탭에 갈 수 없다.** "더 보기"는 `upcoming`이 1건 이상일 때만 보이고(`session-summary-section.tsx:34-44`) `/me/sessions/joined`(tab 없음 → 기본 "확정" 탭)로 간다. `?tab=waiting`으로 가는 링크는 `src/` 어디에도 없다.
- 대기 게임만 있는 사용자는 `upcoming`이 0이라 "더 보기"도 없고 `UpcomingSessionsEmpty`("아직 참여 예정인 세션이 없습니다" + "구인 목록 보기")가 보인다. 이때 `/me/sessions/joined`로 가는 경로는 "지난 세션 {n}"(참여 종료가 있을 때 `?tab=closed`로 감)뿐이다(`my-page-summary.ts:26-29`).
- 대기 신청 끔(`games.waitlist_enabled = false`) 게임: 카드 모델(`toSessionCard`)은 `waitlist_enabled`를 읽지 않으므로 표시 규칙이 위와 같다. `joinGame`은 이런 게임에 새 대기 신청을 받지 않지만(`src/features/join-game/api/join-game.ts:49-52` "정원이 가득 차 신청할 수 없습니다."), 대기 행이 남거나 생기는 경로가 있다: GM이 대기자가 있는 게임을 "받지 않기"로 수정(`updateGame`은 참여 행을 건드리지 않음), GM의 "대기로 이동"(`demoteParticipant`에 설정 검사 없음, `adjust-roster.ts:74-107`), 다음 회차 생성(원본 설정을 복사하고 정원 초과분을 `waiting`으로 넣음, `create-second-round.ts:62`). 이 경우에도 카드에는 설정 차이가 드러나지 않는다.
- 대기 취소나 "가능 시간 입력" 같은 대기 전용 동작은 이 화면에 없다. 카드는 참여자 역할이라 항상 `/games/{id}`로 가고(`session-list.tsx:6-8`), 동작은 상세 액션 존에만 있다([game-detail.md](./game-detail.md) §6 A2).

### params / searchParams

없음.

### 캐시

- `export const dynamic` 선언은 없다. `cookies()`를 쓰는 `getCurrentUser`를 호출하므로 동적 렌더링이다. ❓ 확인 필요: 빌드 결과에서 `/me`가 실제로 dynamic(ƒ)으로 분류되는지.
- `revalidatePath("/me")`는 `updateProfile`, `refreshAvatar`만 호출한다 (`src/features/edit-profile/api/update-profile.ts:33`, `refresh-avatar.ts:17`). 참여/이탈/확정 등 게임 액션은 `/me`를 revalidate하지 않는다 (`src/features/join-game/api/join-game.ts:71-73` 등).

## 5. UI 구성 요소

```
AppBar
Container(size="sm", py-6, gap 6)
├─ MyPageHeader
│  ├─ ProfileIdentity (아바타 · 이름 · @핸들)
│  └─ ThemeToggle · 프로필 편집 버튼
├─ StatCard ×2 ("참여 예정" / "운영 중")
├─ SessionSummarySection "참여 예정인 세션"
├─ SessionSummarySection "운영 중인 세션"
└─ PastSessionsLink "지난 세션 N"
```

- **AppBar**: `src/views/my-page/ui/my-page-view.tsx:31`, `src/shared/ui/app-bar.tsx:14-51`
  - 표시: 제목 "마이페이지". 뒤로 버튼 없음(`back` 미지정)이라 `heading2` 타이포.
  - sticky `top-0`, 높이 52px.
- **ProfileIdentity**: `src/views/my-page/ui/my-page-header.tsx:19`, `src/entities/profile/ui/profile-identity.tsx:4-28`
  - 표시: `Avatar size="2xl"` (이미지가 없으면 이름 첫 글자, 이름도 비면 "?"), 이름(`heading1`, 19px), 핸들이 있으면 "@{handle}"(`code2`, hint 색).
  - 인터랙션 없음.
- **ThemeToggle**: `my-page-header.tsx:21`, `src/shared/ui/theme-toggle.tsx:7-35`
  - 표시: 36px 아이콘 버튼. 다크면 Sun, 라이트면 Moon. `aria-label="테마 전환"`.
  - 클릭하면 `document.documentElement`의 `dark` 클래스를 토글하고 `localStorage.theme`에 `"dark"`/`"light"`를 저장한다.
- **프로필 편집 버튼**: `my-page-header.tsx:22-31`
  - 표시: Pencil 아이콘(16px), outline, `aria-label="프로필 편집"`.
  - 클릭하면 `/me/edit`로 이동.
- **StatCard "참여 예정"**: `my-page-view.tsx:37-39`, `src/shared/ui/stat-card.tsx:4-32`
  - 표시: `upcoming.length` 숫자(2xl, extrabold, tabular-nums)와 라벨 "참여 예정". `urgent`는 넘기지 않음.
  - 인터랙션 없음(링크 아님).
- **StatCard "운영 중"**: `my-page-view.tsx:40-42`
  - 표시: `hosting.length`와 라벨 "운영 중". 인터랙션 없음.
- **SessionSummarySection "참여 예정인 세션"**: `my-page-view.tsx:45-50`, `src/views/my-page/ui/session-summary-section.tsx:10-49`
  - 헤더: `<h2>` "참여 예정인 세션"(13.5px extrabold)과 총 건수(`code2`, hint).
  - 1건 이상이면 우측에 "더 보기 ›" 링크(→ `/me/sessions/joined`) (`:34-44`).
  - 본문: 0건이면 `UpcomingSessionsEmpty`, 아니면 `SessionList`에 앞 3건(`PREVIEW = 3`, `:8, :46`).
- **SessionSummarySection "운영 중인 세션"**: `my-page-view.tsx:52-57`
  - 구조는 위와 같다. 더 보기 → `/me/sessions/hosted`. 0건이면 `HostedSessionsEmpty`.
- **SessionList / SessionCard**: `src/widgets/session-list/ui/session-list.tsx:10-20`, `session-card.tsx:8-35`
  - 카드마다 `<Link>`로 감싼다(목적지는 §3).
  - 1행 좌측: `GameRoundBadge`(2회차 이상일 때만 "{round}회차", `src/entities/game/ui/game-round-badge.tsx:4-11`)와 제목(`subtitle1`, 말줄임).
  - 1행 우측: `SessionBadge`(`session-badge.tsx:15-25`, 클라이언트 컴포넌트).
    - 확정: 초록 "D-{n}"
    - 대기자 본인이고 확정 전: 회색 "대기 {n}번"
    - 참여자이고 일시 지정형 모집 중(세션 시각이 이미 있음): 초록 "D-{n}"(세션까지)
    - 그 외 미확정: "마감 D-{n}". 마감 24시간 이내면 빨강(`src/entities/game/model/deadline.ts:4-7`)
    - 종료: 배지 없음
    - D-n은 사용자 로컬 타임존 기준 날짜 차이다(`src/shared/lib/format.ts:48-53`).
  - 2행 서브라인(`body4`, 말줄임, 종료면 hint 색). `lead`가 있으면 굵게 쓰고 " · "로 이어 붙인다(`session-card.ts:138-186`). 역할별 문구:

    | 역할   | 상태                               | 서브라인                                              |
    | ------ | ---------------------------------- | ----------------------------------------------------- |
    | GM     | recruiting                         | **모집 중** · "{확정수} / {정원}명"                   |
    | GM     | scheduling                         | **조율 중** · "{확정수} / {정원}명"                   |
    | GM     | pending_confirm                    | **확정 대기** · "신청 {전체참여수}명 · 정원 {정원}명" |
    | GM     | confirmed/finished                 | "8월 16일 (일) 20:00" 형식(KST)                       |
    | GM     | closed                             | "마감 8/17"                                           |
    | 참여자 | confirmed/finished                 | "{일시} · GM {이름}"                                  |
    | 참여자 | closed                             | "마감 {M/D} · GM {이름}"                              |
    | 참여자 | 그 외, 일시 지정형(세션 시각 있음) | "{일시} · GM {이름}"                                  |
    | 참여자 | 그 외, 조율형(세션 시각 없음)      | "일정 미정 · 마감 {M/D} · GM {이름}"                  |

  - 마감 24시간 이내 카드는 빨강 테두리(1.5px)와 `bg-danger-50`으로 강조된다(`session-card.tsx:9-11`).
- **UpcomingSessionsEmpty**: `src/views/my-page/ui/session-summary-empty.tsx:5-19`
  - 표시: 이미지 `/empty-states/empty-my-games.png`(104px, alt "아직 참여 예정인 세션이 없습니다"), 제목 "아직 참여 예정인 세션이 없습니다", 버튼 "구인 목록 보기".
  - 버튼 클릭 → `/games`.
- **HostedSessionsEmpty**: `session-summary-empty.tsx:22-36`
  - 표시: 제목은 지난 운영 세션이 없으면 "아직 본인이 연 세션이 없습니다", 있으면(`hostedBefore`) "지금 운영 중인 세션이 없습니다". 버튼 "새 구인 등록".
  - 이미지 `/empty-states/empty-hosted.png`는 항상 나온다.
  - 버튼 클릭 → `/games/new`.
- **PastSessionsLink**: `src/views/my-page/ui/past-sessions-link.tsx:6-20`
  - `count === 0`이면 렌더하지 않는다.
  - 표시: 상단 구분선과 "지난 세션 {count}" + ChevronRight.
  - 클릭 → `pastHref`.

## 6. 상태별 화면

| 상태                   | 화면                                                                                                                                                                                                                                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로딩                   | `src/app/me/` 아래에 `loading.tsx`가 없다. 서버 렌더가 끝날 때까지 이전 화면이 유지된다. ❓ 확인 필요: 상위(`src/app/`)에 `loading.tsx`가 없어 스트리밍 fallback이 없는 것으로 보이며, 실제 체감 확인 필요                                                                                          |
| 빈 상태: 참여 예정 0   | StatCard "0"과 `UpcomingSessionsEmpty`                                                                                                                                                                                                                                                              |
| 빈 상태: 운영 중 0     | StatCard "0"과 `HostedSessionsEmpty`(참여 예정 유무에 따라 이미지 표시)                                                                                                                                                                                                                             |
| 빈 상태: 지난 세션 0   | 하단 링크 숨김                                                                                                                                                                                                                                                                                      |
| 에러                   | 전역 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / 버튼 "다시 시도"                                                                                                                                                                                                  |
| 비로그인               | `/`로 redirect                                                                                                                                                                                                                                                                                      |
| 도메인 상태            | 참여자 세션: 확정 탭(세션 D-n 배지: `confirmed` 또는 일시 지정형 모집 중에 확정 참여)만 노출. GM 세션: `recruiting`·`scheduling`·`pending_confirm`·`confirmed` 노출. `closed`/`finished`는 "지난 세션" 숫자로만 반영되고, 참여자의 조율형 미확정 세션은 보이지 않는다. 마감 임박은 카드 강조로 표시 |
| 권한별                 | 본인 전용. GM/참여자 구분은 카드 목적지와 서브라인에만 반영                                                                                                                                                                                                                                         |
| 대기열(대기 신청) 표시 | 대기 전용 섹션·지표 없음. 확정 전(배지 "대기 {n}번") 대기 게임은 보이지 않고, 세션이 확정된(`confirmed`) 게임의 대기자는 "참여 예정"에 초록 D-n으로 섞인다. 대기 게임만 있으면 참여 예정 빈 상태가 뜬다. 상세는 §4 "대기열(대기 신청) 표시"                                                         |

## 7. 폼과 유효성 검사

폼 없음.

## 8. 액션과 부수효과

- Server Action 없음.
- 클라이언트 부수효과는 `ThemeToggle`의 `localStorage.theme` 저장과 `<html>.dark` 토글뿐이다.
- 토스트, revalidatePath, Discord Webhook 없음.

## 9. 반응형과 접근성 현황

- 레이아웃: `Container size="sm"`(`max-w-2xl`, `px-4`), 세로 스택. StatCard 2개는 `flex-1`로 가로 반씩 차지하며 좁은 폭에서도 줄바꿈하지 않는다(`my-page-view.tsx:36-43`). 브레이크포인트별 분기 없음.
- 카드 제목과 서브라인은 `truncate`로 한 줄 말줄임한다.
- 헤딩: AppBar 제목은 `<span>`이고, 섹션 제목만 `<h2>`다. 페이지에 `<h1>`이 없다(ProfileIdentity 이름은 `Text` 기본 태그인 `<span>`이다, `packages/ui/src/text.tsx:43`).
- 아이콘 버튼 두 개는 `aria-label`이 있다. Chevron 아이콘은 `aria-hidden`.
- StatCard 숫자와 라벨은 시각적 묶음일 뿐 의미 구조(`dl` 등)가 없다.
- 섹션 제목 옆 건수에는 스크린리더용 설명("건" 등)이 없다.
- `SessionBadge`는 `"use client"`로 D-n을 계산한다. 서버 HTML과 클라이언트 값이 날짜 경계에서 달라질 수 있다. ❓ 확인 필요: hydration 경고 발생 여부.

## 10. 현재 UX 문제점 메모

- "참여 예정" 숫자와 섹션은 세션 시각이 잡힌 게임만 센다. 조율형에 참여 신청했지만 일정이 미정인 게임은 마이페이지 어디에도 보이지 않고, `/me/sessions/joined?tab=waiting`에서만 볼 수 있다(`my-page-summary.ts`).
- ~~"운영 중"은 모집/조율/확정 대기만 센다. GM이 확정한 앞으로의 세션은 마이페이지에 나오지 않는다.~~ 해결: 확정된 운영 세션도 포함한다. 일시 지정형 모집 중 게임이 "확정"으로 분류돼 0건으로 보이던 문제도 함께 고쳤다.
- StatCard 숫자와 바로 아래 섹션 헤더 건수가 같은 값을 두 번 보여준다(`my-page-view.tsx:38, 41` vs `session-summary-section.tsx:30-32`).
- "지난 세션 N"은 참여와 운영 종료 수의 합인데, 링크는 한쪽 탭으로만 간다. 참여 종료가 1건이라도 있으면 운영 종료 세션으로 가는 경로가 없다(`my-page-summary.ts:22-27`). 이때 운영 종료는 `/me/sessions/hosted`에서 탭을 바꿔야 볼 수 있다.
- 게임 액션(참여·이탈·확정)이 `/me`를 revalidate하지 않는다. 동적 렌더라면 영향이 없겠지만 클라이언트 라우터 캐시로 이전 값이 보일 수 있다. ❓ 확인 필요.
- 비로그인 redirect가 `/`로 가고 로그인 후 `/me`로 돌아오는 `next` 처리가 없다(`auth/callback`은 `next`를 지원하지만 여기서 넘기지 않음).
- 로그아웃 버튼은 마이페이지에 없고 `/me/edit` 하단에만 있다(`src/views/edit-profile/ui/edit-profile-view.tsx:27`).
- `/`의 로그인 대시보드(`src/views/home/ui/home-dashboard.tsx:14-83`)가 같은 `getGamesByGm`/`getJoinedGames`로 "내 게임" 요약(4건)과 로그아웃 버튼을 따로 제공한다. 마이페이지와 역할이 겹친다.
- 서브라인 문구도 다른 곳(용어집)과 같이 "GM"을 쓴다(`session-card.ts`).
- 대기열(대기 신청) 표시 관련:
  - 확정 전 대기 신청 게임은 `/me` 어디에도 없고, `/me`에서 `/me/sessions/joined?tab=waiting`으로 가는 링크도 없다(`my-page-view.tsx:48`, `my-page-summary.ts:26-29`).
  - 대기 게임만 있는 사용자에게 "아직 참여 예정인 세션이 없습니다"가 보인다(`session-summary-empty.tsx:5-19`).
  - 세션이 확정된 게임에서 아직 `waiting`인 사용자는 "참여 예정"에 세어지고 확정 참여자와 같은 초록 "D-{n}" 카드로 보인다(`session-card.ts:128-130`이 대기 순번 분기보다 앞선다). 상세에서도 확정 후에는 대기 순번 대신 "세션 확정" 안내만 보인다(`derive-action-view.ts:45`).
  - 대기 신청 끔 게임과 켬 게임이 카드에서 구분되지 않는다(`toSessionCard`가 `waitlist_enabled`를 읽지 않음).
