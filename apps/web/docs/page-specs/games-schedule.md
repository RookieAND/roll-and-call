# 일정 조율 (`/games/[id]/schedule`)

> 공통 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md)를 참고한다.

## 1. 개요

`schedule_mode = coordinate`인 구인글에서 참여자와 GM이 가능한 시간을 30분 단위 격자에 칠하는 화면이다(When2Meet 방식). 전체 겹침을 히트맵으로 보여 주고, GM은 겹침 인원이 많은 후보 중 하나로 확정 세션을 정한다.

라우트 파일은 `src/app/games/[id]/schedule/page.tsx:1-5`이다. `params.id`를 `GameScheduleView`(`src/views/game-schedule/ui/game-schedule-view.tsx:16`)에 넘긴다.

## 2. 접근 조건

로그인하지 않아도 볼 수 있다. 게임 존재 여부, 일정 방식, 역할에 따라 화면이 달라진다.

| 조건 | 결과 | 근거 |
|---|---|---|
| 게임 없음 | `notFound()` → 전역 not-found | `game-schedule-view.tsx:17-18` |
| `schedule_mode !== coordinate` 또는 `range_start`/`range_end` 중 하나라도 null | AppBar와 "일시가 지정된 게임이라 조율이 필요 없어요."만 표시 | `game-schedule-view.tsx:21-37` |
| 확정 세션 있음(`confirmed_at`) — 모든 사용자 | 확정 안내와 읽기 전용 히트맵. 편집 불가 | `schedule-body.tsx:45-55` |
| 미확정 + GM 또는 참여자(확정·대기 모두) = `involved` | 탭 "내 가능 시간" / "전체 겹침". 칠하기와 저장 가능 | `game-schedule-view.tsx:41-42`, `schedule-body.tsx:57-72` |
| 미확정 + 비참여 로그인 사용자 또는 비로그인 | 겹침(또는 빈 상태)과 안내 "참여자만 가능 시간을 입력할 수 있습니다." 로그인 CTA는 없다 | `schedule-body.tsx:74-79` |
| GM + 미확정 | 위 탭 화면 아래에 "세션 확정" 폼이 추가된다 | `game-schedule-view.tsx:54,71` |

- 참여 여부는 `hasUserJoined`로 판정하는데 `participants`의 status를 보지 않는다(`src/entities/game/model/has-user-joined.ts:8`). 대기자도 입력할 수 있다.
- 마감(`end_date`) 경과는 화면과 서버 어디서도 검사하지 않는다.

## 3. 진입 경로와 이탈 경로

### 진입
| 출발 | 요소(라벨) | 조건 | 근거 |
|---|---|---|---|
| 구인 상세 하단 액션 바 (GM) | "일정 조율 현황" | GM + coordinate + 미확정 | `src/views/game-detail/ui/game-detail-actions.tsx:22,30` |
| 구인 상세 액션 존 (확정됨) | "일정 조율 보기" | 세션 확정 + coordinate | `src/views/game-detail/ui/game-action-zone.tsx:57-69` |
| 구인 상세 액션 존 (대기자 본인) | "가능 시간 입력" | viewer가 waiting + coordinate | `game-action-zone.tsx:72-86` |
| 구인 상세 액션 존 (참여 완료) | "일정 조율하기"(primary 버튼, 직접 `Link`) | viewer가 confirmed + coordinate | `game-action-zone.tsx:103-114` |
| 홈 대시보드 게임 행 | "일정 조율하기"(기본 라벨) | `role === "player"` + `canCoordinateSchedule`(coordinate + 미확정 + 모집 마감 아님) | `src/views/home/ui/game-list-item.tsx:35-57`, `src/entities/game/model/can-coordinate-schedule.ts:17` |

`GameScheduleLink`는 `src/features/coordinate-session/ui/game-schedule-link.tsx:6-21`에 있고 tinted 버튼 + ChevronRight 모양이다.

