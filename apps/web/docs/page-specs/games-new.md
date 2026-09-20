# 구인 등록 (`/games/new`)

> 공통 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md)를 참고한다.
> 이 문서는 구인 폼(`src/widgets/game-form/**`)의 기준 문서이기도 하다. 수정 화면은 [games-edit.md](./games-edit.md)에 차이점만 적는다.

## 1. 개요

GM(호스트)이 새 구인글(game)을 작성하는 3단계 위저드 화면. 단계는 기본 설정(최대 인원·대기 신청 포함) → 이미지(썸네일·진행 이미지) → 일정 · 마감 순이다(커밋 `9f60a24`에서 2단계에서 3단계로 바뀜).

- 라우트: `src/app/games/new/page.tsx:1-4` → `CreateGameView` (`src/views/create-game/ui/create-game-view.tsx:4-10`)
- 폼: `CreateGameForm` (`src/widgets/game-form/ui/create-game-form.tsx:6-15`) → `GameForm wizard` (`src/widgets/game-form/ui/game-form.tsx:27-78`) → `GameFormWizard` (`src/widgets/game-form/ui/game-form-wizard.tsx:33-126`)
- 저장: Server Action `createGame` (`src/features/write-game/api/create-game.ts:8-47`)
- 등록이 끝나면 Discord 모집 채널에 공지를 보내고, 그 메시지에 스레드를 연 뒤 상세 화면(`/games/{id}`)으로 이동한다.
- 레이아웃 구성: 위저드가 단계마다 앱바 제목과 뒤로가기, 진행바를 바꾸기 때문에 뷰가 아니라 `CreateGameForm`이 페이지 셸(앱바, 컨테이너, 하단 CTA)을 가진다 (`create-game-view.tsx:8` 주석).

## 2. 접근 조건

| 사용자 상태           | 결과                                                                            | 근거                                                |
| --------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| 비로그인              | `redirect("/")`. 안내 토스트나 로그인 유도는 없음                               | `src/views/create-game/ui/create-game-view.tsx:5-6` |
| 로그인 사용자(누구나) | 위저드 렌더. 별도 역할 구분 없음 (작성자가 곧 GM)                               | 同 `:9`                                             |
| 세션 만료 뒤 제출     | 서버 액션이 `{ error: "로그인이 필요합니다." }` 반환 → 폼 하단 root 오류로 표시 | `src/features/write-game/api/create-game.ts:9-10`   |

- `src/proxy.ts:5-33`는 Supabase 세션 쿠키만 갱신한다. 경로 보호는 하지 않는다.
- notFound 규칙 없음.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발 화면                    | 요소           | 근거                                                |
| ---------------------------- | -------------- | --------------------------------------------------- |
| 구인 목록 `/games` 앱바      | "새 구인" 버튼 | `src/views/games/ui/games-app-bar.tsx:12`           |
| 구인 목록 빈 상태            | "새 구인 등록" | `src/views/games/ui/games-empty.tsx:30`             |
| 홈 시작 빈 상태              | "새 구인 등록" | `src/views/home/ui/home-start-empty.tsx:18`         |
| 마이페이지 세션 요약 빈 상태 | "새 구인 등록" | `src/views/my-page/ui/session-summary-empty.tsx:31` |
| 직접 URL 입력                | —              | —                                                   |

BottomNav 탭 중 `/games` 탭이 `pathname.startsWith` 규칙으로 활성 표시된다 (`src/shared/ui/bottom-nav.tsx:9,19`, 탭 href `/games`).

### 이탈

| 트리거             | 이동                                                                                 | 근거                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1단계 앱바 뒤로(‹) | `Link` → `/games` (진입 경로와 무관하게 고정). 2·3단계의 뒤로는 이전 단계로 돌아간다 | `src/widgets/game-form/ui/game-form-wizard.tsx:82-83`, `src/shared/ui/app-bar.tsx:28-39`     |
| 등록 성공          | `router.push("/games/{새 id}")`                                                      | `src/widgets/game-form/ui/game-form.tsx:63`, `src/features/write-game/api/create-game.ts:46` |
| 비로그인 진입      | `redirect("/")`                                                                      | `create-game-view.tsx:6`                                                                     |
| BottomNav 탭       | 각 탭 경로. 입력 중이던 내용에 대한 이탈 확인은 없음                                 | [_shared-layout.md](./_shared-layout.md)                                                     |

## 4. 데이터

### params / searchParams

없음. 서버에서 `getCurrentUser()`(`src/shared/server/supabase.ts:7-13`)만 호출한다.

### 폼 필드와 `games` 컬럼 매핑

스키마: `src/shared/server/schema.ts`(`games`, `images` `:44`, `waitlist_enabled` `:48`). 폼 값은 `images`(문자열 배열)와 `waitlistEnabled`(불리언)를 빼면 모두 문자열이다 (`src/features/write-game/model/game-form.ts:8-9` 주석). 서버 액션이 DB 타입으로 바꾼다 (`create-game.ts:22-37`).

