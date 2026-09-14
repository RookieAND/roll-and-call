# 내 세션 목록 (`/me/sessions/hosted`, `/me/sessions/joined`)

## 1. 개요

두 라우트 모두 뷰 `MySessionsView` 하나를 쓰고 `role`만 다르게 넘긴다. 내가 GM인 구인글(hosted) 또는 내가 참여/대기 신청한 구인글(joined)을 탭(`?tab=`)으로 나눠 카드 목록으로 보여준다.

- `src/app/me/sessions/hosted/page.tsx:1-7` → `<MySessionsView role="host" tab={sp.tab} />`
- `src/app/me/sessions/joined/page.tsx:1-7` → `<MySessionsView role="player" tab={sp.tab} />`
- 뷰: `src/views/my-sessions/ui/my-sessions-view.tsx:39-74`
- 카드 모델/버킷: `src/widgets/session-list/model/session-card.ts`
- 공통 레이아웃: [_shared-layout.md](./_shared-layout.md)

### 두 라우트의 차이

| 항목 | `/me/sessions/hosted` | `/me/sessions/joined` | 근거 |
| --- | --- | --- | --- |
| role | `host` | `player` | page.tsx `:6` |
| 데이터 | `getGamesByGm(user.id)` | `getJoinedGames(user.id)` | `my-sessions-view.tsx:44-47` |
| AppBar 제목 | "운영 중인 세션 {N}" | "참여한 세션 {N}" | `:27, :33, :57` |
| 제목 옆 N (headline) | `recruiting` + `confirmed` 탭 건수 합 | `confirmed` 탭 건수 | `my-sessions-view.tsx` `headlineTabs` |
| 탭 (순서 = 기본값 우선) | "모집 중"(`recruiting`) / "확정"(`confirmed`) / "종료"(`closed`) | "확정"(`confirmed`) / "대기"(`waiting`) / "종료"(`closed`) | `session-card.ts:14-23` |
| 기본 탭 | `recruiting` | `confirmed` | `my-sessions-view.tsx:51` |
| 탭 분류 | confirmed → 확정, closed·finished → 종료, 나머지(recruiting·scheduling·pending_confirm) → 모집 중 | closed·finished → 종료, 배지가 세션 D-n(confirmed, 또는 일시 지정형 모집 중에 내가 대기자가 아님) → 확정, 나머지 → 대기 | `session-card.ts` `hostedTabOf` / `joinedTabOf` |
| 카드 링크 | 진행 중(`dim=false`)이면 `/games/{id}/participants`, 종료면 `/games/{id}` | 항상 `/games/{id}` | `src/widgets/session-list/ui/session-list.tsx:6-8` |
| 서브라인 | 상태 단어(굵게) + 인원 또는 일시 | 일시(세션 시각이 있으면)/"일정 미정"(조율형 미확정) + "GM {이름}" | `session-card.ts` `sessionSubline` |
| 대기 순번 배지 | 없음 | 내가 대기자이고 상태가 `confirmed`가 아니면(조율형 확정 전, 또는 일시 지정형 정원 여유) "대기 {n}번". 상태가 `confirmed`면 대기자여도 초록 "D-{n}" | `session-card.ts:84-86, 127-141` |

## 2. 접근 조건

| 조건 | 결과 | 근거 |
| --- | --- | --- |
| 비로그인 | `redirect("/")` (`next` 없음) | `my-sessions-view.tsx:40-41` |
| 로그인 | 본인 데이터만. 타인 목록을 보는 경로 없음 | `:44-47` |
| `?tab=`이 알 수 없는 값이거나 없음 | 에러 없이 역할별 첫 탭으로 대체. URL은 그대로 유지 | `:50-51` |

- notFound 없음. `src/proxy.ts`에는 경로 가드가 없다.
- `/me/sessions` 자체에는 `page.tsx`가 없어 전역 not-found("페이지를 찾을 수 없습니다")가 뜬다(`src/app/me/sessions/`에는 `hosted`, `joined`만 있음).