### 이탈
| 요소 | 목적지 | 근거 |
|---|---|---|
| AppBar 뒤로 | `/games/{id}` | `game-schedule-view.tsx:20` |
| "이 시간으로 확정" 성공 | `router.push("/games/{id}")` | `src/features/confirm-session/ui/confirm-session-form.tsx:34`, `api/confirm-session.ts:26` |
| BottomNav | [_shared-layout.md](./_shared-layout.md) | — |

## 4. 데이터

### 조회
1. `getGameById(id)` (`src/shared/server/games.ts:80-91`): `games` 전체 + `gm { username, avatarUrl }` + `participants { userId, joinedAt, status }` + `participants.user { username, avatarUrl }`
2. `getCurrentUser()` (조율 모드일 때만 호출)
3. `Promise.all`로 두 쿼리를 함께 실행
   - `getGameAvailabilities(id)` (`src/shared/server/availabilities.ts:6-11`): `availabilities`에서 `game_id = id`인 전체 행 + `user { username }`
   - 로그인 상태면 `getUserConfirmedSlots(user.id, id)` (`availabilities.ts:15-32`): **다른** 게임 중 이 사용자가 GM이거나 참여자(status 무관)이고 `confirmed_at IS NOT NULL`인 게임의 `confirmed_at` 목록(DISTINCT, ISO). 비로그인은 `[]`. 비참여 로그인 사용자도 이 쿼리는 실행된다

### 가공
| 값 | 출처 | 가공 | 근거 |
|---|---|---|---|
| `days` (열) | `games.range_start`, `games.range_end` (date) | 시작일부터 종료일까지 **양 끝 포함** 하루씩. UTC Date로 계산해 DST 영향 없음. 61열에서 중단(`cols.length > 60`이면 break) | `src/shared/lib/slots.ts:13-34` |
| `timeRows` (행) | 상수 | 12:00부터 23:30까지 30분 간격, 24행. 라벨 `HH:MM` | `slots.ts:3-5,36-44` |
| 칸 키 `slotKey` | `day.date` + 행 시각 | `new Date("YYYY-MM-DDTHH:MM:00+09:00").toISOString()`. KST 벽시계 시각을 UTC ISO로 바꾼 값이다(예: 9/9 20:00 KST → `2026-09-09T11:00:00.000Z`) | `slots.ts:48-50`, `src/shared/ui/slot-grid.tsx:48` |
| `aggregate.counts` | `availabilities.slot_start` | ISO별 행 수 | `src/entities/availability/model/aggregate-availability.ts:14-17` |
| `aggregate.names` | `profiles.username` | ISO별 이름 배열. 이름이 없으면 "?" | 같은 파일 `:17` |
| `aggregate.mine` | `availabilities.user_id = viewer` | 본인이 고른 ISO 목록 | `:18` |
| `blocked` | `getUserConfirmedSlots` | 다른 확정 세션의 **시작 시각** ISO. 해당 시각과 정확히 같은 칸 1개만 잠긴다(플레이 시간은 반영하지 않음) | `availabilities.ts:31` |
| 확정 후보 `confirmOptions` | `aggregate.counts` | `rankSlots`: 인원 내림차순, 동률이면 ISO 문자열 오름차순(이른 시각), 상위 5개. 라벨 `"{formatDateTime} · {n}명 가능"` | `src/entities/availability/model/rank-slots.ts:1-15`, `game-schedule-view.tsx:50-53` |
| `canConfirm` | GM 여부, `games.confirmed_at` | `isGm && !confirmedAt` | `game-schedule-view.tsx:54` |
| AppBar 제목 | `games.title` | `"{title} · 일정 조율"` | `:20` |