| 폼 필드 (`GameFormValues`)         | 기본값 (등록) `game-form.tsx:40-54`   | 컬럼                                                                               | 저장 변환 `create-game.ts`                            |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `title`                            | `""`                                  | `games.title` text NOT NULL                                                        | 그대로 (zod `trim` 적용 값) `:23`                     |
| `rule`                             | `""`                                  | `games.rule` text NOT NULL                                                         | 그대로 (trim) `:24`                                   |
| `synopsis`                         | `""`                                  | `games.synopsis` text                                                              | `v.synopsis \|\| null` `:25`                          |
| `thumbnailUrl`                     | `""`                                  | `games.thumbnail_url` text                                                         | `\|\| null` `:27`                                     |
| `images` (공개 URL 배열)           | `[]`                                  | `games.images` text[] NOT NULL 기본 `{}` (`drizzle/0009_game_images_waitlist.sql`) | 그대로 `:28`                                          |
| `playTime`                         | `"3시간"` (`formatPlayTime("3","0")`) | `games.play_time` text                                                             | `\|\| null` `:29`                                     |
| `maxPlayers`                       | `"4"`                                 | `games.max_players` integer NOT NULL                                               | `Number()` `:30`                                      |
| `waitlistEnabled` (boolean)        | `true`                                | `games.waitlist_enabled` boolean NOT NULL 기본 true (`0009`)                       | 그대로 `:31`                                          |
| `scheduleMode`                     | `"coordinate"`                        | `games.schedule_mode` enum NOT NULL                                                | 그대로 `:32`                                          |
| `endDate` (`YYYY-MM-DDTHH:mm`)     | `""`                                  | `games.end_date` timestamptz NOT NULL                                              | `fromKstDateTimeInput(v.endDate)` `:33`               |
| `rangeStart` (`YYYY-MM-DD`)        | `""`                                  | `games.range_start` date                                                           | `\|\| null` `:34`                                     |
| `rangeEnd` (`YYYY-MM-DD`)          | `""`                                  | `games.range_end` date                                                             | `\|\| null` `:35`                                     |
| `confirmedAt` (`YYYY-MM-DDTHH:mm`) | `""`                                  | `games.confirmed_at` timestamptz                                                   | 값 있으면 `fromKstDateTimeInput()`, 없으면 null `:36` |
| (서버)                             | —                                     | `games.gm_id`                                                                      | `user.id` `:23`                                       |
| (서버, 후처리)                     | —                                     | `games.discord_thread_id`                                                          | 스레드 생성 성공 시 별도 UPDATE `:45-47`              |
| (DB 기본값)                        | —                                     | `id`, `round`(1), `created_at`, `parent_game_id`(null), `notified_at`(null)        | —                                                     |

- `endDate`와 `confirmedAt`은 타임존 없는 `YYYY-MM-DDTHH:mm` 문자열로 넘어오고, 서버가 `fromKstDateTimeInput`으로 KST 시각으로 해석해 저장한다(`create-game.ts:33, 36`).
- 일정 방식을 바꿔도 반대편 필드 값은 지워지지 않는다. 서버는 `scheduleMode`와 상관없이 `rangeStart`, `rangeEnd`, `confirmedAt`을 모두 저장한다 (`create-game.ts:34-36`). §10 참고.

### 캐시

- `createGame`은 `revalidatePath`를 호출하지 않는다 (`create-game.ts` 전체). `/games`는 `export const dynamic = "force-dynamic"` (`src/app/games/page.tsx:4`)라서 목록은 매 요청마다 새로 그린다.
- 라우트 로딩 폴백: 없다. 목록·상세 스켈레톤은 route group 안(`src/app/games/(list)/loading.tsx`, `src/app/games/[id]/(detail)/loading.tsx`)에 있어 `/games/new`에 적용되지 않는다.

## 5. UI 구성 요소

위에서 아래 순서. 전체는 `<form className="flex min-h-[calc(100dvh-58px)] flex-col">` (`game-form-wizard.tsx:75-78`).

1. **앱바 (WizardHeader)** — `src/widgets/game-form/ui/wizard-header.tsx:25-34`, `src/shared/ui/app-bar.tsx:14-51`
   - 제목: 1단계 "게임 기본 설정", 2단계 "이미지", 3단계 "일정 · 마감" (`STEP_TITLE`, `game-form-wizard.tsx:15-19`)
   - 뒤로(‹, `aria-label="뒤로"`): 1단계는 `/games` 링크, 2·3단계는 버튼(`goBack` → 이전 단계 + `window.scrollTo({ top: 0 })`) (`game-form-wizard.tsx:64-68, 82-83`)
   - 우측 action: "`{step} / 3`" (`LAST_WIZARD_STEP`, typography code2, hint 색, tabular-nums) (`wizard-header.tsx:6-8, 29-33`)
   - sticky top-0, 높이 52px (`app-bar.tsx:17`)
2. **진행바** — `wizard-header.tsx:35-42`
   - 막대 3개(`WIZARD_STEPS = [1, 2, 3]`). 현재 단계 이하 막대는 primary-600, 나머지는 gray-200