## 3. 진입 경로와 이탈 경로

### 진입

| 출발 | 요소 | 목적지 | 근거 |
| --- | --- | --- | --- |
| `/me` | "참여 예정인 세션" 더 보기 | `/me/sessions/joined` | `src/views/my-page/ui/my-page-view.tsx:48` |
| `/me` | "운영 중인 세션" 더 보기 | `/me/sessions/hosted` | `:55` |
| `/me` | "지난 세션 N" | `/me/sessions/joined?tab=closed` 또는 `/me/sessions/hosted?tab=closed` | `src/views/my-page/model/my-page-summary.ts:24-27` |
| 같은 페이지 | 탭 칩 | `{basePath}?tab={key}` | `my-sessions-view.tsx:61` |

그 밖에 `src/` 안에서 `/me/sessions`로 가는 링크는 없다(BottomNav, 홈, 게임 상세 모두 없음).

### 이탈

| 요소 | 목적지 | 근거 |
| --- | --- | --- |
| AppBar 뒤로 | `/me` | `my-sessions-view.tsx:57` |
| 세션 카드 | §1 표 "카드 링크" | `session-list.tsx:6-8` |
| BottomNav | `/games`, `/me` (현재 경로가 `/me`로 시작하므로 "마이페이지" 탭 활성) | `src/shared/ui/bottom-nav.tsx:19` |
| 비로그인 | `/` | `my-sessions-view.tsx:41` |

## 4. 데이터

### params / searchParams

| 이름 | 타입 | 파싱 | 기본값 |
| --- | --- | --- | --- |
| `tab` | `string \| undefined` (`Promise<{ tab?: string }>`를 await) | 역할 탭 key 목록에 있는지 `some`으로 확인. 대소문자 변환이나 배열 처리 없음 | host: `recruiting`, player: `confirmed` |

### 조회

| 호출 | 쿼리 | 근거 |
| --- | --- | --- |
| `getGamesByGm` (host) | `games` where `gm_id = user.id`, `created_at desc`, with `gm(username, avatar_url)`, `participants(user_id, status, joined_at)` | `src/shared/server/games.ts:49-58` |
| `getJoinedGames` (player) | `participants` where `user_id = user.id` (confirmed·waiting 모두), `joined_at desc` → `game` + gm + participants | `src/shared/server/games.ts:60-76` |

필터 조건 없이 전체를 가져온 뒤 메모리에서 버킷으로 나눈다. 페이지네이션 없음.

### 카드 필드 (`toSessionCard`, `session-card.ts:59-110`)

| 모델 필드 | 원천 |
| --- | --- |
| `id`, `title`, `round` | `games.id`, `games.title`, `games.round` |
| `state` | `deriveSessionState({ games.confirmed_at, games.end_date, games.max_players, confirmedCount, games.schedule_mode })` (`src/entities/game/model/session.ts:18-41`) |
| confirmedCount | `participants.status = confirmed` 수 (`countConfirmed`) |
| `badge` | §5 SessionBadge |
| `urgent` | 배지가 deadline이고 `games.end_date`까지 0~24시간 (`src/entities/game/model/deadline.ts:4-7`) |
| `lead` / `rest` | 역할·상태별 서브라인 |
| `dim` | state가 `closed` 또는 `finished` |
| GM 이름 | `profiles.username` (gm 관계) ?? `"?"` |
| 대기 순번 | `participants.joined_at` 오름차순 정렬 후 waiting 중 1부터 (`src/entities/game/model/split-roster.ts:18-35`) |

상태 판정 순서(`session.ts` `deriveSessionState`):

1. `confirmed_at`이 있으면
   - 이미 지났으면 `finished`
   - fixed 모드(등록 때부터 `confirmed_at`이 있음)이고 `end_date` 전 + 확정 인원 < 정원이면 `recruiting`
   - fixed 모드이고 `end_date`가 지났는데 확정 인원이 0이면 `closed`
   - 그 외 `confirmed`
