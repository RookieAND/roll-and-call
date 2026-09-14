# 참여자 관리 (`/games/[id]/participants`)

> 공통 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md)를 참고한다.

## 1. 개요

GM(호스트) 전용 화면으로, 구인글 하나의 참여자 명단을 관리한다. 화면에서 할 수 있는 일은 다음과 같다.

- 상단 지표 3개: 신청 수, 정원, 마감 D-day
- 확정 참여자 목록. 각 행의 ⋯ 메뉴에서 "대기로 이동"이나 "내보내기"를 실행한다.
- 대기자(대기열) 목록. 각 행의 "확정으로" 버튼으로 승격한다.
- 대기자가 남아 있으면 "다음 회차 만들기" 배너가 뜬다. 대기자를 승계해 새 회차 구인글을 만든다.

라우트 파일은 `src/app/games/[id]/participants/page.tsx:1-5`이다. `params.id`를 받아 `ManageParticipantsView`(`src/views/manage-participants/ui/manage-participants-view.tsx:7`)에 넘기는 것이 전부다.

## 2. 접근 조건

| 조건 | 결과 | 근거 |
|---|---|---|
| `games.id = id`인 행이 없음 | `notFound()` → 전역 not-found("페이지를 찾을 수 없습니다") | `src/views/manage-participants/ui/manage-participants-view.tsx:8-9`, `src/app/not-found.tsx:4-7` |
| 비로그인 | `redirect("/games/{id}")` (안내 토스트 없음) | `manage-participants-view.tsx:12-13` |
| 로그인했지만 GM이 아님(`user.id !== games.gm_id`) | `redirect("/games/{id}")` (안내 토스트 없음) | `manage-participants-view.tsx:13` |
| GM | 화면 표시 | — |

- 게임 존재 여부를 먼저 확인하고 로그인 여부는 그다음에 본다. 그래서 id가 없는 게임이면 비로그인이어도 404가 뜬다.
- `confirmed_at`(확정 세션)이나 `end_date`(마감)가 지났다고 막지는 않는다. 어떤 상태든 같은 화면이 렌더링된다(6장 참고).
- `src/proxy.ts`는 Supabase 세션 쿠키만 갱신한다. 경로 보호는 하지 않는다.

## 3. 진입 경로와 이탈 경로

### 진입
| 출발 | 요소 | 근거 |
|---|---|---|
| 구인 상세 `/games/[id]` (GM) | 헤더 ⋯ "구인 관리" 시트의 "참여자 관리" 링크 | `src/views/game-detail/ui/game-gm-menu.tsx:33-35` (`game-detail-header.tsx:23`에서 `isGm`일 때만 렌더링) |
| 마이페이지 세션 요약 / 내 세션 목록 | `SessionList` 카드. `role === "host" && !dim`(종료되지 않은 운영 세션)이면 상세 대신 이 화면으로 보냄 | `src/widgets/session-list/ui/session-list.tsx:6-8`, 사용처 `src/views/my-page/ui/session-summary-section.tsx:46`, `src/views/my-sessions/ui/my-sessions-view.tsx:68` |
| 직접 URL 입력 | — | — |

### 이탈
| 요소 | 목적지 | 근거 |
|---|---|---|
| AppBar 뒤로(‹) | `/games/{id}` | `src/views/manage-participants/ui/participant-manager.tsx:43` |
| 비GM/비로그인 진입 | `/games/{id}`로 redirect | `manage-participants-view.tsx:13` |
| "회차 열기" 성공 | `router.push("/games/{새 게임 id}")` | `src/features/create-second-round/ui/round-sheet.tsx:48-49`, `api/create-second-round.ts:107` |
| BottomNav | [_shared-layout.md](./_shared-layout.md) | — |

## 4. 데이터

### 조회
`getGameParticipants(gameId)`(`src/shared/server/games.ts:97-116`)가 쿼리 두 개를 실행한다.

1. `db.query.games.findFirst`: `games` 전체 컬럼 + `gm { id, username, avatarUrl }` + `participants { userId, joinedAt, status }` + `participants.user { username, avatarUrl }`
2. `selectDistinct availabilities.user_id WHERE game_id = id` → `availableUserIds: Set<string>`