3. **본문 컨테이너** — `Container size="md" flex-1` > `VStack gap=6 py-6` > `fieldset` (`game-form-wizard.tsx:86-114`)
   - 제출 중에는 `fieldset disabled` + `opacity-45` (`:88-91`)
   - 1·2단계 블록은 다른 단계에서도 언마운트하지 않고 `hidden` 클래스로 숨긴다(입력·업로드 상태 보존용, `:92` 주석). 3단계 블록은 3단계에서만 마운트한다(`:99`)
   1. **[1단계] 기본 정보 블록 (GameBasicsFields)** — `game-form-wizard.tsx:93-95`, `src/widgets/game-form/ui/game-basics-fields.tsx:22-82`
      1. **게임명** — `game-basics-fields.tsx:38-46`. 라벨 "게임명" + 필수 표시 " *", placeholder "예: 마지막 열차", `maxLength=100`
      2. **룰** — `game-basics-fields.tsx:47-55`. 라벨 "룰 *", placeholder "예: 크툴루의 부름 7판, 던전월드", `maxLength=100`
      3. **시놉시스** — `game-basics-fields.tsx:56-58`. 라벨 "시놉시스", textarea `rows=4`, `maxLength=2000`, placeholder 없음
      4. **플레이타임** — `src/widgets/game-form/ui/play-time-field.tsx:30-59`. 라벨 "플레이타임". `[숫자 input(시간, id=playTime, min=1)] 시간 [숫자 input(분, min=0, max=59)] 분`. 초기값 3 / 0. 입력할 때마다 `formatPlayTime`으로 "N시간 M분" 문자열을 만들어 `setValue("playTime", …, { shouldDirty: true })` (`game-basics-fields.tsx:59-63`). 분이 "0"이거나 비어 있으면 분 부분은 빠진다 (`src/widgets/game-form/model/play-time.ts:18-23`)
      5. **최대 인원** — `game-basics-fields.tsx:64-75`. 폭 1/2, 라벨 "최대 인원 *", `type=number min=1 max=20` (`MAX_PLAYERS` `:9`)
      6. **대기 신청 (WaitlistField)** — `src/widgets/game-form/ui/waitlist-field.tsx:11-43`, 사용 `game-basics-fields.tsx:76-79`
         - 라벨 "대기 신청"(`Field`, `htmlFor` 없음). 2열 `Grid` 안에 블록 Chip "대기 받기" | "받지 않기" (`:5-8, 24-37`). 누르면 `setValue("waitlistEnabled", …, { shouldDirty: true })`
         - 초기값 "대기 받기"(`true`, `game-form.tsx:53`)
         - 아래 힌트 한 줄 (`:18-20`):
           - 대기 받기: "정원이 차도 대기로 신청을 받습니다. 빈자리가 나면 대기 순서대로 확정됩니다."
           - 받지 않기: "정원이 차면 더 이상 신청을 받지 않습니다. 목록에는 '모집 마감'으로 남습니다."
         - 효과: `false`인 게임은 확정 인원이 정원에 닿으면 `joinGame`이 "정원이 가득 차 신청할 수 없습니다."로 거부하고(`src/features/join-game/api/join-game.ts:49-52`), 모집 상태가 `full`("모집 마감", 회색)이 된다(`src/entities/game/model/derive-game-status.ts:20-22`)
   2. **[2단계] 이미지 블록 (GameMediaFields)** — `game-form-wizard.tsx:96-98`, `src/widgets/game-form/ui/game-media-fields.tsx:13-29`
      1. **썸네일** — `src/features/upload-thumbnail/ui/thumbnail-upload.tsx:43-71`, 사용 `game-media-fields.tsx:18-21`
         - 제목 텍스트 "썸네일" (label 요소 아님)
         - 값이 있으면 미리보기 `<img alt="썸네일 미리보기">` (h-32, object-cover)
         - `<input type="file" accept="image/*">`. 파일을 고르면 즉시 업로드 (§8)
         - 업로드 중에는 "업로드 중..." 표시, input disabled
         - 오류 문구: "이미지 파일만 업로드할 수 있어요.", "5MB 이하 이미지만 가능해요.", "로그인이 필요합니다.", 또는 Supabase Storage 오류 메시지 원문
         - 삭제(비우기) 버튼 없음
      2. **진행 이미지 (GameImagesUpload)** — `src/features/upload-thumbnail/ui/game-images-upload.tsx:12-123`, 사용 `game-media-fields.tsx:22-26`. `max = GAME_IMAGES_MAX`(5, `src/features/write-game/model/game-form.ts:7`)
         - 머리행: "진행 이미지"(subtitle1, label 요소 아님) + 오른쪽 "{올린 수} / 5"(body4, hint, tabular-nums) (`:65-70`)
         - 설명 "시놉시스나 진행에 필요한 이미지를 올려 주세요. 구인 상세에 올린 순서대로 보입니다." (`:71-73`)
         - 3열 `Grid`(gap 2) (`:75-106`)
           - 올린 이미지 타일: 정사각, `object-cover`, `alt="진행 이미지 {n}"`, 우상단 X IconButton(sm, `aria-label="진행 이미지 {n} 삭제"`, 업로드 중 disabled). 누르면 배열에서 뺀다(`:59-61, 76-91`)
           - 남은 칸이 있으면 점선 outline 정사각 버튼(ImagePlus 아이콘 + "추가"). 업로드 중 `loading`. 5장이 되면 렌더하지 않는다(`:93-105`)
         - 숨긴 `<input type="file" accept="image/*" multiple>` (`:108-115`). 한 번에 여러 장을 고를 수 있고, 같은 파일을 다시 고를 수 있게 선택값을 비운다
         - 오류 문구(body4, danger, `:116-120`): "5MB 이하 이미지 파일만 올릴 수 있어요." / "이미지는 최대 5장까지예요. 앞의 {남은 칸}장만 올립니다." / 업로드 오류 원문("로그인이 필요합니다." 또는 Supabase Storage 메시지)
         - 순서를 바꾸는 수단은 없다. 배열 순서(올린 순서)가 상세 갤러리 순서다
   3. **[3단계] 요약 카드** — `game-form-wizard.tsx:101-108`. 회색 라운드 박스
      - 1행: `title` 값, 없으면 "제목 미입력" (truncate)
      - 2행: `[rule, playTime, "최대 {maxPlayers}명"]` 중 값 있는 것을 " · "로 연결 (예: "CoC 7판 · 3시간 · 최대 4명"). 셋째 항목은 늘 문자열이라 행이 항상 보인다 (`:70-72`)
      - 탭해도 반응 없음 (편집 링크 없음)
   4. **[3단계] 일정 블록 (GameScheduleFields)** — `src/widgets/game-form/ui/game-schedule-fields.tsx:17-56`
      1. **일정 방식** — `src/widgets/game-form/ui/schedule-mode-field.tsx`. 라벨 "일정 방식". 2열 `Grid` 안에 블록 Chip "범위 조율" | "일시 지정". 누르면 `setValue("scheduleMode", …, { shouldDirty: true })`
         - 아래 힌트 한 줄 (`:12-16`):
           - 범위 조율: "참여자가 가능 시간을 입력하면 GM이 겹치는 시간대 중 하나를 확정합니다."
           - 일시 지정: "정해진 일시로 바로 모집합니다. 일정 조율 화면은 생기지 않습니다."
      2. **세션 일정 박스** — `game-schedule-fields.tsx`. primary-50 배경 테두리 박스. 방식에 따라 내용 전체가 바뀐다
         - **범위 조율** → `CoordinationRangeFields` (`src/widgets/game-form/ui/coordination-range-fields.tsx:20-62`)
           - 머리말 "세션 예정일" + 보조문 "언제까지 세션을 끝내고 싶은지, 며칠짜리 세션인지 알려주는 날짜예요."
           - **시작일** (`id=rangeStart`): `DatePicker`, `max = rangeEnd`(있을 때만), min 없음
           - **종료일** (`id=rangeEnd`): `DatePicker`, `min = 시작일+1`, `max = 시작일+14` (`endDateBounds`, `src/shared/lib/date-input.ts:23-34`). 시작일이 없으면 제한 없음
         - **일시 지정** → `FixedSessionField` (`src/widgets/game-form/ui/fixed-session-field.tsx:12-26`)
           - **세션 일시** (`id=confirmedAt`): `DateTimePicker`, min 없음
      3. **모집 마감 기한** — `game-schedule-fields.tsx:39-54`. 라벨 "모집 마감 기한 *", `DateTimePicker`, `min = toKstDateInput(new Date())`(오늘, KST 날짜. 날짜 단위 제한, 시각 제한 없음)
