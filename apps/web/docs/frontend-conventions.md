# 프론트엔드 개발 규칙 (FSD · 컴포넌트)

이 프로젝트의 UI는 **프리미티브 라이브러리(`packages/ui`, `@trpg/ui`)** + **FSD 레이어(`apps/web/src`)**로 구성한다. 아래 규칙을 지켜 구조 일관성을 유지한다.

## 1. 레이어 경계

| 레이어             | 역할                                                      | 예                                                                                    |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `packages/ui`      | 도메인 무관 순수 UI 키트                                  | Button, IconButton, Chip, Select, TextInput, Field, Card                              |
| `packages/discord` | Discord REST 클라이언트(도메인 무관)                      | sendDiscordMessage, editDiscordMessage, startDiscordThread, renameDiscordThread       |
| `shared/ui`        | 앱 공용(도메인 약함) 조합 컴포넌트                        | AppBar, Sheet, EmptyState, StatusNotice, ThemeToggle                                  |
| `entities/*`       | 도메인 엔티티의 **도메인 규칙 + 작고 원자적인 표시** 단위 | game, profile, availability                                                           |
| `features/*`       | **단일 사용자 동작**(server action·toggle 등 상태 변경)   | JoinGameButton, DeleteGameButton, GameStatusFilter, GameScheduleLink, ThumbnailUpload |
| `widgets/*`        | **두 개 이상의 화면이 공유하는** 조합 블록 (아래 주의)    | game-form, session-list                                                               |
| `views/*`          | 한 화면의 조합 전체 + 라우트 글루                         | GamesView, GameDetail, ParticipantManager                                             |

**import 방향은 아래로만**: `shared ← entities ← features ← widgets ← views`. 상위 레이어를 import하지 않는다(예: feature는 widget을 import 금지).

**절대 경로는 2 depth까지만**: `@/레이어/슬라이스`(`@/features/join-game`) 또는 `@/shared/세그먼트`(`@/shared/ui`)까지. 슬라이스 내부 파일(`@/features/join-game/api/join-game`)이나 shared 세그먼트 내부(`@/shared/ui/app-bar`)를 직접 가리키지 않는다. 슬라이스/세그먼트마다 `index.ts` 배럴이 public API다. 같은 슬라이스 안에서는 상대 경로.

`pnpm lint:fsd`(`scripts/fsd-check.mjs`)가 위 세 규칙(depth·방향·교차 슬라이스)을 검사한다. 도메인 규칙·폼 스키마의 자가 검증은 `pnpm check`.

**shared 세그먼트는 런타임으로 나뉜다**: 배럴은 tree-shaking되지 않으므로 서버 전용 모듈이 섞이면 클라이언트 번들이 깨진다.