2. `end_date`가 지났으면 `closed`
3. 확정 인원 < 정원이면 `recruiting`
4. 그 외 coordinate 모드면 `scheduling`, fixed 모드면 `pending_confirm` (fixed는 보통 `confirmed_at`이 있어 1에서 끝난다)

### 정렬 ("가까운 순", `session-card.ts:200-205, 230-235`)

| 탭 | 키 | 방향 |
| --- | --- | --- |
| `confirmed` | `confirmed_at` | 오름차순 |
| `closed` | `confirmed_at ?? end_date` | 내림차순(최근 것부터) |
| 그 외(`recruiting`, `waiting`) | `end_date` | 오름차순 |

### 대기열(대기 신청) 표시 — `/me/sessions/joined` "대기" 탭

**어떤 카드가 "대기" 탭에 들어가는가.** `joinedTabOf`(`session-card.ts:205-209`)는 종료(`dim`)면 "종료", 배지가 세션 D-n이면 "확정", 나머지는 전부 "대기"다. 배지는 `sessionBadge`(`session-card.ts:127-141`) 순서로 정해진다: ① 종료 → 없음 ② 상태 `confirmed` + `confirmed_at` → 세션 D-n ③ 내가 대기자(`myWait != null`) → "대기 {n}번" ④ 참여자 + `confirmed_at` → 세션 D-n ⑤ 그 외 "마감 D-n". 그래서 "대기" 탭에는 두 종류가 섞인다.

| 카드 | 조건 | 배지 | 서브라인 |
| --- | --- | --- | --- |
| 대기자 본인 · 조율형 | `participants.status = waiting`, `confirmed_at` 없음, 기한 전 | 회색 "대기 {n}번" | "일정 미정 · 마감 {M/D} · GM {이름}" |
| 대기자 본인 · 일시 지정형 | `waiting`, 확정 인원 < 정원(정원을 늘렸거나 대기 행이 남은 경우), 기한 전 → 상태 `recruiting` | 회색 "대기 {n}번" | "{일시} · GM {이름}" (`session-card.ts:187-189`) |
| 확정 참여자 · 조율형 일정 미정 | `status = confirmed`, `confirmed_at` 없음, 기한 전 | "마감 D-{n}"(24시간 이내면 빨강 + 카드 강조) | "일정 미정 · 마감 {M/D} · GM {이름}" |

- 대기자여도 "대기" 탭에 오지 않는 경우: 상태가 `confirmed`(GM이 세션을 확정했거나, 일시 지정형이 정원을 채움)면 ②가 먼저 걸려 초록 "D-{n}" + "{일시} · GM {이름}"으로 **"확정" 탭**에 간다. 일시 지정형 게임에서 대기자가 생기는 정상 경로(정원 초과 신청)는 곧 확정 인원 ≥ 정원이므로 대부분 이쪽이다(`src/entities/game/model/session.ts:38-44`).
- 기한이 지났는데 확정 없음(`closed`)이거나 세션이 지나면(`finished`) 대기자 카드도 "종료" 탭, 배지 없음, 흐린 서브라인이다.
- "대기 {n}번" 배지는 `deadline` 종류가 아니라서 `urgent`가 항상 false다. 마감 24시간 이내여도 대기자 카드는 빨간 강조가 없다(`session-card.ts:89`).
- 대기 순번 `{n}`: `splitRoster`가 참여자 전체를 `joined_at` 오름차순으로 정렬하고 `waiting` 행에만 1부터 매긴다(`src/entities/game/model/split-roster.ts:18-35`). 렌더마다 계산한다.
- 정렬: `end_date` 오름차순(`sortKey`, `session-card.ts:212-216`). 대기자·확정 참여자 구분 없이 섞여 정렬된다.
- 앱바 headline "참여한 세션 {N}"은 `confirmed` 탭만 세므로 "대기" 탭 건수는 들어가지 않는다(`my-sessions-view.tsx:32-37, 54`). 탭 칩에도 건수가 없다.
- 카드 링크: 참여자 역할이라 항상 `/games/{id}`(`src/widgets/session-list/ui/session-list.tsx:6-8`).
- 이 화면에는 대기 전용 동작("대기 취소", "가능 시간 입력")이 없다. 둘 다 상세 액션 존의 대기자 분기에만 있다(`src/views/game-detail/ui/game-action-zone.tsx:76-90`; "가능 시간 입력"은 조율형만).
- 빈 상태: "대기" 탭 0건이면 공용 "해당하는 세션이 없습니다"(대기 전용 문구·CTA 없음).
- 진입: `/me`에서 이 탭으로 바로 오는 링크가 없다. `/me` "더 보기"는 기본 "확정" 탭으로 가고, 그마저 참여 예정이 1건 이상일 때만 보인다([me.md](./me.md) §4 "대기열(대기 신청) 표시").