- 조회는 하지만 쓰지 않는 값: `gm`, `participants.user`, `participants.joinedAt/status`(참여 여부 판정에는 userId만 사용), `DayColumn.label`(`slots.ts:26`에서 만들지만 `SlotGrid`는 `dow`와 `md`만 표시).
- `counts`에는 조율 기간이나 12~24시 창 밖의 슬롯도 들어갈 수 있다. 예를 들어 `createSecondRound`가 이전 회차 슬롯을 그대로 복사한다(`src/features/create-second-round/api/create-second-round.ts:81-92`). 이런 슬롯은 그리드에는 안 보이지만 확정 후보와 `hasResponses` 판정에는 들어간다.
- params: `id`. searchParams는 쓰지 않는다.

### 캐시
- `dynamic`/`revalidate` export가 없다. `getCurrentUser`의 `cookies()` 때문에 동적 렌더링이 된다. ❓ 확인 필요: 빌드 출력에서 동적 분류 여부.
- 이 경로를 revalidate하는 곳: `saveAvailability`(`/games/{id}/schedule`만, `save-availability.ts:43`), `confirmSession`(`/games/{id}`, `/games/{id}/schedule`, `/games`, `confirm-session.ts:23-25`).
- 참여 신청이나 취소(`join-game.ts`, `leave-game.ts`)는 이 경로를 revalidate하지 않는다.

## 5. UI 구성 요소

```
AppBar
(비조율) Container(md) > "일시가 지정된 게임이라 조율이 필요 없어요."
(조율)   Container(기본 size="lg") > VStack(gap=6, py-6)
├─ ConfirmedSessionNotice            (confirmed_at 있을 때)
├─ ScheduleBody
│  ├─ [확정됨]   ScheduleOverlap(확정 힌트)
│  ├─ [involved] ScheduleTabs
│  │   ├─ 탭 "내 가능 시간" → AvailabilityGrid (SlotGrid)
│  │   └─ 탭 "전체 겹침"   → ScheduleOverlap | ScheduleOverlapEmpty
│  └─ [열람자]  ScheduleOverlap | ScheduleOverlapEmpty + StatusNotice
└─ ConfirmSessionForm                (GM + 미확정)
```

- **AppBar** — `src/views/game-schedule/ui/game-schedule-view.tsx:20` / 뒤로 버튼(aria-label "뒤로")과 제목 "{구인글 제목} · 일정 조율". 뒤로 버튼이 있으면 제목은 truncate(`src/shared/ui/app-bar.tsx:44`) / 뒤로를 누르면 `/games/{id}`.

- **비조율 안내** — `game-schedule-view.tsx:28-34` / "일시가 지정된 게임이라 조율이 필요 없어요." 인터랙션 없음.

- **ConfirmedSessionNotice** — `src/entities/game/ui/confirmed-session-notice.tsx:5-15` / 초록 박스(`StatusNotice tone="success"`), 1행 "세션 확정", 2행 `formatDateTime(confirmed_at)` → "8월 16일 (일) 20:00"

### SlotGrid (공통 격자 뼈대) — `src/shared/ui/slot-grid.tsx:7-53`
- 바깥 `div.overflow-x-auto` 안에 CSS grid가 있다. `gridTemplateColumns: 40px repeat({일수}, minmax(0, 1fr))`, `min-w-full select-none`.
- 첫 행: 빈 칸 + 날짜 헤더. 날짜 헤더는 요일 한 글자(hint 색, 예: "수")와 그 아래 `M/D`(예: "9/9")를 표시한다.
- 이후 24행: 왼쪽 시각 라벨은 정시에만 "12:00"…"23:00"을 찍고, 30분 행은 빈 문자열이다. 그 옆에 날짜 수만큼 `renderCell(slotKey)`가 들어간다.
- 열이 `minmax(0,1fr)`이라 칸이 컨테이너 폭에 맞춰 줄어든다. 따라서 가로 스크롤은 사실상 생기지 않는다(10장 참고).