4. **하단 CTA (WizardFooter)** — `src/widgets/game-form/ui/wizard-footer.tsx:29-63`. `sticky bottom-[58px]`(BottomNav 바로 위), 상단 테두리
   - 3단계(마지막)에서 root 오류가 있으면 danger 텍스트로 먼저 표시 (`:32-36`)
   - 1단계: 전체 폭 "다음" (`type=button`) → `goNext()` (`:37-41`)
   - 2단계: "이전"(outline, 104px, `type=button`) → `goBack()` / "다음"(`type=button`) → `goNext()` (`:42-61`)
   - 3단계: "이전" / 제출 버튼 `submitLabel`="구인 등록", 제출 중에는 "저장 중…" + loading

### 공용 입력 컴포넌트

- **DatePicker** — `src/shared/ui/date-picker.tsx:21-57`. 트리거 버튼(`id`=필드 id)에 값 `YYYY-MM-DD`를 그대로 보여 주고, 비어 있으면 "날짜 선택"(hint 색)을 보여 준다. 달력 아이콘이 붙는다. 누르면 Popover 안에 `@trpg/ui` `Calendar`가 열린다. min/max 밖 날짜는 disabled(취소선) 처리되고 (`packages/ui/src/calendar.tsx:78-88`), 날짜를 고르면 값이 반영되고 팝오버가 닫힌다. invalid면 테두리가 danger-400이 된다.
- **DateTimePicker** — `src/shared/ui/date-time-picker.tsx:25-66`. DatePicker 아래에 Select 두 개(시 "00시"~~"23시", 분 "00분"~~"59분", 1분 단위)가 놓인다. 시각을 아직 고르지 않았으면 기본으로 "19시", "00분"을 보여 준다. 날짜가 비어 있으면 시/분을 바꿔도 값은 `""`로 남는다 (`:32`).
- **Field** — `packages/ui/src/field.tsx:14-36`. `<label htmlFor>` + required일 때 " *" + 자식 + 오류 문구(`text-xs text-danger-600`)를 그린다.

## 6. 상태별 화면

| 상태                  | 화면                                                                                                                                                                                                                                                                                      | 근거                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 라우트 로딩           | 로딩 표시 없음. 목록·상세 스켈레톤은 route group 안에 있어 이 경로에 적용되지 않는다                                                                                                                                                                                                      | `src/app/games/(list)/loading.tsx`, `src/app/games/[id]/(detail)/loading.tsx` |
| 초기                  | 1단계, 진행바 1/3, 플레이타임 3시간 0분, 최대 인원 4, 대기 신청 "대기 받기", 일정 방식 "범위 조율", 진행 이미지 "0 / 5"                                                                                                                                                                   | `game-form.tsx:40-54`                                                         |
| 1단계 검증 실패       | 오류 필드 아래에 문구 표시 + **게임명 필드로** 스크롤 (실제 첫 오류 필드와 무관. 최대 인원 오류여도 같음)                                                                                                                                                                                 | `game-form-wizard.tsx:52-58`                                                  |
| 2단계                 | 썸네일 + 진행 이미지. 진행바 2칸 채움                                                                                                                                                                                                                                                     | `game-form-wizard.tsx:96-98`                                                  |
| 2단계 검증 실패       | `trigger(["thumbnailUrl","images"])`가 실패하면 `scrollToField("thumbnailUrl")`를 부르지만 그 id를 가진 요소가 없어 스크롤되지 않는다. 진행 이미지 오류 문구를 그리는 곳도 없다(`GameMediaFields`가 `errors`를 읽지 않음). UI가 5장·업로드 URL만 넣으므로 정상 조작으로는 실패하지 않는다 | `game-form-wizard.tsx:22, 52-58`, `game-media-fields.tsx:13-29`               |
| 3단계                 | 요약 카드 + 일정 필드. 진행바 3칸 모두 채움                                                                                                                                                                                                                                               | `game-form-wizard.tsx:99-111`                                                 |
| 제출 검증 실패        | 첫 오류 필드가 속한 단계로 이동(`stepOfField`: 1단계 필드 → 1, 2단계 필드 → 2, 그 외 → 3)한 뒤 그 필드로 스크롤                                                                                                                                                                           | `game-form-wizard.tsx:25-29, 45-50`                                           |
| 썸네일 업로드 중      | "업로드 중...", 파일 input disabled. 제출·단계 이동은 막지 않음                                                                                                                                                                                                                           | `thumbnail-upload.tsx:53-64`                                                  |
| 진행 이미지 업로드 중 | "추가" 버튼 loading, 타일 삭제 버튼 disabled. 고른 파일을 순서대로 하나씩 올리고, 하나가 실패하면 거기서 멈추고 앞서 올린 것만 반영한다. 제출·단계 이동은 막지 않음                                                                                                                       | `game-images-upload.tsx:42-56`                                                |
| 제출 중               | fieldset 전체 disabled + 반투명, 제출 버튼 "저장 중…" + loading. "이전" 버튼과 앱바 뒤로는 막히지 않음                                                                                                                                                                                    | `game-form-wizard.tsx:88-91`, `wizard-footer.tsx:42-61`                       |
| 서버 오류             | 하단 CTA 위에 danger 문구 (3단계에서만 보임)                                                                                                                                                                                                                                              | `wizard-footer.tsx:32-36`, `game-form.tsx:60-63`                              |
| 성공                  | 토스트 "구인이 등록되었습니다" → 상세 화면으로 push                                                                                                                                                                                                                                       | `create-game-form.tsx:12`, `game-form.tsx:64-65`                              |
| 비로그인              | `/`로 리다이렉트                                                                                                                                                                                                                                                                          | `create-game-view.tsx:6`                                                      |
| 빈 상태               | 해당 없음                                                                                                                                                                                                                                                                                 | —                                                                             |
| 에러 경계             | 서버 예외(DB 오류 등)는 전역 `src/app/error.tsx` "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도"                                                                                                                                                                      | `src/app/error.tsx`                                                           |