그 뒤 `getCurrentUser()`(`src/shared/server/supabase.ts:4-11`, `supabase.auth.getUser()`)로 GM인지 판정한다.

| 화면 필드 | 출처 | 가공 |
|---|---|---|
| AppBar 제목 | 고정 문자열 "참여자 관리" | — |
| 신청 | `participants` 행 수(확정+대기) | `summarizeRoster.total` (`src/views/manage-participants/model/roster-summary.ts:18`) |
| 정원 | `games.max_players` | — |
| 마감 | `games.end_date` | 지났으면 "마감", 아니면 `D-${dday(endDate)}` (`roster-summary.ts:22`). `dday`는 사용자 로컬 날짜 차이(`src/shared/lib/format.ts:47-52`) |
| 마감 강조(빨강) | `games.end_date` | `isDeadlineUrgent`: 남은 시간이 0보다 크고 24시간 미만 (`src/entities/game/model/deadline.ts:4-7`) |
| 마감일 문구 | `games.end_date` | `formatDateTime` → "8월 16일 (일) 20:00" 형식, Asia/Seoul, 24시간제 (`format.ts:2-17`) |
| 확정/대기 분리 | `participants.status` (`confirmed`/`waiting`) | `splitRoster`: `joined_at` 오름차순 정렬 후 분리 (`src/entities/game/model/split-roster.ts:18-35`) |
| n번째 신청 | `participants.joined_at` 순서 | `applicationRank`: 확정·대기를 합친 전체 기준 1부터 |
| 대기 순번 | `participants.joined_at` 순서 | `waitlistRank`: 대기자 중 1부터 |
| 이름 / 아바타 | `profiles.username`, `profiles.avatar_url` | 사용자 정보가 없으면 "익명" / `null` (`src/views/manage-participants/model/to-managed-member.ts:17-18`) |
| 가능 시간 입력 여부 | `availabilities`에 해당 user 행이 있는지 | `hasAvailability` (`to-managed-member.ts:21`). 이 게임 id 기준이다. 조율 기간 밖 슬롯인지는 따지지 않는다 |
| 다음 회차 시트 제목 보조 | `games.title`, 대기자 수 | — |
| 다음 회차 선택 가능 최소일 | `games.confirmed_at` | 확정돼 있으면 `confirmedAt + 24h`, 아니면 오늘. 둘 다 로컬 기준 `YYYY-MM-DD` (`round-sheet.tsx:36-38`) |

- 조회는 했지만 화면에서 쓰지 않는 값: `gm { id, username, avatarUrl }`(`games.ts:101`), `games.round`, `games.schedule_mode` 등.
- params: `id`(Promise로 받아 await). searchParams는 쓰지 않는다.

### 캐시
- 라우트에 `dynamic`/`revalidate` export가 없다. `cookies()`를 쓰는 `getCurrentUser` 때문에 동적 렌더링이 된다. ❓ 확인 필요: 빌드 출력에서 실제로 동적(ƒ)으로 분류되는지.
- 이 경로를 `revalidatePath`하는 곳:
  - `promoteParticipant` / `demoteParticipant` / `removeParticipant`: `/games/{id}/participants`, `/games/{id}`, `/games` (`src/features/adjust-roster/api/adjust-roster.ts:10-14`)
  - `createSecondRound`: 원래 게임의 같은 세 경로 (`create-second-round.ts:104-106`)
  - `joinGame`, `leaveGame`: 같은 세 경로 (`src/features/join-game/api/join-game.ts:71-73`, `leave-game.ts:39-41`)
  - `saveAvailability`는 `/games/{id}/schedule`만 갱신한다(`save-availability.ts:43`). "가능 시간 입력/미입력" 표시는 이 경로에서 갱신되지 않는다.

## 5. UI 구성 요소