### 탭 — `src/views/game-schedule/ui/schedule-tabs.tsx:11-40`
- 회색 트랙 안의 세그먼트 버튼 2개: "내 가능 시간" / "전체 겹침". 기본 선택은 "내 가능 시간". 선택된 탭은 흰 배경, 진한 글자, 그림자.
- `role="tablist"`, 각 버튼에 `role="tab"`, `aria-selected`.
- 누르면 로컬 state가 바뀐다. 두 패널은 **둘 다 렌더링된 상태**이고 `hidden` 클래스로만 전환한다. 그래서 탭을 오가도 칠한 내용(미저장 포함)이 유지된다. URL/searchParams에는 반영되지 않는다.

### AvailabilityGrid (내 가능 시간) — `src/features/coordinate-session/ui/availability-grid.tsx:22-88`
- **안내 문구** `:61-65` — "클릭하거나 드래그해서 가능한 시간을 칠하세요. 30분 단위, 다시 누르면 지워집니다."
- **칸** `:46-57` — 높이 22px, 왼쪽·아래 1px 회색 테두리, `touch-none`(터치 스크롤과 확대 제스처를 막음). 칸 색은 다음 순서로 결정된다.
  - 잠긴 칸(`blocked`): `bg-gray-300`, `cursor-not-allowed`
  - 선택된 칸: `bg-primary-600`
  - 그 외: `bg-surface`, `cursor-pointer`, hover 시 `bg-primary-50`
  - 잠긴 칸은 선택 여부와 관계없이 회색으로 보인다.
- **칠하기 동작** — `src/features/coordinate-session/model/use-slot-painter.ts:7-71`
  1. `pointerdown`(마우스·터치·펜 공통): 잠긴 칸이거나 readOnly면 무시한다. `releasePointerCapture(pointerId)`로 포인터 캡처를 해제한다. 터치는 기본적으로 누른 요소에 캡처되기 때문에, 해제해야 옆 칸에서 `pointerenter`가 발생한다. 그다음 **드래그 모드 = 누른 칸의 현재 선택 상태의 반대**로 정한다(비어 있던 칸이면 칠하기, 칠해진 칸이면 지우기). 누른 칸에 바로 적용한다.
  2. `pointerenter`: `event.buttons !== 0`(버튼이나 접촉이 눌린 상태)이고 모드가 설정돼 있으면 같은 모드로 그 칸을 추가하거나 제거한다. 잠긴 칸은 건너뛴다.
  3. 종료: `window`의 `pointerup` / `pointercancel`에서 모드를 해제한다. 그리드 밖에서 손을 떼도 드래그가 끝난다.
  - 칸 사이를 보간하지 않는다. 빠르게 드래그해서 `pointerenter`가 발생하지 않은 칸은 칠해지지 않는다.
  - 선택 상태는 클라이언트 `Set<string>`이다. 초기값은 서버의 `aggregate.mine`이다.
- **선택 요약** `:71-73` — "선택 {n}칸 · 회색은 다른 확정 세션과 겹침". n에는 잠긴 칸이면서 이미 저장돼 있던 선택도 포함된다.
- **저장 버튼** `:74-83` — "가능 시간 저장", lg, 높이 48px, 전체 폭. 현재 선택이 마지막 저장 상태와 같으면(`dirty === false`) disabled, 진행 중이면 로딩 표시 / 누르면 `saveAvailability(gameId, [...selected])` 호출. 성공하면 `markSaved`로 저장 기준을 갱신하고 토스트 "가능 시간을 저장했습니다". 실패하면 에러 토스트.
- `readOnly` prop이 있으면 안내·요약·버튼이 숨겨지지만, 현재 호출부(`schedule-body.tsx:61-67`)는 이 prop을 넘기지 않는다.

### ScheduleOverlap (전체 겹침) — `src/views/game-schedule/ui/schedule-overlap.tsx:8-36`
- **힌트** — 상태별로 다르다
  - 미확정: "색이 진할수록 많은 인원이 가능합니다. 칸을 누르면 이름이 보입니다." (`schedule-body.tsx:35`)
  - 확정: "확정된 슬롯은 초록 테두리로 표시됩니다. 편집은 잠깁니다." (`schedule-body.tsx:48`)