| 세그먼트                | 내용                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/api`            | 클라이언트 안전: `ActionResult`, Supabase 브라우저 클라이언트, 목록 정렬/필터 파라미터                                                                  |
| `shared/server`         | 서버 전용(`server-only`): drizzle `db`·스키마 재노출(원본은 `packages/database`), DB 읽기 쿼리, Supabase 서버 클라이언트·`getCurrentUser`, Discord 알림 |
| `shared/lib`            | 순수 유틸: 날짜 포맷, 슬롯 계산                                                                                                                         |
| `shared/ui`             | 앱 공용 조합 컴포넌트 + `toast`, `useAction`, `BoundaryFallback`                                                                                        |
| `shared/error-boundary` | 클라이언트: `ErrorBoundary`(`catchError`). check 스크립트가 로드하지 않도록 `shared/ui`와 분리 (§8)                                                     |

DB 읽기(CRUD)는 도메인 규칙이 아니라 인프라이므로 entity가 아니라 `shared/server`에 둔다(FSD 권장). 클라이언트 컴포넌트가 스키마 타입만 필요하면 `import type { Game } from "@/shared/server"`로 가져온다(타입 import는 번들에 남지 않는다). 세션 쿠키 갱신은 유일한 사용처인 `src/proxy.ts`가 소유한다.

**레이어마다 나누는 축이 다르다.** 같은 `game`이라는 낱말이 여러 레이어에 나와도 기준은 다르다.

| 레이어     | 나누는 축 | 답하는 질문            | 예                          |
| ---------- | --------- | ---------------------- | --------------------------- |
| `entities` | 명사      | 이것은 무엇인가        | game, profile, availability |
| `features` | 동사      | 사용자가 무엇을 하는가 | join-game, delete-game      |
| `views`    | 화면      | 이 라우트는 무엇인가   | games, game-detail          |

**feature 슬라이스는 하나의 동작이다.** FSD 문서의 표현으로 "하나의 피처는 사용자에게 유용한 하나의 기능이며, 여러 기능이 한 피처에 구현되면 경계 위반"이다. `manage-game`처럼 아무 동작도 지칭하지 않는 포괄어로 묶으면 엔티티명만 피한 자루가 된다. 단, 엔티티와 같은 시험대를 적용한다. **쪼갰을 때 교차 import가 생기면 한 동작으로 본다.** 지금 남아 있는 두 예외는 그래서다.

- `write-game`: 등록과 수정이 `gameFormSchema`를 공유한다
- `adjust-roster`: 추첨·승격·강등·내보내기가 `adjustRoster` 한 트랜잭션 가드(게임 행 잠금 · GM 확인 · 세션 잠김 확인)를 공유한다

사용처가 한 곳뿐이고 상태 변경이 없는 표시/탭 UI는 feature로 빼지 말고 그 view 안에 둔다(예: `ScheduleTabs`, `SessionTabFilter`, `Heatmap`). 서버 액션 반환은 `shared/api`의 `ActionResult` 하나를 쓴다.

**widgets는 새로 만들지 않는다.** FSD v2.1 공식 레이어 레퍼런스가 이 레이어를 권장하지 않는다. UI 블록이 조회·상태·이벤트를 품으면 사용자 흐름을 담당하는 features와 책임이 겹쳐 경계가 흐려지기 때문이다. 대신 이렇게 둔다.

- 한 화면 전용 조합 → 그 `views/*` 슬라이스 안에
- 재사용되는 동작과 그 UI → `features/*`
- 맥락 없는 UI → `shared/ui`

이미 있는 `widgets/game-form`과 `widgets/session-list`는 실제로 두 화면이 공유하므로 남긴다. 세 번째 화면이 생기기 전에는 widgets에 슬라이스를 늘리지 않는다.

**엔티티는 실제 개념 단위로 나누되, 쪼개면 교차 import가 생기는 것은 합친다.** FSD는 "슬라이스는 같은 레이어의 다른 슬라이스를 쓸 수 없다"고 못박으므로, 이 규칙이 곧 분할 가능 여부의 시험대다. 현재 엔티티는 셋이다.

| 엔티티         | 담는 개념                          | 비고                                                                                                                                       |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `game`         | 구인글 + 참여자 로스터 + 세션 일정 | 셋은 한 aggregate다. `deriveGameStatus`가 참여자 수로 모집 상태를 정하고, 세션 일정은 games의 컬럼이다. 쪼개면 양방향 교차 import가 생긴다 |
| `availability` | 가능 시간 집계·후보 슬롯           | game 쪽과 서로 참조가 없어 독립 슬라이스로 뗐다                                                                                            |
| `profile`      | 사용자 표시 정보                   | 특정 feature만 쓰는 값(기본 가능 시간대 프리셋)은 그 feature의 `model`에 둔다                                                              |

**entity에는 도메인 규칙과 원자 표시만**: 상태 판정(`deriveGameStatus`, `deriveSessionState`), 정원·순번 계산, 작은 표시 단위. 특정 화면의 문구·탭·라우트를 만드는 뷰 모델(`toSessionCard`, `bucketHosted`)이나 액션 존 분기(`deriveActionView`), 목록 행 문구(`gameSubline`)는 그걸 그리는 view·widget의 `model/`에 둔다. 화면별 구분이 필요하면 새 타입을 만들지 말고 도메인에 이미 있는 `SessionRole`(`host` | `player`)을 쓴다.

**표시 컴포넌트의 체급**: 엔티티는 작고 반복되는 원자적 표시 단위(목록 카드·행 등)만 담는다. **순수 표시라도 덩치가 크면(복합 정보 블록·상세 표 등) entity가 아니라 widget에 둔다.** 표시 컴포넌트는 링크·동작을 갖지 않고, 네비게이션/상호작용은 상위(widget·view)가 감싸서 조합한다. (예: `GameCard`/`GameSummary`/`GameRow`는 링크 없는 entity, 상세 링크는 이를 감싸는 view가 소유. `GameInfoTable`은 순수 표시지만 커서 상세 화면에 둔다.)

## 2. 상호작용 요소는 프리미티브만 사용

- 버튼·셀렉트·칩·아이콘버튼은 **오직 `@trpg/ui`**에서 가져온다. raw `<button>`, `<Link>`/`<div>`를 버튼처럼 스타일링한 손코딩 금지.
- **링크처럼 보이는 버튼**은 `<Button asChild><Link/></Button>` (또는 `IconButton asChild`). `asChild`는 자식 엘리먼트에 버튼 스타일을 입혀 실제 `<a href>`로 렌더한다.
- **선택 가능한 pill/토글**은 `<Chip>` (`shape="pill" | "block"`, `selected`, `asChild`).
- **바텀시트 메뉴 행**은 `<Sheet.Item>` (Button ghost 기반, `asChild`로 Link 렌더).
- **즉시 적용되는 단일 선택 세그먼트**(테마 시스템/라이트/다크 등)는 `<SegmentControl>` (`options`, `value`, `onChange`).
- 예외(프리미티브와 룩이 다른 1회성 UI)는 손코딩하되 `// ponytail:` 주석으로 이유를 남긴다.

## 3. 핸들러는 props로, 레이아웃은 호출부가

- 프리미티브는 고유 역할만 한다. 동작은 `onClick` 등 **props로 인계**한다.
- feature 버튼은 자기 동작(server action)과 결과 문구(토스트)를 **내부에 소유한다.** action·successMessage를 props로 받는 범용 버튼을 만들지 않는다(예: `JoinGameButton`/`LeaveGameButton`).
- 여러 맥락에서 재사용되는 feature 버튼(LoginButton, JoinGameButton 등)은 **크기·너비를 하드코딩하지 않는다.** `size`/`className`을 호출부(위젯·뷰)가 지정한다.
- 폼 내부 제출 버튼은 그 폼이 곧 호출부이므로, 폼이 `className`으로 레이아웃을 지정해도 된다.

## 4. 폼의 레이어

- **단일 동작 폼**(하나의 action + 일반 필드) → **feature**. widget으로 올리면 빈 레이어만 늘어난다. (예: edit-profile, confirm-session)
- **조합형 폼**(2개 이상 독립 feature/entity를 조합) → 그 화면의 **view**. 두 화면이 공유할 때만 widget. (예: game-form = upload-thumbnail + write-game 조합이고, 등록·수정 두 화면이 쓴다. 구인 삭제는 상세 GM 메뉴 한 곳에만 둔다)
- Input/Field/Select 등 도메인 없는 입력 컨트롤은 feature가 아니라 `packages/ui`에 둔다.

## 5. 파생 상태 우선 (인라인 조건부 지양)

조건/계산으로 결정되는 값은 JSX 안 삼항으로 쓰지 말고 `return` 이전에 이름 붙인 파생 상태(const)로 정의한다.

```tsx
// bad
<Button variant={variant === "outline" ? "outline" : "solid"} />;

// good
const buttonVariant = variant === "outline" ? "outline" : "solid";
return <Button variant={buttonVariant} />;
```

## 6. 색은 토큰만 쓴다

다크 모드는 `packages/ui/src/styles.css`의 `.dark`가 `--color-*` 변수를 덮어쓰는 방식이다. 그래서 **생 hex(`bg-[#F3F3F7]`)와 Tailwind 기본 팔레트(`text-red-600`)는 테마가 바뀌어도 그대로 남아 화면을 반쯤 밝은 채로 만든다.** `pnpm lint:tokens`가 두 패키지를 훑어 이를 막는다.

- 새 색이 필요하면 `styles.css`의 `@theme`에 추가하고 **`.dark` 값도 같이 넣는다.**
- **유틸리티(`bg-*`) 없이 인라인 `var()`로만 쓰는 색은 `@theme`이 아니라 `:root`에 둔다.** Tailwind v4는 쓰이지 않는 `@theme` 토큰을 빌드에서 걷어내서, 손으로 쓴 `.dark` 값만 남고 라이트 값이 사라진다(히트맵이 실제로 이렇게 깨졌다).
- **숫자 램프(`gray-*`, `primary-*`)는 한 역할에만 쓴다.** 같은 단계를 배경과 글씨 양쪽에 쓰면 다크에서 한쪽이 반드시 깨진다. 예를 들어 `primary-700`은 solid 버튼의 hover 배경이라 뒤집을 수 없어서, 틴트 배경 위의 글씨는 `--color-tinted-ink`가 따로 맡는다.
- 배경·테두리·글씨가 한 세트로 움직이는 것은 **역할 토큰**으로 묶는다: `tinted-{bg,bg-hover,border,ink}`, `heat-{0..5,ink,ink-strong}`, `primary-ink`, `hint`.
- **항상 흰 글씨가 얹히는 솔리드 배경은 `*-solid` 토큰을 쓴다**(`danger-solid`, `success-solid`). 숫자 램프의 진한 단계(`success-700` 등)는 다크에서 글씨색으로 뒤집히므로 배경으로 쓰면 대비가 무너진다.
- **보조 문구는 두 단계뿐이다.** `foreground="muted"`(gray-600)와 `foreground="hint"`(hint 토큰). gray 램프에는 surface 위에서 AA(4.5:1)를 넘는 중간 단계가 없어서 hint는 역할 토큰으로 따로 뺐다. 계층은 대비까지 순서를 지킨다: normal 17.9 > muted 6.3 > hint 4.9(라이트 기준).
- **읽는 글씨는 4.5:1, 아이콘·그래픽은 3:1**이 기준이다. `gray-400`은 이제 장식 전용(마감 진행바, 비활성 페이지네이션)이며 글씨에 쓰지 않는다.
- 반전이 필요한 대비는 토큰 조합으로 표현한다. 선택된 칩의 `bg-gray-900 text-surface`는 라이트에서 검정 배경에 흰 글씨, 다크에서 밝은 배경에 어두운 글씨로 알아서 뒤집힌다.
- 예외는 둘뿐이다. 토큰을 정의하는 `styles.css`, 그리고 테마와 무관한 고정 색인 아바타의 사람별 팔레트(`avatar.tsx`). 그 외에 불가피하면 해당 줄에 `tokens-check-ignore` 주석으로 이유를 남긴다.

## 7. 코드 스타일

- **주석은 꼭 필요할 때만.** 코드를 다시 설명하는 주석, 섹션 헤더, JSX 라벨 주석은 쓰지 않는다. 남기는 것은 `ponytail:`, `tokens-check-ignore`, 도구 지시자, 그리고 없으면 버그가 다시 생길 법한 "왜"뿐이다.
- **줄임말 이름 금지.** `p`/`g`/`e`/`err`/`res`/`ctx`/`prev` 대신 `participant`/`game`/`event`/`error`/`response`/`context`/`previous`처럼 전체 단어를 쓴다.
- **도메인 값은 상수로.** 문자열 리터럴 대신 `as const` 객체(`GAME_STATUS`, `PARTICIPANT_STATUS`, `SCHEDULE_MODE`, `SESSION_STATE`, `SESSION_ROLE`, `GAME_SORT`, `GAME_STATUS_FILTER` 등)를 쓴다. 새 유니온은 `export const FOO = {...} as const; export type Foo = (typeof FOO)[keyof typeof FOO];`로 정의한다.
- **import 정렬**은 `oxfmt`(`.oxfmtrc.json`의 `sortImports`)가 맡고, 그룹(builtin · external · internal · 상대 경로) 사이에 빈 줄을 넣는다.
- **1 파일 1 컴포넌트/함수.** 파일에 최상위 함수·컴포넌트가 둘 이상이면 각각 파일로 나눈다. 함수가 커지면 이름 붙인 작은 함수로 나눠 파일을 분리한다. 예외는 `*.check.ts`, `index.ts` 배럴, 함수 본문 안의 핸들러, 그리고 Next.js 라우트 파일이 요구하는 export뿐이다.

## 8. 에러 처리

에러마다 **어디에 보일지(`ERROR_DISPLAY`: `toast` | `page`)**를 정하고, 보여 주는 일은 공용 경로가 맡는다.

- **서버 액션은 예상된 실패를 throw하지 않고 `ActionResult`로 돌려준다.** 기본은 토스트이고, 화면을 더 쓸 수 없는 실패(게임이 사라짐 등)는 `errorDisplay: ERROR_DISPLAY.page`(예: `GAME_NOT_FOUND_RESULT`)로 표시한다. 서버에서 throw한 에러는 프로덕션에서 메시지가 지워지므로 문구를 전하는 수단이 아니다.
- **클라이언트는 `useAction()`(`@/shared/ui`)으로 액션을 부른다.** `run(action, { onSuccess, onError })`가 트랜지션·토스트·`redirect` 이동을 처리한다. 폼처럼 인라인으로 보일 곳만 `onError`를 넘긴다. page 에러와 예상 못 한 throw는 트랜지션을 타고 가장 가까운 ErrorBoundary로 올라간다.
- **경계**
  - `app/error.tsx`(라우트)·`app/global-error.tsx`(루트 레이아웃)는 `BoundaryFallback`으로 에러 화면을 그린다.
  - 화면 일부만 감쌀 때는 `ErrorBoundary`(`@/shared/error-boundary`)를 쓴다. `display={ERROR_DISPLAY.toast}`로 감싼 영역은 토스트 + 재시도 버튼으로 끝나고, page 에러는 부모 경계로 다시 던진다(예: 상세 하단 액션 존).
  - `ErrorBoundary`는 `next/error`의 `catchError`를 쓰는데, Node(tsx)에서 named import가 안 돼 `shared/ui` 배럴에 넣으면 `pnpm check`가 깨진다. 그래서 세그먼트를 따로 둔다.
- **React Query**: 조회는 보여 줄 데이터가 없을 때만 경계로 던지고(재조회 실패로 편집 중 상태를 날리지 않는다), 뮤테이션 실패는 `MutationCache`가 토스트로 알린다. 문구는 `meta.errorMessage`로 바꾼다. `mutationFn`에서 `ActionResult.error`는 `AppError`로 바꿔 던진다.
- **경계 밖**(토스트 콜백, 파일 업로드 같은 비트랜지션 async)은 `try/catch`에서 `reportError`(토스트) 또는 인라인 상태로 처리한다.