## 7. 폼과 유효성 검사

- 폼 라이브러리: `react-hook-form` `useForm` + `zodResolver(gameFormSchema)` (`src/widgets/game-form/ui/game-form.tsx:38-53`). `mode` 옵션이 없으므로 기본값(onSubmit, 첫 제출 뒤 onChange 재검증)을 따른다.
- 스키마: `src/features/write-game/model/game-form.ts:8-86`. 서버 액션도 같은 스키마로 다시 검증한다 (`create-game.ts:13-16`). 서버 검증이 실패하면 첫 issue 메시지 하나를 root 오류로 돌려주고, 메시지가 없으면 "입력값을 확인하세요."를 쓴다.
- 테스트: `src/features/write-game/model/game-form.test.ts` (`pnpm test`).
- 에러 스크롤: `scrollToField(id)` = `document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" })` (`src/widgets/game-form/lib/scroll-to-field.ts:2-4`). id는 Field `htmlFor`와 같다.
- ❓ 확인 필요: 기본 필드 오류가 있을 때 `superRefine` 오류도 함께 나오는지(zod 버전별 동작). 이에 따라 `Object.keys(errors)[0]`로 정하는 "첫 오류 필드"가 달라진다.

### 단계 전환 규칙

| 동작                      | 처리                                                                                                                                                                                       | 근거                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| "다음" (1단계)            | `trigger(GAME_BASICS_FIELDS)` = `["title","rule","synopsis","playTime","maxPlayers","waitlistEnabled"]`. 실패하면 `scrollToField("title")`, 성공하면 2단계 + `window.scrollTo({ top: 0 })` | `game-form-wizard.tsx:22, 52-62`, `game-basics-fields.tsx:13-20` |
| "다음" (2단계)            | `trigger(GAME_MEDIA_FIELDS)` = `["thumbnailUrl","images"]`. 실패하면 `scrollToField("thumbnailUrl")`, 성공하면 3단계 + 맨 위로 스크롤                                                      | `game-form-wizard.tsx:22, 52-62`, `game-media-fields.tsx:8-11`   |
| "이전" / 앱바 ‹ (2·3단계) | `goBack`: 이전 단계 + `window.scrollTo({ top: 0 })`. 값 유지                                                                                                                               | `game-form-wizard.tsx:64-68`                                     |
| 제출 (3단계)              | 전체 스키마 검증. 실패하면 `onInvalid`(오류 필드의 단계로 이동 후 스크롤), 성공하면 `onValid` → 서버 액션                                                                                  | `game-form-wizard.tsx:45-50, 76`                                 |
| Enter 키 (1·2단계 input)  | 1·2단계에는 submit 버튼이 없다. ❓ 확인 필요: 암묵적 제출이 일어나 전체 검증으로 넘어가는지                                                                                                | `wizard-footer.tsx:37-61`                                        |

### 1단계 "게임 기본 설정"

| 필드 (id)                     | UI                        | 필수              | 규칙 (zod)                                          | 오류 메시지 원문                                                 | 클라이언트 제약                                                                       |
| ----------------------------- | ------------------------- | ----------------- | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 게임명 (`title`)              | TextInput                 | 예                | `string().trim().min(1).max(100)`                   | min: "게임명을 입력하세요." / max: 커스텀 메시지 없음 (zod 기본) | `maxLength=100`                                                                       |
| 룰 (`rule`)                   | TextInput                 | 예                | `string().trim().min(1).max(100)`                   | min: "룰을 입력하세요." / max: zod 기본                          | `maxLength=100`                                                                       |
| 시놉시스 (`synopsis`)         | Textarea                  | 아니오            | `string().max(2000).optional()`                     | zod 기본                                                         | `maxLength=2000`                                                                      |
| 플레이타임 (`playTime`)       | 시/분 number 2칸 → 문자열 | 아니오            | `string().max(100).optional()`                      | zod 기본                                                         | 시간 `min=1`, 분 `min=0 max=59` (HTML 속성일 뿐 검증은 없음. 음수나 60분 이상도 통과) |
| 최대 인원 (`maxPlayers`)      | number TextInput          | 예                | `string().min(1)` + refine: 정수이고 1 이상 20 이하 | "인원을 입력하세요." / "1~20 사이 인원을 입력하세요."            | `min=1 max=20`                                                                        |
| 대기 신청 (`waitlistEnabled`) | Chip 2개                  | 예(기본값 `true`) | `boolean()`                                         | —                                                                | —                                                                                     |