**카드가 바뀌는 시점** (모두 서버 재렌더 시 반영, 이 경로를 `revalidatePath`하는 액션은 없고 페이지가 `force-dynamic`)

| 사건 | 결과 | 근거 |
| --- | --- | --- |
| 앞 대기자가 취소·승격·다음 회차로 이동 | 같은 탭에서 번호만 당겨진다 | `splitRoster` 재계산 |
| 내가 승격됨(GM "확정으로", 또는 GM이 확정자를 "대기로 이동"·"내보내기"해 대기 맨 앞이 자동 확정) | 조율형 일정 미정: "대기" 탭에 남고 배지가 "마감 D-{n}"으로 바뀜. 일시 지정형: 초록 "D-{n}"으로 "확정" 탭 이동(`/me` "참여 예정"에도 추가) | `adjust-roster.ts:21-71, 143-159` |
| 내가 대기 취소 | 참여 행 삭제 → 세 탭 어디에도 없음 | `src/features/join-game/api/leave-game.ts:24-36` (대기자는 조건 없이 취소 가능, 세션 잠김 후 제외) |
| GM이 세션 확정(조율형) | 여전히 `waiting`이지만 초록 "D-{n}"으로 "확정" 탭 이동 | `confirm-session.ts:14-19`(참여 행 미변경) |
| 모집 기한 경과(확정 없음) | "종료" 탭, 배지 없음, "마감 {M/D} · GM {이름}" | `session.ts:46` |
| GM이 다음 회차를 열어 대기자 승계 | 원본 게임 카드가 사라지고 새 회차 카드("{n}회차" 배지)가 생김. 새 회차 정원 안이면 확정 참여자, 초과면 다시 대기자 | `create-second-round.ts` (원본 참여 행 삭제 + 새 게임에 삽입) |
| 게임 삭제 | FK cascade로 사라짐 | `schema.ts` |

**대기 신청 끔 게임** (`games.waitlist_enabled = false`, 마이그레이션 `drizzle/0009_game_images_waitlist.sql`)

- 카드 모델은 `waitlist_enabled`와 모집 상태 `full`을 쓰지 않는다. 대기 행이 있으면 위 표와 똑같이 "대기 {n}번"으로 보인다.
- 새 대기 신청은 서버가 거부한다("정원이 가득 차 신청할 수 없습니다.", `join-game.ts:49-52`). 그래도 대기 행은 남거나 생길 수 있다: 대기자가 있는 게임을 GM이 "받지 않기"로 수정(`update-game.ts`는 참여 행을 건드리지 않음), GM "대기로 이동"(`demoteParticipant`에 설정 검사 없음), 다음 회차 생성(원본 `waitlistEnabled`를 복사하고 정원 초과분을 `waiting`으로 삽입, `create-second-round.ts:62`).
- 이런 대기자가 상세에서 "대기 취소"를 하면, 정원이 차 있는 한 다시 신청할 수 없다(`join-game.ts:49-52`). 이 목록 화면에는 그런 안내가 없다.

### 캐시

