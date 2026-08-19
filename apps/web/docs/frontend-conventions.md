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

**import 방향은 아래로만**: `shared ← entities ← features ← widgets ← views`. 상위 레이어를 import하지 않는다(예: feature는 widget을 import 금지). 교차 슬라이스는 각 슬라이스의 public API(배럴 `index.ts`)로 import한다.

**표시 컴포넌트의 체급**: 엔티티는 작고 반복되는 원자적 표시 단위(목록 카드·행 등)만 담는다. **순수 표시라도 덩치가 크면(복합 정보 블록·상세 표 등) entity가 아니라 widget에 둔다.** 표시 컴포넌트는 링크·동작을 갖지 않고, 네비게이션/상호작용은 상위(widget·view)가 감싸서 조합한다. (예: `GameCard`/`GameSummary`/`GameRow`는 링크 없는 entity, 상세 링크는 이를 감싸는 widget/view가 소유. `GameInfoTable`은 순수 표시지만 커서 widget에 둔다.)

## 2. 상호작용 요소는 프리미티브만 사용

- 버튼·셀렉트·칩·아이콘버튼은 **오직 `@trpg/ui`**에서 가져온다. raw `<button>`, `<Link>`/`<div>`를 버튼처럼 스타일링한 손코딩 금지.
- **링크처럼 보이는 버튼**은 `<Button asChild><Link/></Button>` (또는 `IconButton asChild`). `asChild`는 자식 엘리먼트에 버튼 스타일을 입혀 실제 `<a href>`로 렌더한다.
- **선택 가능한 pill/토글**은 `<Chip>` (`shape="pill" | "block"`, `selected`, `asChild`).
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