```
AppBar
Container(size="md") > VStack(gap=5, py-4)
├─ RosterStats
│  ├─ StatCard ×3 (신청 / 정원 / 마감)
│  └─ Card: 마감일 · 안내 문구
├─ ConfirmedRoster (RosterSection)
│  ├─ ConfirmedRosterRow × n  (또는 빈 문구)
│  └─ MemberActionSheet (시트)
│     ├─ DemoteMemberItem
│     └─ RemoveMemberItem → ConfirmDialog
└─ (대기자 ≥ 1일 때)
   ├─ WaitingRoster (RosterSection)
   │  └─ WaitingRosterRow × n → PromoteButton
   └─ NextRoundBanner
      └─ RoundSheet (시트)
         ├─ RoundInheritedList
         ├─ RoundRangeFields (DatePicker ×2)
         └─ 취소 / 회차 열기
```

`ParticipantManager`(`src/views/manage-participants/ui/participant-manager.tsx:24`)는 `"use client"`다. 그래서 그 아래 컴포넌트(RosterStats 등)는 모두 클라이언트 번들에 포함된다.

- **AppBar** — `src/views/manage-participants/ui/participant-manager.tsx:43` / 뒤로 버튼(aria-label "뒤로")과 제목 "참여자 관리". sticky, 높이 52px(`src/shared/ui/app-bar.tsx:17`) / 뒤로를 누르면 `/games/{id}`로 이동한다.

- **StatCard: 신청** — `src/views/manage-participants/ui/roster-stats.tsx:22` / 확정+대기 인원 숫자와 라벨 "신청"
- **StatCard: 정원** — `roster-stats.tsx:23` / `max_players` 숫자와 라벨 "정원"
- **StatCard: 마감** — `roster-stats.tsx:24` / "D-3" 또는 "마감", 라벨 "마감". 24시간 이내면 빨간 테두리·배경에 빨간 글자(`src/shared/ui/stat-card.tsx:16,22`). 마감이 오늘이면 `D-0`으로 보인다.
- **마감 안내 카드** — `roster-stats.tsx:26-33` / 두 줄: "마감일 | 8월 16일 (일) 20:00" / "마감되면 아래 확정 목록이 그대로 확정됩니다."

- **확정 섹션 헤더** — `src/views/manage-participants/ui/confirmed-roster.tsx:27`, `roster-section.tsx:18-25` / 왼쪽 "확정 {확정 수}/{정원}"(굵게), 오른쪽 "신청 순서 기준"
- **확정 행** — `src/views/manage-participants/ui/confirmed-roster-row.tsx:16-39` / 아바타(34px, `size="stack"`), 이름, 보조 줄 "{n}번째 신청 · 가능 시간 입력" 또는 "{n}번째 신청 · 가능 시간 미입력". 미입력은 주황(`text-warning-600`), 입력은 회색. 오른쪽에 ⋯ IconButton(aria-label "참여자 메뉴") / 누르면 그 참여자로 MemberActionSheet가 열린다.
- **확정 빈 상태** — `confirmed-roster.tsx:35-41` / "아직 확정된 참여자가 없어요."

- **MemberActionSheet** — `src/features/adjust-roster/ui/member-action-sheet.tsx:24-51` / 하단 시트(Base UI Dialog, 최대 폭 412px, 핸들 바 있음, `src/shared/ui/sheet.tsx:9-22`). 헤더에 큰 아바타, 이름, "확정 예정 · {n}번째 신청"이 나온다. 시트 바깥이나 백드롭을 누르면 닫힌다.
  - **대기로 이동** — `src/features/adjust-roster/ui/demote-member-item.tsx:34-39` / 행 문구 "대기로 이동", 오른쪽 보조 "대기 맨 앞" / 누르면 `demoteParticipant`를 호출한다. 진행 중에는 disabled. 성공하면 토스트 "{이름}님을 대기로 옮겼습니다"를 띄우고 시트를 닫는다. 실패하면 에러 토스트를 띄우고 시트는 열린 채로 둔다.
  - **내보내기** — `src/features/adjust-roster/ui/remove-member-item.tsx:36-42` / 빨간 굵은 글씨 "내보내기" / 누르면 ConfirmDialog가 열린다.
  - **ConfirmDialog(내보내기)** — `remove-member-item.tsx:43-52`, `src/shared/ui/confirm-dialog.tsx:30-56` / 제목 "참여자 내보내기", 설명 "{이름}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없어요.", 버튼 "취소"(outline)와 "내보내기"(danger). 진행 중에는 확인 버튼이 disabled(로딩 표시 없음) / 확인하면 `removeParticipant` 호출. 성공 시 토스트 "내보냈습니다", 다이얼로그와 시트를 닫는다.
  - **자동 채움 안내** — `member-action-sheet.tsx:41-47` / 대기자가 있을 때만 "빈 자리는 대기 맨 앞({대기 1번 이름})이 자동으로 채웁니다."