- 두 page.tsx 모두 `export const dynamic = "force-dynamic"` (`:2`).
- 이 경로를 `revalidatePath`하는 액션은 없다(grep 결과 `/me`만 revalidate됨).

## 5. UI 구성 요소

```
AppBar (뒤로 → /me, "{제목} {headline}")
SessionTabFilter (sticky, top 52px)
├─ 탭 Chip ×3 (Link)
└─ "가까운 순 ▾" (정적 텍스트)
Container(size="sm") > div.py-3
└─ EmptyState | SessionList > (Link > SessionCard)×N
```

- **AppBar**: `my-sessions-view.tsx:57`, `src/shared/ui/app-bar.tsx:14-51`
  - 표시: 뒤로 링크(`aria-label="뒤로"`)와 제목. 제목은 "운영 중인 세션 {N}" 또는 "참여한 세션 {N}"(`heading3`, truncate). N은 활성 탭과 무관하게 headline 탭들의 건수 합이다(host: 모집 중 + 확정, player: 확정).
- **SessionTabFilter**: `src/views/my-sessions/ui/session-tab-filter.tsx:7-46`
  - 컨테이너: `sticky top-[52px] z-10`, 하단 테두리, 반투명 배경 + blur, `px-4 py-2.5`. Container 밖이라 화면 전체 폭이다.
  - **탭 Chip**: `:19-33`
    - `Chip asChild`로 `<Link>`를 칩 모양으로 렌더한다. 라벨은 §1 표의 탭 이름이고, 탭별 건수는 표시하지 않는다.
    - 선택된 탭은 `border-gray-900 bg-gray-900 text-surface`, 그리고 `aria-current="page"`.
    - 클릭하면 `{basePath}?tab={key}`로 이동한다(서버 재렌더). 칩 줄은 `overflow-x-auto`.
  - **정렬 라벨**: `:36-43`
    - "가까운 순 ▾" (`body4`, muted, semibold)
    - 클릭할 수 없는 정적 텍스트다. 코드 주석: "정렬은 "가까운 순" 하나뿐 → 정적 라벨. 2번째 옵션 생기면 Select로 교체".
- **EmptyState**: `my-sessions-view.tsx:65-66`, `src/shared/ui/empty-state.tsx:8-46`
  - 활성 탭이 0건이면 표시한다. 점선 카드에 제목 "해당하는 세션이 없습니다"만 있고, 이미지·설명·CTA는 없다(`size="full"` 기본).
- **SessionList**: `src/widgets/session-list/ui/session-list.tsx:10-20`
  - 세로 목록(간격 9px). 각 항목은 `<Link className="block">`으로 감싼 `SessionCard`다.
- **SessionCard**: `src/widgets/session-list/ui/session-card.tsx:8-35`
  - 테두리: 기본은 `rounded-[13px] border-gray-200 p-3.5`, `urgent`면 `border-[1.5px] border-danger-300 bg-danger-50`.
  - 1행: `GameRoundBadge`(round ≥ 2일 때 "{round}회차", `src/entities/game/ui/game-round-badge.tsx:4-11`), 제목(`subtitle1`, truncate), 우측 `SessionBadge`.
  - 2행: `lead`(굵게, `text-gray-600`) + " · " + `rest`. `body4`이고 `dim`이면 hint 색, 아니면 muted. truncate.
- **SessionBadge**: `src/widgets/session-list/ui/session-badge.tsx:15-25` (`"use client"`)

  | kind | 조건 (`session-card.ts:112-136`) | 표시 | 색 |
  | --- | --- | --- | --- |
  | `none` | closed/finished | 렌더 안 함 | — |
  | `session` | state `confirmed` | "D-{dday(confirmed_at)}" | 초록 `bg-success-100 text-success-700` |
  | `waiting` | player이고 내가 waiting(확정 전) | "대기 {n}번" | 회색 |
  | `session` | player이고 `confirmed_at`이 있음(일시 지정형 모집 중), 내가 대기자가 아님 | "D-{dday(confirmed_at)}" | 초록 |
  | `deadline` | 그 외 | "마감 D-{dday(end_date)}" | 24시간 이내면 빨강 `bg-danger-100 text-danger-600`, 아니면 회색 |

  - `dday`는 사용자 로컬 날짜 기준 일수 차이다. 당일이면 "D-0"(`src/shared/lib/format.ts:48-53`).

