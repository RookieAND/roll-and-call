# 구인 수정 (`/games/[id]/edit`)

> 공통 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md)를 참고한다.
> 입력 필드와 검증 규칙은 등록 화면과 같다. 전체 명세는 [games-new.md](./games-new.md)에 있고, 이 문서는 차이점만 적는다.

## 1. 개요

GM이 자신의 구인글 내용을 고치거나 삭제하는 단일 페이지 폼.

- 라우트: `src/app/games/[id]/edit/page.tsx:2-5` (`params.id` await) → `EditGameView` (`src/views/edit-game/ui/edit-game-view.tsx:6-23`)
- 폼: `EditGameForm` (`src/widgets/game-form/ui/edit-game-form.tsx:9-21`) → `GameForm` (`wizard` 없음, `src/widgets/game-form/ui/game-form.tsx:77`) → `GameFormPage` (`src/widgets/game-form/ui/game-form-page.tsx:13-50`)
- 저장: Server Action `updateGame` (`src/features/write-game/api/update-game.ts:17-75`)
- 삭제: `DeleteGameButton` (`src/features/delete-game/ui/delete-game-button.tsx:8-42`)
- 등록과 달리 위저드가 아니다. 모든 필드를 한 페이지에 펼친다 (`game-form-page.tsx:11` 주석 "수정(시안 3b)").

## 2. 접근 조건

| 조건 | 결과 | 근거 |
|---|---|---|
| `id`에 해당하는 게임 없음 | `notFound()` → `src/app/not-found.tsx` "페이지를 찾을 수 없습니다" / "주소가 바뀌었거나 삭제된 페이지예요." | `edit-game-view.tsx:7-8` |
| 비로그인 | `user?.id !== game.gmId` → `redirect("/games/{id}")` | `edit-game-view.tsx:10-11` |
| 로그인했지만 GM이 아님 (참여자·대기자 포함) | 같은 리다이렉트 | 同 |
| GM 본인 | 폼 렌더 | `:13-22` |
| 저장 시 GM이 아님 | UPDATE 조건 `id AND gm_id = user.id`가 0행이면 "수정 권한이 없습니다." | `update-game.ts:44-47` |
| 저장 시 세션 만료 | "로그인이 필요합니다." | `update-game.ts:10-11` |

- 게임 상태(모집 중, 확정, 마감 지남, 2회차 등)에 따른 수정 제한은 **없다**.
- ❓ 확인 필요: `id`가 UUID 형식이 아닐 때 `getGameById`의 uuid 비교가 DB 오류를 내서 notFound가 아닌 전역 에러 화면이 되는지.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발 화면 | 요소 | 근거 |
|---|---|---|
| 구인 상세 `/games/{id}` 헤더 ⋯ 메뉴 (GM에게만, `aria-label="구인 관리 메뉴"`) → 시트 "구인 관리" | "구인 수정" | `src/views/game-detail/ui/game-gm-menu.tsx:31`, `src/views/game-detail/ui/game-detail-header.tsx:23` |
| 직접 URL | — | — |

### 이탈

| 트리거 | 이동 | 근거 |
|---|---|---|
| 앱바 뒤로(‹) | `/games/{id}` | `edit-game-view.tsx:15` |
| 저장 성공 | 토스트 "수정되었습니다" → `router.push("/games/{id}")` | `edit-game-form.tsx:16`, `update-game.ts:49`, `game-form.tsx:62-63` |
| 삭제 성공 | 토스트 "삭제되었습니다" → `router.push("/games")` | `src/features/delete-game/model/use-delete-game.ts:21-22`, `src/features/delete-game/api/delete-game.ts` (`redirect: "/games"`) |
| GM 아님 / 비로그인 | `redirect("/games/{id}")` | `edit-game-view.tsx:11` |
| 게임 없음 | not-found 화면 | `edit-game-view.tsx:8` |

## 4. 데이터

### params

| 이름 | 출처 | 사용 |
|---|---|---|
| `id` | `params: Promise<{ id: string }>` | `getGameById(id)` 조회, 앱바 뒤로 링크, `updateGame.bind(null, id)`, 삭제 대상 |

searchParams 없음.

### 조회

- `getGameById(id)` (`src/shared/server/games.ts:80-91`): `games` 전체 컬럼 + `gm { username, avatarUrl }` + `participants { userId, joinedAt, status, user { username, avatarUrl } }`. 폼은 `games` 컬럼만 쓰므로 `gm`과 `participants`는 이 화면에서 쓰이지 않는다.
- `getCurrentUser()` (`src/shared/server/supabase.ts:7-13`).