- **대기 섹션 헤더** — `src/views/manage-participants/ui/waiting-roster.tsx:15-18` / 왼쪽 "대기 {n}명". 오른쪽은 정원이 찼으면 "정원이 차서 승격하려면 먼저 자리를 비워야 해요", 아니면 "상한 없음". 박스 배경은 `bg-gray-50`.
- **대기 행** — `src/views/manage-participants/ui/waiting-roster-row.tsx:16-29` / 대기 순번(모노폰트, hint 색), 아바타(md), 이름, "확정으로" 버튼. 가능 시간 입력 여부는 표시하지 않는다.
- **PromoteButton** — `src/features/adjust-roster/ui/promote-button.tsx:28-32` / outline·sm 버튼 "확정으로". `확정 수 >= 정원`이면 disabled / 누르면 `promoteParticipant` 호출(로딩 스피너 표시). 성공 시 토스트 "{이름}님을 확정했습니다", 실패 시 에러 토스트.

- **NextRoundBanner** — `src/views/manage-participants/ui/next-round-banner.tsx:22-32` / 대기자가 1명 이상일 때만 뜬다. 옅은 primary 박스에 제목 "대기 {n}명으로 다음 회차 열기", 설명 "같은 게임을 새 일정으로 한 번 더 진행합니다. 대기자는 자동 초대돼요.", 전체 폭 버튼 "다음 회차 만들기" / 버튼을 누르면 RoundSheet가 열린다.
- **RoundSheet** — `src/features/create-second-round/ui/round-sheet.tsx:53-89`
  - 제목 "다음 회차 만들기", 보조 "{구인글 제목} · 대기 {n}명"
  - **RoundInheritedList** — `src/features/create-second-round/ui/round-inherited-list.tsx:5-38` / 소제목 "승계할 항목". 체크 아이콘과 함께 세 행: "게임 정보 / 룰 · 시놉시스 · 플레이타임", "대기자 자동 초대 / 확정 참여로 승계", "입력한 가능 시간표 / 조율을 처음부터 다시 안 함". 표시만 하고 인터랙션은 없다.
  - **RoundRangeFields** — `src/features/create-second-round/ui/round-range-fields.tsx:26-39` / 라벨 "조율 시작일", "조율 종료일". 각각 DatePicker이고 placeholder는 "날짜 선택"(`src/shared/ui/date-picker.tsx:24`). 팝오버 캘린더에서 범위 밖 날짜는 취소선과 disabled로 표시된다. 날짜를 고르면 팝오버가 닫히고 트리거에 `YYYY-MM-DD` 원문이 보인다.
  - **취소** — `round-sheet.tsx:75-77` / outline, 폭 w-24 / 시트를 닫는다. 입력값은 초기화하지 않는다.
  - **회차 열기** — `round-sheet.tsx:78-85` / 시작일이나 종료일이 비어 있으면 disabled. 누르면 `createSecondRound` 호출(로딩 표시). 성공하면 토스트 "다음 회차를 열었습니다", 시트를 닫고 새 게임 상세로 push한다. 실패하면 에러 토스트를 띄우고 시트는 열어 둔다.

## 6. 상태별 화면