- **HeatLegend** — `src/views/game-schedule/ui/heat-legend.tsx:5-22` / "겹침" 글자 뒤에 16px 색 견본 6개(0~5단계). 숫자 라벨은 없다.
- **Heatmap** — `src/views/game-schedule/ui/heatmap.tsx:21-59`
  - 칸: 높이 22px, 가운데 정렬, 굵은 `text-xs`. 인원이 1명 이상이면 숫자를 표시하고, 0명이면 빈 칸이다.
  - 배경: `heatColor(count)` = `var(--color-heat-{min(5, max(0, count))})`. 5명 이상은 모두 5단계다(`src/views/game-schedule/model/heat-scale.ts:3-10`).
  - 글자색: 5 이상은 `--color-heat-ink-strong`(흰색), 그 외는 `--color-heat-ink`(`heat-scale.ts:13-15`).
  - 토큰 값(`packages/ui/src/styles.css:78-88, 135-141`):

    | 단계 | 라이트 | 다크 |
    |---|---|---|
    | 0 | `#ffffff` | `#1e1e26` |
    | 1 | `#edeefc` | `#262649` |
    | 2 | `#d8dafa` | `#2f2f66` |
    | 3 | `#b7baf5` | `#3c3c8c` |
    | 4 | `#8e92ef` | `#4b4bb5` |
    | 5 | `#5b60e4` | `#6a6fe8` |
    | ink | `#2b2d78` | `#c7d2fe` |
    | ink-strong | `#ffffff` | `#ffffff` |

  - 인원 규모에 따른 정규화는 없다. 인원 수 절대값이 곧 단계다.
  - `title` 속성: 가능한 사람 이름을 ", "로 이은 문자열(마우스 hover 툴팁).
  - 클릭: 인원이 1명 이상인 칸이면 그 칸을 선택하고, 0명인 칸이면 선택을 해제한다.
  - 테두리: 확정 슬롯(`confirmed_at` ISO와 같은 칸)과 사용자가 누른 칸 모두 `2px solid var(--color-success-600)` 안쪽 outline이다. 두 표시의 모양이 같다.
  - **하단 명단 줄** `:52-56`: 선택한 칸이 있으면 "{formatDateTime} · {n}명: 이름1, 이름2", 없으면 "칸을 누르면 그 시간에 가능한 사람을 볼 수 있어요."
- 히트맵은 서버 집계(저장된 값)만 보여 준다. "내 가능 시간" 탭에서 저장하지 않은 변경은 반영되지 않는다. 저장하면 `revalidatePath` 후 서버 컴포넌트가 다시 렌더링되면서 반영된다. ❓ 확인 필요: 저장 후 같은 화면에서 서버 컴포넌트 새로고침이 자동으로 일어나는지(서버 액션의 revalidatePath가 현재 라우트를 refresh하는 동작).

### ScheduleOverlapEmpty — `src/views/game-schedule/ui/schedule-overlap-empty.tsx:3-13`
- `EmptyState size="section"`: 이미지 `/empty-states/empty-schedule.png`(104px, alt "아직 응답한 참여자가 없습니다"), 제목 "아직 응답한 참여자가 없어요", 설명 "참여자가 가능 시간을 입력하면 여기에 겹침이 표시됩니다.", 점선 테두리 카드.
- 조건: `Object.keys(aggregate.counts).length === 0`(`schedule-body.tsx:32`). 확정 상태에서는 이 빈 상태를 쓰지 않고 항상 히트맵을 보여 준다.

### 열람자 안내 — `schedule-body.tsx:77`
- `StatusNotice tone="muted"`: "참여자만 가능 시간을 입력할 수 있습니다."