- **서브라인 문구** (`session-card.ts:151-185`). 날짜 형식: 일시 "8월 16일 (일) 20:00"(KST 24h, `format.ts:2-17`), 마감 "8/17"(`format.ts:20-31`).

  | 역할 | state | lead | rest |
  | --- | --- | --- | --- |
  | host | recruiting | "모집 중" | "{확정} / {정원}명" |
  | host | scheduling | "조율 중" | "{확정} / {정원}명" |
  | host | pending_confirm | "확정 대기" | "신청 {전체 참여자 수}명 · 정원 {정원}명" |
  | host | confirmed, finished | — | "{일시}" |
  | host | closed | — | "마감 {M/D}" |
  | player | confirmed, finished | — | "{일시} · GM {이름}" |
  | player | closed | — | "마감 {M/D} · GM {이름}" |
  | player | recruiting (일시 지정형, `confirmed_at` 있음) | — | "{일시} · GM {이름}" |
  | player | recruiting, scheduling, pending_confirm (`confirmed_at` 없음) | — | "일정 미정 · 마감 {M/D} · GM {이름}" |

## 6. 상태별 화면

| 상태 | 화면 |
| --- | --- |
| 로딩 | `src/app/me/**`에 `loading.tsx` 없음. 탭 전환도 서버 왕복이며 전환 중 표시가 없다 |
| 빈 상태 | 활성 탭 0건이면 "해당하는 세션이 없습니다". 전체 0건이어도 같은 문구이고 CTA 없음 |
| 에러 | 전역 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도" |
| 잘못된 tab | 첫 탭으로 대체 표시 |
| 도메인: 모집 중/조율 중/확정 대기 | host는 "모집 중" 탭, player는 "대기" 탭(단, 일시 지정형 모집 중에 확정 참여했으면 "확정" 탭). lead 문구로 구분(host만) |
| 도메인: 확정 | 두 역할 모두 "확정" 탭, 초록 D-n |
| 도메인: 무산(closed)·플레이 완료(finished) | "종료" 탭, 배지 없음, 흐린 서브라인. host 카드는 상세(`/games/{id}`)로 이동 |
| 도메인: 마감 24시간 이내 | 빨강 카드 + 빨강 "마감 D-n" |
| 도메인: 대기자 | player "대기" 탭에서 "대기 {n}번" 배지. 조율형에서 확정 참여자이지만 일정 미정인 카드도 같은 "대기" 탭에 "마감 D-n" 배지로 섞인다 |
| 대기열(대기 신청) 표시 | 세션이 확정된(`confirmed`) 게임의 대기자는 "확정" 탭에 초록 D-n. 기한 경과·세션 종료면 "종료" 탭. 대기 신청 끔 게임도 표시 규칙이 같다. 상세는 §4 "대기열(대기 신청) 표시" |
| 권한별 | host/player 라우트 분리(§1 표). GM은 자기 구인글에 참여할 수 없어서("GM은 참여자로 참여할 수 없습니다.", `src/features/join-game/api/join-game.ts:32-33`) 한 게임이 두 목록에 함께 나오지 않는다 |

## 7. 폼과 유효성 검사

폼 없음. `tab` 파라미터 화이트리스트 검사만 한다(§4).

## 8. 액션과 부수효과

Server Action, 토스트, revalidatePath, Discord Webhook 모두 없다. 탭은 링크 이동뿐이다.

## 9. 반응형과 접근성 현황