| 상태 | 화면 |
|---|---|
| 로딩 | 전용 `loading.tsx`가 없다. 상위 `src/app/games/[id]/loading.tsx:3-34`가 적용되어 AppBar "구인 상세"(뒤로 `/games`)와 상세 페이지 모양 스켈레톤이 보인다. 실제 화면과 제목·뒤로 목적지·레이아웃이 모두 다르다 |
| 에러 | 전용 `error.tsx`가 없다. 전역 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도" |
| 404 | 전역 not-found: "페이지를 찾을 수 없습니다" / "주소가 바뀌었거나 삭제된 페이지예요." |
| 참여자 0명 | 지표: 신청 0. 확정 섹션 "확정 0/{정원}"과 "아직 확정된 참여자가 없어요.". 대기 섹션과 다음 회차 배너는 없다 |
| 대기자 0명 | 대기 섹션과 NextRoundBanner가 렌더링되지 않는다. ⋯ 시트의 자동 채움 안내도 없다 |
| 정원 충족(`확정 수 ≥ max_players`) | 모든 "확정으로" 버튼 disabled. 대기 헤더 힌트는 "정원이 차서 승격하려면 먼저 자리를 비워야 해요" |
| 마감 임박(24시간 이내) | 마감 StatCard 빨강 |
| 마감 경과 | 마감 StatCard 값 "마감"(빨강 아님). 모든 조작은 그대로 가능하고, 서버도 `end_date`를 검사하지 않는다 |
| 세션 확정(`confirmed_at` 있음) | 화면 구성은 같다. 승격·강등·내보내기는 서버에서 "이미 확정된 게임입니다." 에러 토스트로 거부된다(`adjust-roster.ts:30,80,113`). UI에는 잠금 표시가 없고, 시트 헤더는 여전히 "확정 예정"이다. 다음 회차 만들기는 가능하다(확정일 다음 날부터) |
| 권한별 | GM만 볼 수 있다. 나머지는 2장처럼 redirect |

## 7. 폼과 유효성 검사

다음 회차 만들기(RoundSheet)가 이 화면의 유일한 입력 폼이다.

| 필드 | 클라이언트 제약 | 서버 검증 (`create-second-round.ts`) | 에러 문구 |
|---|---|---|---|
| 조율 시작일 `rangeStart` (`YYYY-MM-DD`) | 최소 `earliest` = 확정 세션이 있으면 `confirmedAt + 24h`의 로컬 날짜, 없으면 오늘(`round-sheet.tsx:36-38`, `round-range-fields.tsx:31`) | 비어 있으면 거부(`:23`). 확정 세션이 있으면 `rangeStart <= confirmedAt의 UTC 날짜`일 때 거부(`:36-41`). 오늘 이전 날짜는 서버에서 막지 않는다 | "조율 기간을 입력하세요." / "1회차 확정 세션 이후 날짜만 고를 수 있습니다." |
| 조율 종료일 `rangeEnd` | 시작일이 있으면 `start+1일`부터 `start+14일`까지. 시작일이 없으면 min=`earliest`만 건다(`src/shared/lib/date-input.ts:23-34`) | 비어 있으면 거부. `rangeEnd <= rangeStart`면 거부(`:24-26`). 차이가 14일 초과면 거부(`:27-29`, `SECOND_ROUND_MAX_DAYS = 14`, `model/second-round.ts:2`) | "종료일은 시작일보다 이후여야 합니다." / "조율 기간은 최대 14일까지 설정할 수 있습니다." |
| (버튼) | 둘 중 하나라도 비어 있으면 "회차 열기" disabled | — | — |
| (기타) | — | 비로그인 / 게임 없음 / GM 아님 / 대기자 0명 | "로그인이 필요합니다." / "존재하지 않는 게임입니다." / "권한이 없습니다." / "승계할 대기자가 없습니다." |

- 시작일을 먼저 고른 뒤 종료일을 고르고 다시 시작일을 바꿔도 종료일은 자동으로 조정되지 않는다. 범위를 벗어난 종료일이 그대로 남을 수 있고, 이 경우 서버 검증에서 걸린다.
- 에러는 모두 토스트로 표시된다. 필드 옆 인라인 에러는 없다(`ActionResult.field`를 쓰지 않음).