- 플레이타임 input은 `register`되지 않고 로컬 `useState`로 관리된다 (`play-time-field.tsx:20-27`). 폼에 "3시간 30분" 같은 문자열을 넣지만, RHF의 `playTime` 오류는 사실상 발생하지 않는다(100자 초과가 불가능).
- 시간 칸과 분 칸을 모두 비우면 `""` → DB에 null로 저장된다.

### 2단계 "이미지"

| 필드 (id)                                      | UI                             | 필수   | 규칙 (zod)                                     | 오류 메시지 원문                                                                                                                | 클라이언트 제약                                                                                                                                                                                                                                                                    |
| ---------------------------------------------- | ------------------------------ | ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 썸네일 (`thumbnailUrl`)                        | 파일 업로드 → 공개 URL         | 아니오 | `string().optional()` (URL 형식 검증 없음)     | — (컴포넌트 문구는 오른쪽 열)                                                                                                   | `accept="image/*"`, 컴포넌트 안에서 MIME·5MB 검사: "이미지 파일만 업로드할 수 있어요." / "5MB 이하 이미지만 가능해요." (`thumbnail-upload.tsx:7, 24-31`)                                                                                                                           |
| 진행 이미지 (`images`, 컨테이너 `id="images"`) | 여러 장 업로드 → 공개 URL 배열 | 아니오 | `array(z.url()).max(5)` (`game-form.ts:29-31`) | "이미지는 최대 5장까지 올릴 수 있습니다." — 화면에 그리는 자리가 없고, 서버 재검증에서 걸릴 때만 root 오류(3단계 하단)로 보인다 | `accept="image/*" multiple`. 고른 파일 중 하나라도 이미지가 아니거나 5MB 초과면 전부 거부: "5MB 이하 이미지 파일만 올릴 수 있어요." 남은 칸보다 많이 고르면 앞에서 남은 칸만큼만 올리고 "이미지는 최대 5장까지예요. 앞의 {남은 칸}장만 올립니다." (`game-images-upload.tsx:34-40`) |

### 3단계 "일정 · 마감"

| 필드 (id)                  | 표시 조건 | UI             | 필수            | 규칙                                                                                                                 | 오류 메시지 원문                                                                                                                   | 클라이언트 제약                 |
| -------------------------- | --------- | -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 일정 방식 (`scheduleMode`) | 항상      | Chip 2개       | 예(기본값 있음) | `enum(["fixed","coordinate"])` (`src/entities/game/model/schedule-mode.ts:4-7`)                                      | —                                                                                                                                  | —                               |
| 시작일 (`rangeStart`)      | 범위 조율 | DatePicker     | 조건부          | coordinate이고 비어 있으면 오류                                                                                      | "시작일을 입력하세요."                                                                                                             | `max=rangeEnd`                  |
| 종료일 (`rangeEnd`)        | 범위 조율 | DatePicker     | 조건부          | 비어 있으면 오류 → 아니면 `rangeEnd <= rangeStart`면 오류 → 아니면 차이가 14일(`GAME_RANGE_MAX_DAYS`)을 넘으면 오류  | "종료일을 입력하세요." / "종료일은 시작일보다 이후여야 합니다." / "세션 예정일 범위는 최대 14일까지 설정할 수 있습니다."           | `min=시작일+1`, `max=시작일+14` |
| 세션 일시 (`confirmedAt`)  | 일시 지정 | DateTimePicker | 조건부          | fixed이고 비어 있으면 오류                                                                                           | "세션 일시를 입력하세요."                                                                                                          | 없음 (과거 선택 가능)           |
| 모집 마감 기한 (`endDate`) | 항상      | DateTimePicker | 예              | `string().min(1)` + (fixed) `endDate > confirmedAt`이면 오류 + (coordinate) `endDate` 날짜부분 `> rangeEnd`이면 오류 | "모집 마감 기한을 입력하세요." / "모집 마감은 세션 일시보다 이전이어야 합니다." / "모집 마감은 조율 종료일보다 이전이어야 합니다." | `min=오늘` (날짜만)             |

규칙 원문 위치: `game-form.ts:16-22`(maxPlayers), `:24`(endDate), `:29-31`(images), `:32`(waitlistEnabled), `:35-41`(confirmedAt 필수), `:43-49`(마감 < 세션), `:50-60`(마감 ≤ 조율 종료), `:61-91`(범위).

규칙 세부:

- 날짜 비교는 로컬 ISO 문자열의 사전순 비교다 (`game-form.ts:36` 주석).
- coordinate: 마감일과 `rangeEnd`가 **같은 날이면 허용**된다 (`slice(0,10) > rangeEnd`일 때만 오류). 오류 문구는 "이전이어야"라고 되어 있다.
- fixed: 마감 시각과 세션 시각이 **같으면 허용**된다 (`>`일 때만 오류).
- 스키마에 없는 규칙: 마감 기한이 현재 이후인지, 시작일이 오늘 이후인지, 마감이 `rangeStart` 이전인지, 세션 일시가 미래인지.
- 시작일을 바꿔도 이미 고른 종료일은 다시 검증하거나 초기화하지 않는다 (첫 제출 전까지는 RHF 기본 모드라 오류가 뜨지 않음).
- 일정 방식을 바꾸면 반대편 박스가 언마운트되지만 RHF 값은 남는다(`shouldUnregister` 기본 false). 검증은 현재 방식 기준으로만 한다.