### ConfirmSessionForm (세션 확정) — `src/features/confirm-session/ui/confirm-session-form.tsx:11-75`
- 후보 0개: 박스 없이 텍스트만 "아직 등록된 가능 시간이 없어 확정할 수 없어요." (`:17-23`)
- 후보가 있을 때 테두리 박스 안의 구성
  - 제목 "세션 확정", 설명 "겹치는 인원이 많은 순으로 후보를 보여줍니다."
  - **Select** (`@trpg/ui` Select, Base UI 기반): 항목은 최대 5개, 라벨 "8월 16일 (일) 20:00 · 3명 가능". 기본값은 1순위 후보다.
  - **확정 버튼** "이 시간으로 확정": `variant="confirm"`(초록 solid), 높이 46px, 전체 폭, 진행 중 로딩 표시. 확인 다이얼로그는 없다.
  - **인라인 에러** `:68-72`: 빨간 body2 텍스트(토스트가 아님)
- 성공하면 토스트 "세션이 확정되었습니다", `/games/{id}`로 push.

## 6. 상태별 화면

| 상태 | 화면 |
|---|---|
| 로딩 | 전용 `loading.tsx`가 없다. 상위 `src/app/games/[id]/loading.tsx`가 적용되어 AppBar "구인 상세"(뒤로 `/games`)와 상세 페이지 스켈레톤이 보인다. 격자 모양 스켈레톤은 없다 |
| 에러 | 전역 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도" |
| 404 | 전역 not-found: "페이지를 찾을 수 없습니다" |
| 비조율 게임(fixed) 또는 범위 null | "일시가 지정된 게임이라 조율이 필요 없어요." |
| 응답 0건 · involved | "내 가능 시간" 탭은 빈 격자. "전체 겹침" 탭은 ScheduleOverlapEmpty. GM이면 확정 폼 자리에 "아직 등록된 가능 시간이 없어 확정할 수 없어요." |
| 응답 0건 · 열람자 | ScheduleOverlapEmpty와 StatusNotice |
| 응답 있음 · involved | 탭 화면. GM이면 탭 아래 확정 폼 |
| 응답 있음 · 열람자(비로그인 포함) | 힌트, 범례, 히트맵, StatusNotice |
| 다른 확정 세션과 겹침 | 내 격자에서 해당 시작 시각 칸이 회색으로 잠긴다 |
| 세션 확정 | 모든 사용자에게 ConfirmedSessionNotice와 확정 힌트, 범례, 히트맵(초록 outline). 응답 0건이어도 빈 히트맵이 보인다. 확정 폼, 탭, 저장 버튼은 모두 없다 |
| 마감 경과(미확정) | 미확정 상태와 동일하다. 입력·저장·확정 모두 가능 |
| 권한별 | GM: 탭 + 확정 폼 / 참여자(확정·대기): 탭 / 그 외: 읽기 전용 겹침 + 안내 |

## 7. 폼과 유효성 검사

### 가능 시간 저장 (`saveAvailability`, `src/features/coordinate-session/api/save-availability.ts:8-45`)
| 검사 | 문구 |
|---|---|
| 비로그인 | "로그인이 필요합니다." |
| 게임 없음 | "존재하지 않는 게임입니다." |
| `schedule_mode !== coordinate` | "일시가 지정된 게임은 조율 대상이 아닙니다." |
| `confirmed_at` 있음 | "이미 일정이 확정된 게임입니다." |
| GM도 참여자도 아님 | "참여자만 가능 시간을 등록할 수 있습니다." |
| 유효하지 않은 시각 문자열 | 에러 없이 조용히 제외 |
| 2000개 초과 | 앞의 2000개만 저장(조용히 잘림) |

- 서버는 슬롯이 조율 기간, 12~24시 창, 30분 경계, `blocked`에 속하는지 검증하지 않는다.
- 클라이언트 쪽 제약: 저장 버튼은 변경이 있을 때만 활성화된다. 잠긴 칸은 새로 칠하거나 지울 수 없다.
- 에러 표시는 토스트다.