승격·강등·내보내기에는 입력 필드가 없다. 서버 공통 검증은 다음과 같다(`adjust-roster.ts`). "로그인이 필요합니다." / "존재하지 않는 게임입니다." / "권한이 없습니다." / "이미 확정된 게임입니다." / "참여자를 찾을 수 없습니다.". 게임 행은 `FOR UPDATE`로 잠근다.

## 8. 액션과 부수효과

| 액션 | 트리거 | DB 변경 | 성공 토스트 | redirect | revalidatePath | Discord |
|---|---|---|---|---|---|---|
| `promoteParticipant(gameId, userId)` `adjust-roster.ts:21-68` | 대기 행 "확정으로" | 트랜잭션 안에서 대상 `participants.status → confirmed`. 이미 confirmed면 아무것도 하지 않고 성공 반환. 확정 수 ≥ 정원이면 `joined_at`이 가장 늦은 확정자를 `waiting`으로 내린다(현재 UI는 정원이 차면 버튼을 막으므로 이 분기에 닿지 않음) | "{이름}님을 확정했습니다" | 없음 | `/games/{id}/participants`, `/games/{id}`, `/games` | 없음 |
| `demoteParticipant` `:71-101` | 시트 "대기로 이동" | 대상 → `waiting`. 이어서 `promoteWaitlistHead`: `joined_at`이 가장 빠른 대기자(대상 제외)를 `confirmed`로 올린다 | "{이름}님을 대기로 옮겼습니다" | 없음 | 위와 같음 | 없음 |
| `removeParticipant` `:104-133` | ConfirmDialog "내보내기" | `participants` 행 DELETE. 삭제한 사람이 확정자였으면 `promoteWaitlistHead` 실행. 이 사람의 `availabilities`는 삭제하지 않는다 | "내보냈습니다" | 없음 | 위와 같음 | `notifyGameLeft(gameId, userId, true)` (`src/shared/server/discord-notify.ts:92-123`): 제목 "🚪 {게임 제목}", 설명 "**{이름}**님이 참여 목록에서 제외됐어요.", 필드 "현재 인원 {확정 수}/{정원}", 푸터 "GM {GM 이름}". `games.discord_thread_id` 스레드로 전송. webhook 환경변수가 없으면 경고 로그만 남기고 건너뛴다(`discord-webhook.ts:39-43`) |
| `createSecondRound(gameId, {rangeStart, rangeEnd})` `create-second-round.ts:15-108` | RoundSheet "회차 열기" | 트랜잭션: (1) `games` INSERT. 제목·룰·시놉시스·썸네일·플레이타임·정원을 복사하고 `schedule_mode = coordinate`, `end_date = rangeEnd 23:59:59 KST`, `range_start/range_end`, `parent_game_id = 원본`, `round = 원본+1`로 설정. (2) 대기자를 `joined_at` 순으로 새 게임 `participants`에 INSERT. 앞에서 정원 수만큼 `confirmed`, 나머지는 `waiting`. (3) 원본 게임에서 승계 대상자들의 `availabilities`를 새 게임으로 복사(조율 기간 밖 슬롯도 그대로 복사). (4) 원본 게임에서 승계 대상자의 `participants` 행 DELETE | "다음 회차를 열었습니다" | 클라이언트 `router.push("/games/{newId}")` | 원본 기준 `/games/{id}/participants`, `/games/{id}`, `/games` | 없음. 새 게임 모집 공지(`notifyGameCreated`)를 호출하지 않으므로 `discord_thread_id`는 null |

- 실패하면 모든 액션이 `toast.error(result.error)`를 띄운다.
- 승격과 강등에는 확인 절차가 없다. 누르는 즉시 실행된다.
- `createSecondRound`는 대기자 조회(`:43-48`)와 원본 가능 시간 조회(`:84-86`)를 트랜잭션 객체(`tx`)가 아니라 `db`로 실행한다.

## 9. 반응형과 접근성 현황