## 8. 액션과 부수효과

### 썸네일·진행 이미지 업로드 (파일 선택 즉시, 클라이언트)

`src/features/upload-thumbnail/api/upload-thumbnail.ts:4-20`. 썸네일과 진행 이미지가 같은 함수를 쓴다. 진행 이미지는 고른 파일마다 순서대로 호출한다(`game-images-upload.tsx:42-56`).

1. 브라우저 Supabase 클라이언트로 `auth.getUser()`. 사용자가 없으면 "로그인이 필요합니다."
2. 경로 `{user.id}/{randomUUID}.{확장자}`로 Storage 버킷 `game-thumbnails`에 `upload(upsert: false)`. 서버 정리 쪽은 같은 이름을 상수 `GAME_IMAGE_BUCKET`로 본다(`src/shared/lib/storage-path.ts:2`)
3. `getPublicUrl` → 썸네일은 `setValue("thumbnailUrl", url, { shouldDirty: true })`, 진행 이미지는 배열 끝에 붙여 `setValue("images", urls, { shouldDirty: true })` (`game-media-fields.tsx:18-26`)

- 버킷과 정책: `drizzle/0003_thumbnail_storage.sql` (public 읽기, authenticated 쓰기, 소유자만 수정·삭제)
- 등록 화면에서는 파일을 지우지 않는다. 등록 전에 썸네일을 교체하거나 진행 이미지 타일을 지워도, 등록을 포기해도 이미 올린 객체는 남는다. 코드 주석이 "등록하다 그만둔 업로드는 여기서 못 잡는다"고 적고 있다(`src/shared/server/game-files.ts:10-11`). 등록 뒤 수정·삭제 때의 정리는 [games-edit.md §8](./games-edit.md#8-액션과-부수효과).

### 구인 등록 `createGame` (Server Action)

`src/features/write-game/api/create-game.ts:8-47`

| 순서 | 동작                                                                             | 근거     |
| ---- | -------------------------------------------------------------------------------- | -------- |
| 1    | `getCurrentUser()`. 없으면 `{ error: "로그인이 필요합니다." }`                   | `:10-11` |
| 2    | `gameFormSchema.safeParse`. 실패하면 첫 issue 메시지 또는 "입력값을 확인하세요." | `:14-17` |
| 3    | `games` INSERT(`images`, `waitlist_enabled` 포함) → id 반환 (트랜잭션 없음)      | `:20-38` |
| 4    | 방금 만든 row를 `gm.username`과 함께 다시 조회                                   | `:40-43` |
| 5    | `notifyGameCreated(game, username ?? "?")` → 스레드 id                           | `:44`    |
| 6    | 스레드 id가 있으면 `games.discord_thread_id` UPDATE                              | `:45-47` |
| 7    | `{ redirect: "/games/{id}" }`                                                    | `:49`    |

- 클라이언트 처리 (`game-form.tsx:55-65`): `error`가 있으면 `form.setError("root")`, 없으면 `toast.success("구인이 등록되었습니다")` → `router.push(redirect)`.
- `revalidatePath` 호출 없음.

### Discord 모집 공지 (`notifyGameCreated`)

`src/shared/server/notify-game-created.ts`, `send-game-images.ts`, `@trpg/discord` (`sendDiscordMessage`, `startDiscordThread`)

- 봇이 `POST /channels/{DISCORD_RECRUIT_CHANNEL_ID}/messages`로 보낸다. 채널 id가 없으면 경고 로그만 남기고 건너뛴다.
- content: "📢 새로운 구인 글이 올라왔어요!"
- embed(`recruitEmbed`): title "🎲 {title}", url = 상세 URL(`NEXT_PUBLIC_SITE_URL` 또는 `VERCEL_URL`이 있을 때만), description "**개요**\n{synopsis}" (4000자 넘으면 잘라서 "…"), color 0x5865f2, fields "📜 사용 룰" / "👥 인원"("{확정}/{정원}명") / "🕒 시간"(`formatGameSchedule`) / URL이 있으면 "**[▶ 참여하러 가기](url)**", image = 썸네일, footer "GM {gmName} · 마감 {formatMonthDay(endDate)}", timestamp = 게임 생성 시각.
- 스레드: `POST /channels/{channel_id}/messages/{id}/threads` (name = 제목 앞 100자, auto_archive 10080분). 스레드 id = 공지 메시지 id. 실패하면 undefined.
- 진행 이미지: 스레드가 열리고 `images`가 1장 이상이면 스레드에 메시지 하나로 보낸다(`sendGameImages`). embed마다 `image`만 넣고 `url`을 같게 맞춰 Discord가 갤러리(4장씩)로 묶는다. 구인 수정으로 이미지가 바뀌어도 다시 보내지 않는다.
- 로스터(참여·취소·승격·강등·내보내기)나 구인 내용이 바뀌면 `refreshRecruitPost`가 같은 embed로 공지 메시지를 PATCH한다(인원 갱신).
- 실패는 모두 삼킨다. 요청마다 `AbortSignal.timeout(8000)`이므로 최악의 경우 등록 응답이 약 16초 늦어질 수 있다.

## 9. 반응형과 접근성 현황

반응형

- `Container size="md"` 단일 컬럼. 브레이크포인트별 분기 없음 (`game-form-wizard.tsx:61`).
- 폼 최소 높이 `calc(100dvh-58px)`, CTA `sticky bottom-[58px]`는 BottomNav 높이 58px를 하드코딩한 값이다 (`game-form-wizard.tsx:52`, `wizard-footer.tsx:5, 23`).
- 최대 인원 필드는 `w-1/2` 고정.

접근성

- 텍스트 입력은 `Field` `label htmlFor`로 연결된다. DatePicker는 트리거 버튼에 id가 붙어 라벨과 연결된다.
- 오류 문구가 `aria-describedby`로 연결되지 않고, `aria-invalid`도 없다 (시각적 테두리색만. `packages/ui/src/field.tsx:33`, `text-input.tsx:20-21`).
- 필수 표시는 시각 " *"뿐이고 `required`/`aria-required` 속성은 없다.
- 플레이타임: 시간 input에 `aria-label="시간"`이 있어 라벨 "플레이타임"을 덮어쓴다. 분 input은 `aria-label="분"` (`play-time-field.tsx:37, 50`).
- 일정 방식 Chip은 일반 `button`이다. `aria-pressed`나 radiogroup 역할이 없어 선택 상태가 보조기기에 전달되지 않는다 (`packages/ui/src/chip.tsx:42-49`). `Field label="일정 방식"`에는 `htmlFor`가 없다.
- DateTimePicker의 시/분 `Select.Trigger`에는 라벨이나 aria-label이 없다 (`date-time-picker.tsx:45, 55`).
- 썸네일 제목은 `Text`라서 file input과 라벨로 연결되지 않는다 (`thumbnail-upload.tsx:45`). 진행 이미지 제목 "진행 이미지"도 `Text`이고, 파일 input은 숨겨져 "추가" 버튼으로만 연다(`game-images-upload.tsx:65-70, 108-115`). 타일 삭제 버튼에는 `aria-label="진행 이미지 {n} 삭제"`가 있다.
- 대기 신청 Chip도 일정 방식과 같은 일반 `button`이라 선택 상태가 보조기기에 전달되지 않는다. `Field label="대기 신청"`에 `htmlFor`가 없다(`waitlist-field.tsx:24-37`).
- 단계 전환 시 포커스를 옮기지 않고, 진행바에 `role="progressbar"`나 텍스트 대안이 없다 (앱바의 "1 / 3" 텍스트만 있음).
- 앱바 뒤로 버튼 `aria-label="뒤로"`. 달력 월 이동 `aria-label="이전 달"`, `"다음 달"`.

## 10. 현재 UX 문제점 메모

코드에서 확인한 사실만 적는다.

1. ~~라우트 로딩 폴백이 구인 목록 스켈레톤이다.~~ 해결: 스켈레톤이 route group(`src/app/games/(list)/loading.tsx`)으로 옮겨져 이 경로에 적용되지 않는다. 대신 `/games/new`에는 로딩 표시가 없다.
2. 1단계 "다음"이 실패하면 실제 오류 필드(최대 인원 포함)와 상관없이 항상 게임명으로 스크롤한다 (`game-form-wizard.tsx:56-58`). 2단계 실패 시 스크롤 대상 id `thumbnailUrl`을 가진 요소가 없다.
3. 1단계 앱바 뒤로는 진입 경로와 관계없이 `/games`로 간다 (`game-form-wizard.tsx:82`). 입력 중 이탈 확인도 없다.
4. 일정 방식을 "일시 지정"에서 세션 일시를 넣은 뒤 "범위 조율"로 되돌리면 `confirmedAt` 값이 남아 저장된다 (`create-game.ts:33`). 반대로 바꾸면 `rangeStart`와 `rangeEnd`가 남는다. 코드상 `confirmedAt`은 "세션 시작 확정" 컬럼이다 (`schema.ts:49`).
5. 모집 마감 기한과 세션 일시가 과거여도 스키마를 통과한다. 달력 min(오늘)은 마감 날짜에만 걸려 있다.
6. 오류 문구는 "이전이어야"인데 실제로는 같은 날짜(coordinate)나 같은 시각(fixed)을 허용한다 (`game-form.ts:37, 47`).
7. 플레이타임 input의 `min`/`max`는 검증되지 않는다. 음수, 소수, 60분 이상도 문자열로 저장된다.
8. 썸네일·진행 이미지 업로드가 끝나기 전에도 단계 이동과 제출을 할 수 있다 (업로드 상태가 폼 pending과 분리됨). 썸네일을 지우는 수단이 없다. 등록 전에 교체·삭제한 파일과 등록을 포기한 업로드는 Storage에 남는다 (`game-files.ts:10-11`).
9. 서버 오류 문구는 3단계 하단에서만 보인다 (`wizard-footer.tsx:32-36`). 서버가 앞 단계 필드 오류를 돌려줘도 해당 필드로 이동하지 않는다 (root 오류 하나로만 표시).
10. 등록 응답이 Discord 공지와 스레드 생성(각 8초 타임아웃)을 기다린다 (`create-game.ts:44`).
11. ~~서버 시각 파싱 타임존 문제 가능성.~~ 해결: `fromKstDateTimeInput`으로 KST 해석(`create-game.ts:33, 36`).
12. 비로그인 진입은 안내 없이 `/`로 리다이렉트된다.
13. DateTimePicker는 날짜 없이 "19시 00분"을 보여 주지만 값은 비어 있다. 시각을 먼저 골라도 날짜를 고르기 전에는 저장되지 않는다 (`date-time-picker.tsx:29-32`).
14. 제출 중에도 "이전" 버튼과 3단계 앱바 뒤로 버튼이 활성 상태다 (`wizard-footer.tsx:42-50`).
15. 진행 이미지 순서를 바꿀 수 없다. 상세 갤러리 순서는 올린 순서다 (`game-images-upload.tsx:42-56`).
16. 진행 이미지 스키마 오류("이미지는 최대 5장까지 올릴 수 있습니다.", URL 형식)를 필드 근처에 그리는 곳이 없다 (`game-media-fields.tsx`가 `errors`를 읽지 않음).
17. 한 번에 고른 여러 파일 중 하나라도 조건(이미지·5MB)을 어기면 나머지도 전부 올리지 않는다 (`game-images-upload.tsx:34-37`).
