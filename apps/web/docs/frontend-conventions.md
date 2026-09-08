# 프론트엔드 개발 규칙 (FSD · 컴포넌트)

이 프로젝트의 UI는 **프리미티브 라이브러리(`packages/ui`, `@trpg/ui`)** + **FSD 레이어(`apps/web/src`)**로 구성한다. 아래 규칙을 지켜 구조 일관성을 유지한다.

## 1. 레이어 경계

| 레이어        | 역할                                                            | 예                                                                                |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `packages/ui` | 도메인 무관 순수 UI 키트                                        | Button, IconButton, Chip, Select, TextInput, Field, Card                          |
| `shared/ui`   | 앱 공용(도메인 약함) 조합 컴포넌트                              | AppBar, Sheet, EmptyState, StatusNotice, ThemeToggle                              |
| `entities/*`  | 도메인 엔티티의 **작고 원자적인 표시** 단위                     | GameCard, GameSummary, GameRow                                                    |
| `features/*`  | **단일 사용자 동작**(server action·toggle 등 상태 변경)         | JoinButton, DeleteGameButton, GameStatusFilter, GameScheduleLink, ThumbnailUpload |
| `widgets/*`   | **entity + feature 조합** 블록, 또는 **덩치 큰 순수-표시 블록** | game-detail, game-board, game-form, game-list-item, GameInfoTable                 |
| `views/*`     | 위젯/피처 조합 + 라우트 글루                                    | GamesView, MyPageView                                                             |

**import 방향은 아래로만**: `shared ← entities ← features ← widgets ← views`. 상위 레이어를 import하지 않는다(예: feature는 widget을 import 금지).

**절대 경로는 2 depth까지만**: `@/레이어/슬라이스`(`@/features/join-game`) 또는 `@/shared/세그먼트`(`@/shared/ui`)까지. 슬라이스 내부 파일(`@/features/join-game/api/join-game`)이나 shared 세그먼트 내부(`@/shared/ui/app-bar`)를 직접 가리키지 않는다. 슬라이스/세그먼트마다 `index.ts` 배럴이 public API다. 같은 슬라이스 안에서는 상대 경로.

**shared 세그먼트는 런타임으로 나뉜다**: 배럴은 tree-shaking되지 않으므로 서버 전용 모듈이 섞이면 클라이언트 번들이 깨진다.

| 세그먼트         | 내용                                                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| `shared/api`     | 클라이언트 안전: `ActionResult`, Supabase 브라우저 클라이언트, 목록 정렬/필터 파라미터 |
| `shared/server`  | 서버 전용(`server-only`): drizzle `db`·스키마, DB 읽기 쿼리, Supabase 서버 클라이언트·`getCurrentUser`, Discord 알림 |
| `shared/lib`     | 순수 유틸: 날짜 포맷, 슬롯 계산                                                |
| `shared/ui`      | 앱 공용 조합 컴포넌트 + `toast`                                                |

DB 읽기(CRUD)는 도메인 규칙이 아니라 인프라이므로 entity가 아니라 `shared/server`에 둔다(FSD 권장). 클라이언트 컴포넌트가 스키마 타입만 필요하면 `import type { Game } from "@/shared/server"`로 가져온다(타입 import는 번들에 남지 않는다). 세션 쿠키 갱신은 유일한 사용처인 `src/proxy.ts`가 소유한다.

**feature 슬라이스는 동작명으로 짓는다**: `join-game`, `manage-game`, `confirm-session`처럼 사용자 동작 단위. 엔티티명(`features/game`)으로 두면 CRUD·참여·필터가 한 슬라이스에 쌓이는 god slice가 된다. 사용처가 한 곳뿐이고 상태 변경이 없는 표시/탭 UI는 feature로 빼지 말고 그 view·widget 안에 둔다(예: `ScheduleTabs`, `SessionTabFilter`, `Heatmap`은 view 소유). 서버 액션 반환은 `shared/api`의 `ActionResult` 하나를 쓴다.

**entity에는 도메인 규칙과 원자 표시만**: 상태 판정(`deriveGameStatus`, `deriveSessionState`), 정원·순번 계산, 작은 표시 단위. 특정 화면의 문구·탭·라우트를 만드는 뷰 모델(`toSessionCard`, `bucketHosted`)이나 액션 존 분기(`deriveActionView`)는 그걸 그리는 widget의 `model/`에 둔다.

**표시 컴포넌트의 체급**: 엔티티는 작고 반복되는 원자적 표시 단위(목록 카드·행 등)만 담는다. **순수 표시라도 덩치가 크면(복합 정보 블록·상세 표 등) entity가 아니라 widget에 둔다.** 표시 컴포넌트는 링크·동작을 갖지 않고, 네비게이션/상호작용은 상위(widget·view)가 감싸서 조합한다. (예: `GameCard`/`GameSummary`/`GameRow`는 링크 없는 entity, 상세 링크는 이를 감싸는 widget/view가 소유. `GameInfoTable`은 순수 표시지만 커서 widget에 둔다.)

## 2. 상호작용 요소는 프리미티브만 사용

- 버튼·셀렉트·칩·아이콘버튼은 **오직 `@trpg/ui`**에서 가져온다. raw `<button>`, `<Link>`/`<div>`를 버튼처럼 스타일링한 손코딩 금지.
- **링크처럼 보이는 버튼**은 `<Button asChild><Link/></Button>` (또는 `IconButton asChild`). `asChild`는 자식 엘리먼트에 버튼 스타일을 입혀 실제 `<a href>`로 렌더한다.
- **선택 가능한 pill/토글**은 `<Chip>` (`shape="pill" | "block"`, `selected`, `asChild`).
- **바텀시트 메뉴 행**은 `<Sheet.Item>` (Button ghost 기반, `asChild`로 Link 렌더).
- 예외(세그먼트 컨트롤 등 프리미티브와 룩이 다른 1회성 UI)는 손코딩하되 `// ponytail:` 주석으로 이유를 남긴다.

## 3. 핸들러는 props로, 레이아웃은 호출부가

- 프리미티브는 고유 역할만 한다. 동작은 `onClick` 등 **props로 인계**한다.
- 여러 맥락에서 재사용되는 feature 버튼(LoginButton, JoinButton 등)은 **크기·너비를 하드코딩하지 않는다.** `size`/`className`을 호출부(위젯·뷰)가 지정한다.
- 폼 내부 제출 버튼은 그 폼이 곧 호출부이므로, 폼이 `className`으로 레이아웃을 지정해도 된다.

## 4. 폼의 레이어

- **단일 동작 폼**(하나의 action + 일반 필드) → **feature**. widget으로 올리면 빈 레이어만 늘어난다. (예: edit-profile, confirm-session)
- **조합형 폼**(2개 이상 독립 feature/entity를 조합) → **widget**. (예: game-form = ThumbnailUpload feature + 제출/삭제 feature + 필드)
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