### 필드와 컬럼 매핑

매핑 표는 [games-new.md §4](./games-new.md#4-데이터)와 같다. 차이는 초기값과 저장 대상 컬럼이다.

| 폼 필드 | 초기값 (수정) `game-form.tsx:40-54` | 비고 |
|---|---|---|
| `title`, `rule` | DB 값 | |
| `synopsis`, `thumbnailUrl`, `rangeStart`, `rangeEnd` | DB 값, null이면 `""` | |
| `playTime` | DB 문자열 그대로. null이면 `"3시간"` | 시/분 칸은 `parsePlayTime` 정규식 `(\d+)\s*시간`, `(\d+)\s*분`으로 채운다 (`src/widgets/game-form/model/play-time.ts:6-11`). "2시간"처럼 분이 없으면 분 칸이 **빈칸**이다(등록은 "0"). 형식이 맞지 않으면 두 칸 모두 빈칸이다 |
| `maxPlayers` | `String(maxPlayers)` | |
| `images` | DB 배열 그대로(`games.images`, 기본 `[]`) | 저장된 순서대로 진행 이미지 타일로 보인다 (`game-form.tsx:52`) |
| `waitlistEnabled` | DB 값 (`games.waitlist_enabled`) | 마이그레이션 이전 행은 컬럼 기본값 true (`drizzle/0009_game_images_waitlist.sql`, `game-form.tsx:53`) |
| `scheduleMode` | DB 값 | |
| `endDate`, `confirmedAt` | `toLocalDateTimeInput(Date)` → 브라우저 로컬 `YYYY-MM-DDTHH:mm`, null이면 `""` | `src/shared/lib/date-input.ts:5-8` |

`updateGame`이 SET하는 컬럼 (`update-game.ts:43-62`): `title, rule, synopsis, thumbnail_url, images, play_time, max_players, waitlist_enabled, schedule_mode, end_date, range_start, range_end, confirmed_at`. 변환 규칙은 등록과 같다.
SET하지 않는 컬럼: `gm_id, discord_thread_id, parent_game_id, round, notified_at, created_at`.

- 저장 전 `participants`에서 `status = confirmed`인 행 수를 센다 (`update-game.ts:19-22`).
- 범위 조율 게임이 일정 조율을 거쳐 이미 `confirmed_at`을 가지고 있으면, 폼에는 보이지 않는 그 값이 그대로 다시 저장된다. 일시 지정으로 바꾸면 세션 일시 칸에 그 값이 미리 채워진다.
- `notified_at`(리마인더 발송 여부)은 초기화하지 않는다. `confirmed_at`을 바꿔도 리마인더를 다시 보내지 않는다. ❓ 확인 필요: 리마인더 cron(`src/app/api/cron/session-reminders/route.ts`)이 `notified_at`만으로 중복을 거르는지.

### 캐시

- `updateGame`은 `revalidatePath`를 호출하지 않는다. ❓ 확인 필요: 상세 페이지 `/games/[id]`가 동적 렌더인지. `force-dynamic` 선언은 `/games` 목록에만 있지만, 쿠키 조회(`getCurrentUser`) 때문에 동적일 가능성이 높다.
- 라우트 로딩 폴백: 없다. 상세 스켈레톤은 route group 안(`src/app/games/[id]/(detail)/loading.tsx`)에 있어 `/games/[id]/edit`에 적용되지 않는다.

## 5. UI 구성 요소

위에서 아래 순서.

1. **앱바** — `edit-game-view.tsx:15`, `src/shared/ui/app-bar.tsx`. 제목 "구인 수정", 뒤로 링크 `/games/{id}`. 우측 action 없음. 진행바 없음
2. **컨테이너** — `Container size="md"` > `VStack gap=6 py-6` (`edit-game-view.tsx:16-17`) > `VStack gap=3` (`edit-game-form.tsx:11`)
   1. **폼 (GameFormPage)** — `game-form-page.tsx:28-46` > `VStack gap=4`
      1. **fieldset** (제출 중 disabled + `opacity-45`, `:30-33`)
         - 등록 위저드의 세 단계 묶음을 순서대로, 묶음 제목이나 구분선 없이 이어서 편다 (`game-form-page.tsx:35-37`)
         - **기본 정보 필드**: 게임명, 룰, 시놉시스, 플레이타임, 최대 인원, 대기 신청("대기 받기" / "받지 않기" + 힌트 한 줄). 명세는 [games-new.md §5 1단계](./games-new.md#5-ui-구성-요소)와 같다 (`GameBasicsFields`)
         - **이미지 필드**: 썸네일, 진행 이미지("{n} / 5", 3열 타일 + "추가"). 명세는 [games-new.md §5 2단계](./games-new.md#5-ui-구성-요소)와 같다 (`GameMediaFields`)
         - **일정 필드**: 일정 방식, 세션 일정 박스(범위 조율 또는 일시 지정), 모집 마감 기한. 명세는 [games-new.md §5 3단계](./games-new.md#5-ui-구성-요소)와 같다 (`GameScheduleFields`)
         - 위저드의 요약 카드는 없다
         - 썸네일은 DB 값이 있으면 처음부터 미리보기가 보이고, 진행 이미지는 저장된 순서대로 타일이 채워져 있다
      2. **root 오류** — `game-form-page.tsx:39-43`. body2 danger 텍스트
      3. **저장 버튼** — `:44-46`. 전체 폭, 높이 50px, "수정 저장" / 제출 중 "저장 중…" + loading. 하단 sticky가 아니라 본문 흐름 안에 있다
   2. **구인 삭제 버튼** — `edit-game-form.tsx:18`. `variant="danger"`, "구인 삭제", 전체 폭, 높이 46px, 폼 바깥
      - 누르면 **ConfirmDialog** (`delete-game-button.tsx:30-39`): 제목 "구인 삭제", 설명 "이 구인을 삭제할까요? 되돌릴 수 없습니다.", 확인 "삭제"(danger, pending 상태 연동). ❓ 확인 필요: 취소 버튼 문구(`src/shared/ui/confirm-dialog.tsx` 기본값)

## 6. 상태별 화면

| 상태 | 화면 | 근거 |
|---|---|---|
| 라우트 로딩 | 로딩 표시 없음(상세 스켈레톤은 route group 안이라 적용되지 않음) | `src/app/games/[id]/(detail)/loading.tsx` |
| 초기 | 기존 값이 채워진 단일 페이지 폼 | `game-form.tsx:40-52` |
| 검증 실패 | 오류 문구 표시 + `Object.keys(errors)[0]` 필드로 스크롤 | `game-form-page.tsx:22-25` |
| 제출 중 | fieldset disabled, "저장 중…". **삭제 버튼은 비활성화되지 않음** | `game-form-page.tsx:31`, `edit-game-form.tsx:18` |
| 서버 오류 | 저장 버튼 위 danger 문구 (정원 오류, 권한 오류 등) | `game-form-page.tsx:37-41` |
| 성공 | 토스트 "수정되었습니다" → 상세 화면 | `edit-game-form.tsx:16` |
| 삭제 실패 | `toast.error(원문)` 예: "삭제 권한이 없습니다.", "로그인이 필요합니다." | `use-delete-game.ts:17-19` |
| 게임 없음 | not-found 화면 | `edit-game-view.tsx:8` |
| 권한 없음 | 상세로 리다이렉트 (안내 없음) | `edit-game-view.tsx:11` |
| 도메인 상태 (확정, 마감 지남, 2회차) | 화면 차이 없음. 같은 폼 | — |
| 빈 상태 | 해당 없음 | — |

## 7. 폼과 유효성 검사

필드, zod 규칙, 오류 메시지는 [games-new.md §7](./games-new.md#7-폼과-유효성-검사)의 1·2·3단계 표를 그대로 따른다 (같은 `gameFormSchema`). 진행 이미지 스키마 오류 문구를 그리는 자리가 없는 점도 같다.

수정 화면만의 차이:

| 항목 | 내용 | 근거 |
|---|---|---|
| 레이아웃 | 단계 없음. 제출 1회에 전체 검증 | `game-form-page.tsx:28` |
| 오류 스크롤 | `Object.keys(errors)[0]`로 `setTimeout(scrollToField, 0)` | `game-form-page.tsx:22-25` |
| 서버 전용 규칙: 정원 하한 | `Number(maxPlayers) < 확정 참여자 수`이면 오류. 필드 오류가 아니라 root 오류로 표시되고 스크롤도 없음 | `update-game.ts:19-27` |
| 서버 오류 문구 원문 | "로그인이 필요합니다." / (첫 zod issue) 또는 "입력값을 확인하세요." / "이미 확정된 참여자가 {confirmedCount}명이라 정원을 그보다 줄일 수 없습니다." / "수정 권한이 없습니다." | `update-game.ts:11, 15, 25, 47` |
| 모집 마감 달력 min | 오늘. 이미 지난 마감일을 가진 게임은 값은 보이지만 달력에서 과거 날짜를 다시 고를 수 없다. 스키마는 과거 값을 막지 않으므로 그대로 저장된다 | `game-schedule-fields.tsx:65` |
| 플레이타임 dirty | 시/분 칸 입력 시 `shouldDirty: true`. 다만 dirty 상태를 쓰는 곳은 없다 | `game-basics-fields.tsx:58` |

## 8. 액션과 부수효과

### 수정 `updateGame(id, values)` (Server Action)

`src/features/write-game/api/update-game.ts:9-50`

| 순서 | 동작 | 근거 |
|---|---|---|
| 1 | `getCurrentUser()`. 없으면 "로그인이 필요합니다." | `:18-19` |
| 2 | `gameFormSchema.safeParse` | `:21-25` |
| 3 | 확정 참여자 수 COUNT → 정원 하한 검사 | `:27-35` |
| 4 | 이전 `thumbnail_url`·`images` 조회(`WHERE id AND gm_id`) | `:37-41` |
| 5 | `games` UPDATE `WHERE id AND gm_id = user.id` | `:43-62` |
| 6 | 0행이면 "수정 권한이 없습니다." | `:63` |
| 7 | `refreshRecruitPost(id)`: Discord 모집 공지 메시지 embed 갱신 | `:64` |
| 8 | 파일 정리: 이전 썸네일·진행 이미지 중 새 값(`thumbnailUrl`, `images`)에 없는 URL을 `removeUnusedGameFiles`에 넘긴다 | `:66-72` |
| 9 | `{ redirect: "/games/{id}" }` | `:74` |

- 클라이언트: 성공하면 `toast.success("수정되었습니다")` → push. 실패하면 root 오류 (`game-form.tsx:57-67`).
- Discord: 참여자나 스레드로 보내는 알림은 없다. `refreshRecruitPost`가 모집 공지 메시지의 embed만 갱신한다(`update-game.ts:64`).
- `removeUnusedGameFiles` (`src/shared/server/game-files.ts:12-31`): 후보 URL 중 아직 어떤 게임의 `thumbnail_url` 또는 `images`에 남아 있는 것(예: 같은 URL을 복사한 다음 회차)은 건너뛰고, `game-thumbnails` 버킷 공개 URL이 아닌 것도 건너뛴다(`src/shared/lib/storage-path.ts:7-12`). 나머지는 사용자 세션의 Supabase 서버 클라이언트로 Storage에서 지운다. 스토리지 정책상 본인이 올린 파일만 지워진다(코드 주석 `:9`). 실패하면 `console.error`만 남기고 저장 결과에는 영향이 없다(`:29-30`).
- 정리 대상은 DB에 저장돼 있던 이전 값뿐이다. 이번 편집 중 올렸다가 저장 전에 지운 파일은 DB에 없던 URL이라 남는다(`update-game.ts:70`).
- 대기 신청을 "받지 않기"로 바꿔도 `participants`는 건드리지 않는다. 기존 대기자(`waiting`)는 그대로 남고, 확정 인원 ≥ 정원이면 모집 상태가 `full`("모집 마감")이 되어 이후 신청이 거부된다. 반대로 켜면 같은 조건에서 `confirmed`("대기 모집")가 된다(`src/entities/game/model/derive-game-status.ts:20-22`).
- `revalidatePath` 없음.
- 정원을 늘려도 대기자를 자동 승격하지 않는다. 승격 로직(`promoteWaitlistHead`)은 `src/features/adjust-roster/api/adjust-roster.ts`에만 있다.
- 일정 방식이나 날짜를 바꿔도 `availabilities`(조율 응답)를 정리하지 않는다.
- 3과 4 사이에 트랜잭션이 없다 (카운트와 UPDATE 사이에 참여 신청이 들어올 수 있음).
- 썸네일·진행 이미지 업로드는 등록과 같다 ([games-new.md §8](./games-new.md#8-액션과-부수효과)). 교체·삭제한 이전 파일은 저장이 성공한 뒤 위 8단계에서 정리된다.

### 삭제 `deleteGame(id)` (Server Action)

`src/features/delete-game/api/delete-game.ts`, 훅 `src/features/delete-game/model/use-delete-game.ts:9-27`
- 비로그인이면 "로그인이 필요합니다.", `DELETE WHERE id AND gm_id`가 0행이면 "삭제 권한이 없습니다.", 성공하면 `{ redirect: "/games" }`.
- 결과와 상관없이 다이얼로그를 닫고(`onSettled`), 오류는 `toast.error`, 성공은 `toast.success("삭제되었습니다")` → push.
- 참여자와 조율 응답은 FK `onDelete: cascade`로 함께 지워진다 (`schema.ts:66-68, 81-83`).
- Discord 알림 없음, `revalidatePath` 없음.
- 삭제한 행의 `thumbnail_url`·`images`를 `returning`으로 받아 `removeUnusedGameFiles`에 넘긴다. 다른 게임(예: 다음 회차)이 같은 URL을 쓰면 남긴다(`delete-game.ts:10-17`).

## 9. 반응형과 접근성 현황

- [games-new.md §9](./games-new.md#9-반응형과-접근성-현황)의 필드 단위 접근성 현황(aria-invalid 없음, Chip 선택 상태 미전달, 시/분 Select 라벨 없음, 썸네일 라벨 미연결)이 그대로 적용된다.
- 저장 버튼이 sticky가 아니라서 긴 폼 맨 아래까지 스크롤해야 한다. 그 아래에 삭제 버튼이 12px(gap 3) 간격으로 붙어 있다 (`edit-game-form.tsx:11-18`).
- 위저드용 `min-h`나 `bottom-[58px]` 같은 하드코딩은 없다. 본문 하단과 BottomNav가 겹치는지는 공통 레이아웃 여백에 달려 있다 ([_shared-layout.md](./_shared-layout.md)).
- 삭제 버튼에는 확인 다이얼로그가 있다.

## 10. 현재 UX 문제점 메모

코드에서 확인한 사실만 적는다.

1. ~~라우트 로딩 폴백이 "구인 상세" 스켈레톤이다.~~ 해결: 스켈레톤이 route group(`(detail)`)으로 옮겨졌다. 대신 수정 화면에는 로딩 표시가 없다.
2. GM이 아니면 아무 안내 없이 상세로 리다이렉트된다 (`edit-game-view.tsx:11`).
3. 제출 중에도 "구인 삭제" 버튼이 활성 상태다 (fieldset 바깥, `edit-game-form.tsx:18`).
4. 저장 버튼과 파괴적 삭제 버튼이 12px 간격으로 붙어 있다.
5. 모집 공지 embed는 갱신되지만(`update-game.ts:64`) 참여자나 스레드에 변경 알림이 없다. 일정·정원이 바뀌어도 참여자는 알 수 없다.
6. 정원 하한 오류가 "최대 인원" 필드가 아닌 폼 하단 root 오류로만 표시되고 스크롤도 없다 (`update-game.ts:23-27`).
7. 확정, 마감 지남, 조율 응답 수집 중 등 어떤 상태에서도 일정 방식과 날짜를 바꿀 수 있다. 조율 응답(`availabilities`)과 확정 시각이 새 범위와 어긋날 수 있다.
8. 일정 방식을 바꿔도 이전 방식의 값(`confirmedAt` 또는 `rangeStart`/`rangeEnd`)이 함께 저장된다 ([games-new.md §10-4](./games-new.md#10-현재-ux-문제점-메모)).
9. 모집 마감 달력이 오늘 이전을 막기 때문에, 이미 지난 마감일을 가진 게임에서는 그 날짜를 다시 고를 수 없다. 저장은 막지 않는다.
10. 저장된 플레이타임에 분이 없으면 분 칸이 빈칸으로 보인다. 등록 화면 초기값 "0"과 다르다 (`play-time.ts:6-11`).
11. 정원을 늘려도 대기자가 자동 승격되지 않는다.
12. `getGameById`가 참여자 목록까지 조회하지만 이 화면에서는 쓰지 않는다 (`games.ts:83-89`).
13. 변경사항 없이 뒤로 가거나 입력 중 이탈할 때 확인이 없다.
14. 대기 신청을 "받지 않기"로 바꿔도 기존 대기자가 남는데, 칩 아래 힌트("정원이 차면 더 이상 신청을 받지 않습니다. 목록에는 '모집 마감'으로 남습니다.")는 이 점을 말하지 않는다 (`waitlist-field.tsx:18-20`).
15. 파일 정리는 저장·삭제 성공 뒤의 best-effort라 실패해도 성공 토스트가 뜨고 파일이 남는다. 편집 중 올렸다가 저장 전에 지운 파일도 남는다 (`game-files.ts:10, 29-30`, `update-game.ts:70`).
16. 세 필드 묶음(기본·이미지·일정) 사이에 제목이나 구분이 없어 긴 한 줄 폼이 된다 (`game-form-page.tsx:35-37`).