- 목록은 `Container size="sm"`(`max-w-2xl`, `px-4`)이고, 탭 바는 전체 폭 sticky다(`session-tab-filter.tsx:17`). 브레이크포인트 분기 없음.
- 칩 줄은 가로 스크롤(`overflow-x-auto`)이 되고, 정렬 라벨은 `shrink-0 whitespace-nowrap`이다.
- 탭은 `role="tablist"`/`tab`이 아니라 링크 목록이다. 선택은 `aria-current="page"`로 표시된다.
- "가까운 순 ▾"는 ▾ 글리프 때문에 조작 가능한 컨트롤처럼 보이지만 텍스트일 뿐이고, 스크린리더는 "▾"를 그대로 읽는다.
- 헤딩 요소가 없다(AppBar 제목은 `<span>`).
- 카드 전체가 링크 하나라서 링크 이름은 제목·배지·서브라인을 모두 이어 붙인 텍스트가 된다.
- 배지 색만으로 확정(초록)과 마감(회색/빨강)을 구분하지 않고 텍스트("D-", "마감 D-")도 있다.
- `SessionBadge`가 클라이언트에서 D-n을 계산한다. 서버 렌더와 날짜 경계에서 값이 다를 수 있다. ❓ 확인 필요: hydration 경고 여부.

## 10. 현재 UX 문제점 메모

- 제목 옆 숫자가 기본 탭 건수로 고정돼 있다. 예를 들어 `/me/sessions/joined?tab=closed`에서도 "참여한 세션 {확정 건수}"가 나온다(`my-sessions-view.tsx:20-21, 53`).
- host 라우트 제목은 "운영 중인 세션"인데 "확정"과 "종료" 탭도 담는다. player 제목 "참여한 세션"은 과거형인데 예정 세션이 기본 탭이다.
- player "대기" 탭은 대기자(`participants.status = waiting`)만이 아니라 조율형에서 일정이 미확정인 확정 참여자 게임도 포함한다(`session-card.ts` `joinedTabOf`). 탭 이름과 용어집의 "대기자"가 어긋난다.
- host "모집 중" 탭에 정원이 찬 "조율 중", "확정 대기" 게임도 들어간다.
- 탭에 건수가 없어서 비어 있는 탭을 눌러봐야 알 수 있다.
- "가까운 순 ▾"는 정적 라벨인데 드롭다운처럼 보인다(`session-tab-filter.tsx:36-43`).
- 빈 상태에 CTA가 없다. `/me`의 빈 상태에는 "구인 목록 보기"·"새 구인 등록"이 있다.
- host 카드 클릭 시 진행 중이면 상세가 아니라 참여자 관리(`/games/{id}/participants`)로 바로 간다. 종료 카드만 상세로 가서 같은 목록 안에서 목적지가 다르다(`session-list.tsx:6-8`).
- 서브라인도 용어집과 같이 "GM"을 쓴다.
- 이 두 라우트로 가는 링크는 `/me`에만 있다(§3). `/me/sessions` 인덱스는 404다.
- 전체 목록을 한 번에 가져와 메모리에서 분류하며 페이지네이션이 없다(`games.ts:49-76`).
- 대기열(대기 신청) 표시 관련:
  - "대기" 탭으로 바로 오는 링크가 앱 안에 없다(`?tab=waiting` 참조 0건).
  - 세션 확정 후에도 `waiting`인 사용자는 "확정" 탭에서 확정 참여자와 같은 초록 "D-{n}" 카드로 보이고, headline 숫자에도 세어진다(`session-card.ts:128-130`).
  - 대기자 카드("대기 {n}번")는 마감 24시간 이내여도 빨간 강조가 없다. 같은 탭의 확정 참여자 카드("마감 D-n")만 강조된다(`session-card.ts:89`).
  - 카드에서 대기 취소나 가능 시간 입력을 할 수 없고 상세로 들어가야 한다.
  - 대기 신청 끔 게임에서 대기 취소 후 재신청이 막히는 점이 목록에 드러나지 않는다(`toSessionCard`가 `waitlist_enabled`를 읽지 않음).