- 레이아웃: `Container size="md"`(max-w-4xl, px-4). 지표는 폭과 상관없이 `grid-cols-3`. 행은 `HStack` 한 줄이고, 긴 이름에 truncate 처리가 없다.
- 시트는 `max-w-[412px]` 하단 고정이라 데스크톱에서도 좁은 하단 시트로 뜬다(`sheet.tsx:15`).
- ⋯ 버튼에 `aria-label="참여자 메뉴"`, AppBar 뒤로 버튼에 `aria-label="뒤로"`가 있다.
- MemberActionSheet와 RoundSheet는 `Sheet.Title`(`Dialog.Title`)을 쓰지 않는다. 다이얼로그에 접근 가능한 이름이 연결되지 않는다(`member-action-sheet.tsx:24-51`, `round-sheet.tsx:54-88`).
- ConfirmDialog는 `Dialog.Title`/`Dialog.Description`을 사용한다.
- 체크·⋯ 아이콘은 `aria-hidden`.
- 가능 시간 미입력은 주황 글자로 구분하지만 "미입력"이라는 텍스트도 함께 있어 색에만 의존하지는 않는다.
- 대기 순번은 숫자만 표시되고 라벨이 없다(`waiting-roster-row.tsx:21-23`).
- ConfirmDialog 확인 버튼은 진행 중 disabled만 걸리고 로딩 표시가 없다.
- `summarizeRoster`의 `dday`/`isDeadlineUrgent`는 클라이언트 컴포넌트 안에서 호출되지만 SSR에서도 한 번 실행된다. 서버와 브라우저의 타임존·시각이 다르면 hydration 불일치가 날 수 있다. ❓ 확인 필요: 실제 hydration 경고가 발생하는지.

## 10. 현재 UX 문제점 메모

1. 로딩 스켈레톤이 상위 `[id]/loading.tsx`를 물려받아 "구인 상세" 제목, 뒤로 `/games`, 상세 페이지 모양으로 보인다(`src/app/games/[id]/loading.tsx:6`).
2. 비GM이나 비로그인으로 들어오면 아무 안내 없이 상세로 redirect된다(`manage-participants-view.tsx:13`).
3. 세션 확정 후에도 승격·강등·내보내기 UI가 그대로 노출된다. 누르면 서버 에러 토스트만 뜨고, 시트 헤더도 "확정 예정"으로 남아 있다.
4. 마감 안내가 "마감되면 아래 확정 목록이 그대로 확정됩니다."라고 하지만, 마감이 지나도 조작이 막히지 않는다(서버에서도 `end_date` 검사 없음).
5. 강등하면 대기 1번이 자동으로 승격되는데, 강등한 본인은 대기열 어디에 들어가는지 표시되지 않는다. `joined_at`이 바뀌지 않으므로 신청 순서대로 들어가며, 보조 문구 "대기 맨 앞"과 다를 수 있다. ❓ 확인 필요: "대기 맨 앞"이 강등된 사람의 위치를 뜻하는지, 빈 자리를 채울 사람을 뜻하는지.
6. 정원이 차면 승격 버튼이 막히므로, 서버의 "가장 늦은 확정자 자동 강등" 분기(`adjust-roster.ts:43-56`)는 이 UI에서 닿지 않는다.
7. 가능 시간 입력 여부는 `saveAvailability`가 이 경로를 revalidate하지 않아서, 클라이언트 라우터 캐시에 따라 오래된 값이 보일 수 있다.
8. 승격·강등에는 Discord 알림이 없고 내보내기에만 있다. 다음 회차 생성도 새 모집 공지를 보내지 않는다.
9. RoundSheet를 닫았다 다시 열면 이전 입력이 남아 있다. 종료일 범위를 넘는 값도 자동으로 보정되지 않는다.
10. 시트 두 개 모두 Dialog 제목이 연결되어 있지 않다(스크린리더 이름 없음).
11. "신청" 지표는 확정+대기 합계인데, 옆 "정원" 지표와 나란히 있어 정원 대비 신청 수로 오해할 수 있다.
12. 다음 회차 서버 검증은 확정일을 UTC 날짜(`toISOString().slice(0,10)`)로 비교하고, 클라이언트 최소일은 로컬 날짜로 계산한다. KST 기준으로 확정 시각이 00:00~08:59 사이면 두 기준이 하루 어긋날 수 있다.