### 세션 확정 (`confirmSession`, `src/features/confirm-session/api/confirm-session.ts:7-27`)
| 검사 | 문구 |
|---|---|
| 비로그인 | "로그인이 필요합니다." |
| `slotIso`가 날짜로 파싱되지 않음 | "잘못된 시간입니다." |
| `games.id = id AND gm_id = user.id` 조건으로 업데이트된 행이 0개 | "확정 권한이 없습니다." (게임이 없을 때도 같은 문구) |

- 서버는 `schedule_mode`, 기존 `confirmed_at` 존재 여부, 슬롯이 후보나 범위에 속하는지를 검사하지 않는다.
- 클라이언트는 상위 5개 후보만 Select로 고를 수 있다.
- 에러 표시는 폼 아래 인라인 텍스트다.

## 8. 액션과 부수효과

| 액션 | 트리거 | DB 변경 | 토스트 | redirect | revalidatePath | Discord |
|---|---|---|---|---|---|---|
| `saveAvailability(gameId, slotIsos)` | "가능 시간 저장" | 트랜잭션: `availabilities`에서 `(game_id, user_id)` 행 전체 DELETE 후 선택 슬롯 INSERT(전체 교체) | 성공 "가능 시간을 저장했습니다" / 실패 `result.error` | 없음 | `/games/{id}/schedule` | 없음 |
| `confirmSession(gameId, slotIso)` | "이 시간으로 확정" | `games.confirmed_at = slot`, `games.notified_at = null`. 주석(`:16`)에 따르면 재확정할 때 1시간 전 알림을 다시 켜기 위한 것이다 | 성공 "세션이 확정되었습니다" / 실패는 인라인 텍스트 | 클라이언트 `router.push("/games/{id}")` | `/games/{id}`, `/games/{id}/schedule`, `/games` | 확정 즉시 보내는 알림은 없다. 이후 cron `src/app/api/cron/session-reminders/route.ts:29-35`가 `confirmed_at`이 1시간 이내이고 `notified_at IS NULL`인 게임에 "⏰ 곧 시작! **{title}** 세션이 {formatDateTime}에 시작해요." 알림을 보낸다(`src/shared/server/discord-notify.ts:153`). ❓ 확인 필요: cron 실행 주기(Vercel Hobby 제한) |

- 확정 이후에는 `canConfirm`이 false라서 이 화면에서 다시 확정할 방법이 없다. 재확정에 대비한 `notified_at` 리셋은 이 UI 기준으로 닿지 않는 경로다.

## 9. 반응형과 접근성 현황

- 컨테이너: 조율 화면은 `Container` 기본 크기 `lg`(max-w-6xl), 비조율 안내는 `size="md"`(max-w-4xl)다(`packages/ui/src/container.tsx:4-10`). 두 화면의 최대 폭이 다르다.
- 격자: 시각 열 40px 고정, 날짜 열은 `minmax(0,1fr)`로 균등 분할한다. 14일 범위를 폭 약 400px 화면에 넣으면 칸 폭이 약 23px 안팎이다(시각 열 40px과 좌우 패딩 32px을 뺀 값 기준 계산). 최대 61일까지 열이 늘어날 수 있는데 최소 폭이 없어 칸이 매우 좁아질 수 있다. `overflow-x-auto`는 있지만 열이 줄어들기 때문에 스크롤이 생기지 않는다.
- 칸 높이 22px × 24행 = 격자 본문 528px. 헤더와 안내 문구를 더하면 모바일에서 세로 스크롤이 필요하다. `touch-none` 칸 위에서는 손가락으로 페이지를 스크롤할 수 없어서, 시각 열·헤더·격자 바깥을 잡고 스크롤해야 한다.
- 터치: 포인터 이벤트로 드래그 칠하기를 지원한다(5장). 히트맵 칸은 `onClick`으로 명단을 보여 준다(모바일에는 hover 툴팁이 없어서 대체한 방식, `heatmap.tsx:23`).
- 접근성
  - 격자 칸은 모두 `div`다. role, 키보드 포커스, `aria-pressed`/`aria-label`이 없어 키보드나 스크린리더로 입력하거나 조회할 수 없다(`availability-grid.tsx:56`, `heatmap.tsx:32-45`).
  - 탭은 `role="tab"`과 `aria-selected`만 있다. `aria-controls`, `role="tabpanel"`, 방향키 이동은 없다.
  - 선택·잠금·확정 상태를 색으로만 구분한다(잠금은 회색, 선택은 primary, 확정은 초록 outline). 확정 outline과 누른 칸 outline이 같은 모양이다.
  - 히트맵은 숫자를 함께 보여 줘서 색만으로 판단하지 않아도 된다. 범례에는 숫자가 없다.
  - `select-none`이 적용되어 격자 텍스트를 선택할 수 없다.
  - 저장·확정 버튼은 `@trpg/ui` Button의 `loading` 상태에서 disabled가 된다(`packages/ui/src/button.tsx:65`).

## 10. 현재 UX 문제점 메모

1. 로딩 스켈레톤이 상위 `[id]/loading.tsx`("구인 상세", 뒤로 `/games`)를 물려받아 이 화면과 모양이 다르다.
2. coordinate 모드인데 `range_start`/`range_end`가 null이면 "일시가 지정된 게임이라…"라는 잘못된 안내가 뜬다(`game-schedule-view.tsx:21-31`).
3. 비로그인이나 비참여자에게는 안내만 있고 로그인이나 참여 신청으로 가는 CTA가 없다(`schedule-body.tsx:77`).
4. 이전 회차에서 복사된 조율 기간 밖 슬롯이 `counts`에 남는다. 그래서 그리드에 보이지 않는 시각이 확정 후보에 오르거나, 겹침이 비어 보이는데 빈 상태 대신 빈 히트맵이 뜰 수 있다.
5. `blocked`는 다른 확정 세션의 시작 30분 칸 하나만 막고 플레이 시간을 반영하지 않는다. 이미 저장해 둔 선택이 잠긴 칸에 있으면 회색으로만 보이고 계속 저장된다.
6. 드래그 중 칸 보간이 없어 빠르게 움직이면 칸이 빠진다.
7. 격자 칸이 `touch-none`이어서 모바일에서 격자 위 세로 스크롤이 막힌다.
8. 긴 조율 기간(최대 61열)에서도 가로 스크롤 대신 칸이 좁아진다. 열 최소 폭이 없다.
9. "전체 겹침" 탭은 저장한 값만 반영한다. 칠하고 저장하지 않은 채 탭을 옮기면 차이가 드러나지 않고, 페이지를 떠날 때 미저장 경고도 없다.
10. 히트맵 5단계 상한은 절대 인원 기준이라 인원이 적은 게임(예: 정원 3)에서는 최대 단계에 도달하지 않는다. 범례에도 숫자가 없어 색이 몇 명을 뜻하는지 알 수 없다.
11. 확정 슬롯 표시와 "누른 칸" 표시가 같은 초록 outline이라 구분되지 않는다.
12. 세션 확정에 확인 단계가 없다. 후보가 상위 5개로 고정되어 GM이 다른 시각을 고를 수 없다. 에러는 인라인, 성공은 토스트로 표시 방식이 섞여 있다.
13. 확정 후에는 재확정이나 확정 취소 UI가 없다. 서버의 `notified_at` 리셋 의도와 맞지 않는다.
14. 세션을 확정해도 참여자에게 즉시 가는 Discord 알림이 없다. 1시간 전 cron 알림만 있다.
15. 마감(`end_date`)이 지나도 입력과 확정이 계속 가능하다. 반면 홈 목록의 조율 CTA는 모집 마감이면 숨겨진다(`can-coordinate-schedule.ts:17`). 진입점과 화면의 기준이 다르다.
16. 격자, 히트맵, 탭 모두 키보드와 스크린리더를 지원하지 않는다.
