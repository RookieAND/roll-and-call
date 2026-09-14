# 공용 레이아웃 · 디자인 토큰 명세

> 코드에 있는 사실만 적었다. 경로는 `apps/web` 기준(`src/...`)이고, UI 패키지는 `packages/ui/src/...`로 적는다.
> 코드만으로 확인할 수 없는 항목은 `❓ 확인 필요`로 표시했다.

---

## 1. 루트 레이아웃

### 1.1 `src/app/layout.tsx`

| 항목 | 내용 | 근거 |
|---|---|---|
| metadata | `title: "롤앤콜"`, `description: "TRPG 세션, 모집부터 일정 확정까지 한 곳에서"` | `src/app/layout.tsx:6-9` |
| `<html lang>` | `ko` | `src/app/layout.tsx:13` |
| 폰트 | Pretendard Variable v1.3.9를 jsDelivr CDN `<link rel="stylesheet">`로 로드한다(`next/font` 미사용) | `src/app/layout.tsx:15-18` |
| 폰트 스택 | `--font-sans: "Pretendard Variable", Pretendard, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | `packages/ui/src/styles.css:6-8` |
| 테마 초기화 스크립트 | `next/script` `id="theme-init"`, `strategy="beforeInteractive"`, 인라인 코드. 5장 참고 | `src/app/layout.tsx:19-26` |
| body 클래스 | `bg-canvas font-sans text-gray-900 antialiased` | `src/app/layout.tsx:28` |
| 모바일 프레임 | `mx-auto flex min-h-screen w-full min-w-screen-min max-w-screen-max flex-col border-x border-gray-200 bg-surface` | `src/app/layout.tsx:29` |
| 프레임 폭 | `--min-width-screen-min: 320px`, `--max-width-screen-max: 412px`, `@utility min-w-screen-min` / `max-w-screen-max`로 정의 | `src/app/globals.css:4-15` |
| 본문 영역 | `<div className="flex-1">{children}</div>` | `src/app/layout.tsx:30` |
| 하단 탭 | 프레임 안에 `<BottomNav />`를 모든 라우트에서 렌더한다(라우트별로 숨기는 분기 없음) | `src/app/layout.tsx:31` |
| 토스트 | 프레임 밖, body 직속으로 `<Toaster />` | `src/app/layout.tsx:33` |
| `viewport` export | 없음(grep 결과 0건). Next 기본값을 쓴다 | — |
| `suppressHydrationWarning` | 없음. 테마 스크립트가 `<html>`에 `dark` 클래스를 붙이는데 이 속성이 없다 | `src/app/layout.tsx:13` |

`globals.css`는 `@import "tailwindcss"` 다음에 `@import "@trpg/ui/styles.css"`를 불러온다(`src/app/globals.css:1-2`). `@trpg/ui` 소스는 `next.config.ts`의 `transpilePackages: ["@trpg/ui"]`로 트랜스파일한다.

**전역 헤더는 없다.** 루트 레이아웃에 header가 없고, 각 view가 `AppBar`를 직접 렌더한다(2.1 참고).

### 1.2 `src/proxy.ts` (Next 16 proxy, 옛 middleware)

- 하는 일은 Supabase 세션 쿠키 갱신 하나다. `createServerClient`로 쿠키 getAll/setAll을 연결하고 `await supabase.auth.getUser()`를 호출한다(`src/proxy.ts:5-33`).
- **라우트 가드는 없다.** redirect/rewrite 없이 항상 `NextResponse.next`를 반환한다(`src/proxy.ts:6,20,32`). 인증 분기는 각 view/서버 함수에서 처리한다(예: `src/views/home/ui/home-view.tsx:7-8`).
- matcher: `_next/static`, `_next/image`, `favicon.ico`, 이미지 확장자(svg/png/jpg/jpeg/gif/webp)를 제외한 모든 경로(`src/proxy.ts:35-37`).

### 1.3 에러 · 404

| 파일 | 내용 | 근거 |
|---|---|---|
| `src/app/error.tsx` | `"use client"`. `useEffect`에서 `console.error(error)`. `ErrorScreen` title `"문제가 발생했습니다"`, description `"잠시 후 다시 시도해 주세요."`, action은 `Button variant="outline"` `"다시 시도"`(`retry()` 호출) | `src/app/error.tsx:1-28` |
| `src/app/not-found.tsx` | `ErrorScreen` title `"페이지를 찾을 수 없습니다"`, description `"주소가 바뀌었거나 삭제된 페이지예요."` | `src/app/not-found.tsx:1-9` |
| `global-error.tsx` | 없음(파일 목록 기준). 루트 layout 자체가 실패하면 대응할 화면이 없다 | — |

`error.tsx`의 prop 이름은 `retry`다(`src/app/error.tsx:8`). 설치된 Next 16.3.0의 error boundary가 `retry`를 넘기는 것을 확인했다(`node_modules/next/dist/client/components/error-boundary.js:114`).

### 1.4 로딩 폴백

| 파일 | 구성 | 근거 |
|---|---|---|
| `src/app/games/loading.tsx` | `GamesAppBar` + `Container`(size 기본값 `lg`) + `GameSearchForm` + `Skeleton` + `GameListSkeleton` | `src/app/games/loading.tsx:7-21` |
| `src/app/games/[id]/loading.tsx` | `AppBar back="/games" title="구인 상세"` + `Container size="md" className="px-0"` + `Skeleton` | `src/app/games/[id]/loading.tsx:6-9` |

### 1.5 정적 자산

| 파일 | 사용처 |
|---|---|
| `src/app/icon.png` (PNG 32×32 RGBA) | Next 파일 컨벤션에 따른 파비콘. 코드에서 직접 참조하지 않는다 |
| `public/empty-states/empty-error.png` | `src/shared/ui/error-screen.tsx:18` |
| `public/empty-states/empty-my-games.png` | `src/views/home/ui/home-start-empty.tsx:8`, `src/views/my-page/ui/session-summary-empty.tsx:8` |
| `public/empty-states/empty-hosted.png` | `src/views/my-page/ui/session-summary-empty.tsx:25` |
| `public/empty-states/empty-schedule.png` | `src/views/game-schedule/ui/schedule-overlap-empty.tsx:6` |
| `public/empty-states/empty-search.png` | `src/views/games/ui/games-empty.tsx:10` |
| `public/empty-states/empty-party.png` | **참조 0건**(`src`, `docs`, `packages` grep 기준) |

---

## 2. 전역 · 공용 컴포넌트 (`src/shared/ui/*`)

모두 배럴 `src/shared/ui/index.ts:1-14`로 내보낸다.

### 2.1 `AppBar` — `src/shared/ui/app-bar.tsx`

**Props** (`src/shared/ui/app-bar.tsx:6-12`)

| prop | 타입 | 설명 |
|---|---|---|
| `title` | `string` (필수) | 제목 |
| `back` | `string?` | 뒤로가기 링크 href(`next/link`) |
| `onBack` | `() => void?` | 있으면 `back` 대신 버튼으로 렌더한다(주석상 둘은 배타) |
| `action` | `ReactNode?` | 오른쪽 슬롯 |

**렌더링**
- `<header>`: `sticky top-0 z-20 flex h-[52px] items-center gap-1 border-b border-gray-200 bg-surface/90 px-3.5 backdrop-blur` (`:17`)
- 뒤로가기: `IconButton variant="ghost" aria-label="뒤로"`, `ChevronLeft size={22}`. `onBack`이 있으면 버튼, 없고 `back`이 있으면 `asChild`로 Link를 렌더한다(`:18-40`)
- 제목: `Text render={<span />}`. 뒤로가기가 있으면 `typography="heading3"` + `truncate tracking-tight`, 없으면 `heading2` + `tracking-tight`(`:41-47`)
- 제목이 `<span>`이라 페이지 안에 `<h1>`이 따로 없다
- 뒤로가기 아이콘에 `aria-hidden`이 없다(`:25`, `:36`). 버튼에 `aria-label`은 있다

**화면별 사용처**

| 위치 | title | back / onBack | action |
|---|---|---|---|
| `src/views/games/ui/games-app-bar.tsx:8-15` (`GamesAppBar`, `games-view.tsx:14`와 `app/games/loading.tsx:10`에서 사용) | `"구인 목록"` | 없음 | `Button asChild size="sm"` → `/games/new` `"새 구인"` |
| `src/views/game-detail/ui/game-detail.tsx:25` | `"구인 상세"` | `back="/games"` | 없음 |
| `src/app/games/[id]/loading.tsx:6` | `"구인 상세"` | `back="/games"` | 없음 |
| `src/views/edit-game/ui/edit-game-view.tsx:15` | `"구인 수정"` | ``back={`/games/${id}`}`` | 없음 |
| `src/views/game-schedule/ui/game-schedule-view.tsx:20` | `` `${game.title} · 일정 조율` `` | ``back={`/games/${id}`}`` | 없음 |
| `src/views/manage-participants/ui/participant-manager.tsx:43` | `"참여자 관리"` | ``back={`/games/${gameId}`}`` | 없음 |
| `src/views/my-page/ui/my-page-view.tsx:31` | `"마이페이지"` | 없음 | 없음 |
| `src/views/edit-profile/ui/edit-profile-view.tsx:17` | `"프로필 편집"` | `back="/me"` | 없음 |
| `src/views/my-sessions/ui/my-sessions-view.tsx:57` | `` `${config.title} ${headlineCount}` `` | `back="/me"` | 없음 |
| `src/widgets/game-form/ui/wizard-header.tsx:21-30` (`WizardHeader`, `game-form-wizard.tsx:54`에서 사용 → create-game) | prop `title` | `back={backHref}` + `onBack={onBack}` | `Text typography="code2" foreground="hint"` `"{step} / 2"` |

- `src/views/home`(`/`)에는 AppBar가 없다. 비로그인이면 `LandingHero`의 자체 브랜드 행(`src/views/home/ui/landing-hero.tsx:10-13`), 로그인 상태면 `HomeDashboard`의 인사 행(`src/views/home/ui/home-dashboard.tsx:27-39`)을 그린다.
- `src/views/create-game`에는 AppBar를 직접 쓰는 코드가 없고, widget `WizardHeader`를 거친다.
- AppBar 높이 52px에 맞춘 sticky 오프셋 `top-[52px]`이 하드코딩되어 있다: `src/views/games/ui/game-board.tsx:23`, `src/views/my-sessions/ui/session-tab-filter.tsx:17`.

### 2.2 `BottomNav` — `src/shared/ui/bottom-nav.tsx`

- `"use client"`, props 없음. `usePathname()` 사용(`:1`, `:14`)
- 탭 정의(`:8-11`)

| href | label | 아이콘(lucide) |
|---|---|---|
| `/games` | `구인 목록` | `List` |
| `/me` | `마이페이지` | `User` |

- 활성 규칙: `pathname.startsWith(tab.href)`(`:19`). `/`(홈)에서는 두 탭 모두 비활성이다. 홈으로 가는 탭은 없다.
- 스타일: `<nav className="sticky bottom-0 z-20 grid h-[58px] grid-cols-2 border-t border-gray-200 bg-surface">`(`:17`). 활성은 `text-primary-600`, 라벨 `Text typography="subtitle2" foreground="primary"`, 비활성은 `text-hint`(`:26`, `:30`)
- a11y: 아이콘 `aria-hidden`(`:29`). `<nav>`에 `aria-label`이 없고, 활성 링크에 `aria-current`가 없다.
- 사용처: `src/app/layout.tsx:31` 한 곳. 높이 58px에 맞춘 오프셋이 `src/widgets/game-form/ui/wizard-footer.tsx:23`과 `src/views/game-detail/ui/game-detail-actions.tsx:28`(`sticky bottom-[58px]`)에 있고, `Toaster`는 `offset.bottom: 76`(`src/shared/ui/toaster.tsx:9-10`)이다.

### 2.3 `ConfirmDialog` — `src/shared/ui/confirm-dialog.tsx`

- `@base-ui-components/react/dialog` 기반(`:3`)
- Props(`:6-16`): `open`, `onOpenChange`, `title`, `description?`, `confirmLabel?`(기본 `"확인"`), `cancelLabel?`(기본 `"취소"`), `danger?`, `pending?`, `onConfirm`
- Backdrop `fixed inset-0 z-40 bg-black/40`, Popup은 화면 중앙 `w-[calc(100%-3rem)] max-w-sm rounded-2xl ... shadow-xl`(`:32-33`)
- 버튼: 취소는 `Button variant="outline" size="sm"`, 확인은 `variant={danger ? "danger" : "solid"}`이고 `disabled={pending}`(`:41-52`). pending일 때 `loading` 표시는 없다
- `Dialog.Title`/`Dialog.Description` 사용(`:34-38`)
- 사용처: `src/features/adjust-roster/ui/remove-member-item.tsx`, `src/features/delete-game/ui/delete-game-button.tsx`, `src/views/game-detail/ui/game-gm-menu.tsx`

### 2.4 `DatePicker` — `src/shared/ui/date-picker.tsx`

- `@base-ui-components/react/popover` + `@trpg/ui`의 `Calendar`(`:3-4`)
- Props `DatePickerProps`(`:11-19`): `value?`(YYYY-MM-DD), `onChange`, `placeholder?`(기본 `"날짜 선택"`), `id?`, `invalid?`, `min?`, `max?`
- 트리거: `invalid`이면 `border-danger-400`, 아니면 `border-gray-300`(`:36`). 아이콘 `Calendar size={16} aria-hidden`
- 날짜를 고르면 `onChange` 후 팝오버를 닫는다(`:48-51`)
- 사용처: `src/widgets/game-form/ui/coordination-range-fields.tsx`, `src/features/create-second-round/ui/round-range-fields.tsx`, 내부적으로 `DateTimePicker`

### 2.5 `DateTimePicker` — `src/shared/ui/date-time-picker.tsx`

- `DatePicker` + 시/분 `Select` 2개. 출력 형식 `"YYYY-MM-DDTHH:mm"`(`:24-32`)
- 옵션: 시 `00시`–`23시`, 분 `00분`–`59분`(1분 단위 60개)(`:7-14`)
- 시각 기본값 `19`:`00`(`:29-30`). 날짜가 비어 있으면 `""`을 emit
- Props `DateTimePickerProps`(`:16-22`): `value?`, `onChange`, `id?`, `invalid?`, `min?`(`max` 없음)
- 시/분 `Select.Trigger`에 `id`나 라벨 연결이 없다(`:45`, `:55`)
- 사용처: `src/widgets/game-form/ui/game-schedule-fields.tsx`, `src/widgets/game-form/ui/fixed-session-field.tsx`

### 2.6 `EmptyState` — `src/shared/ui/empty-state.tsx`

- Props(`:8-24`): `image?`, `imageAlt?`(기본 `""`), `size?: "full" | "section"`(기본 `full`), `title: ReactNode`, `description?`, `action?`, `className?`
- 이미지 크기: full 140px, section 104px(`:25`). `next/image` 사용
- 레이아웃: `VStack gap={3}` `rounded-2xl border border-dashed border-gray-300 p-6 text-center`(`:27-33`). title은 `subtitle1`, description은 `body2 muted`
- 사용처

| 파일 | image | size | title |
|---|---|---|---|
| `src/views/home/ui/home-start-empty.tsx:7` | empty-my-games | (full) | `두 가지 방법으로 시작합니다` |
| `src/views/my-page/ui/session-summary-empty.tsx:7` | empty-my-games | section | `아직 참여 예정인 세션이 없습니다` |
| `src/views/my-page/ui/session-summary-empty.tsx:24` | empty-hosted | section | `아직 본인이 연 세션이 없습니다` |
| `src/views/game-schedule/ui/schedule-overlap-empty.tsx:5` | empty-schedule | section | `아직 응답한 참여자가 없어요` |
| `src/views/my-sessions/ui/my-sessions-view.tsx:66` | 없음 | (full) | `해당하는 세션이 없습니다` |

- `src/views/games/ui/games-empty.tsx`는 `EmptyState`를 쓰지 않고 `Image`/`Text`/`Button`으로 따로 그린다(점선 카드 없음, 이미지 `alt="조건에 맞는 구인이 없습니다"`)(`:8-33`).

### 2.7 `ErrorScreen` — `src/shared/ui/error-screen.tsx`

- Props: `title`, `description?`, `action?`(`:7-15`)
- `VStack gap={5} min-h-[70vh] items-center justify-center px-5 text-center`(`:17`)
- 이미지 `/empty-states/empty-error.png` 140px, `alt=""` + `aria-hidden`(`:18`)
- title은 `heading3`, description은 `body2 muted`. 버튼 행은 `{action}` 다음에 항상 `Button asChild` → `/` `"메인으로 돌아가기"`(`:27-32`)
- 사용처: `src/app/error.tsx`, `src/app/not-found.tsx`

### 2.8 `Sheet` — `src/shared/ui/sheet.tsx`

- Base UI `Dialog`에 스타일만 입힌 compound 객체: `Sheet.Root`(=Dialog.Root), `Trigger`, `Close`, `Content`, `Title`, `Item`(`:49-56`)
- `Content`: Backdrop `bg-black/30 z-40`, Popup `fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[412px] rounded-t-[20px] ... p-5 shadow-[0_-8px_28px_rgba(23,23,28,0.1)]`, 상단 그랩바 `h-1 w-[38px] bg-gray-300`(`:7-22`)
  - `max-w-[412px]`는 `--max-width-screen-max`와 같은 값을 따로 하드코딩한 것이다
- `Title`: `Dialog.Title` `mb-3 text-sm font-bold text-gray-600`(`:24-30`)
- `Item`: `Button variant="ghost"`, `min-h-[52px] w-full justify-between rounded-none border-b border-gray-100 ... text-[14.5px] last:border-b-0`(`:33-44`)
- 그랩바는 장식 `div`일 뿐 드래그로 닫는 동작은 없다(코드 기준)
- 사용처: `src/features/adjust-roster/ui/member-action-sheet.tsx`, `demote-member-item.tsx`, `remove-member-item.tsx`, `src/features/filter-games/ui/games-filter-sheet.tsx`, `src/features/create-second-round/ui/round-sheet.tsx`, `src/views/game-detail/ui/game-gm-menu.tsx`

### 2.9 `StatusNotice` — `src/shared/ui/status-notice.tsx`

- Props: `tone?: "success" | "muted"`(기본 `muted`), `className?`, `children`(`:5-13`)
- success는 `border border-success-200 bg-success-50`, muted는 `bg-gray-50 text-sm text-gray-600`. 공통 `rounded-xl p-4 text-center`(`:17-21`)
- `role`/`aria-live` 없음
- 사용처: `src/views/game-detail/ui/game-action-zone.tsx`, `src/views/game-schedule/ui/schedule-body.tsx`, `src/entities/game/ui/waitlist-notice.tsx`, `src/entities/game/ui/confirmed-session-notice.tsx`

### 2.10 `ThemeToggle` — `src/shared/ui/theme-toggle.tsx`

- `IconButton variant="outline" aria-label="테마 전환"`, 아이콘은 다크일 때 `Sun`, 아니면 `Moon`(size 18)(`:26-34`)
- 마운트 시 `document.documentElement.classList.contains("dark")`로 초기 상태를 읽고(`:10-12`), 토글 시 클래스를 바꾸고 `localStorage.setItem("theme", ...)`(`:14-23`)
- `aria-pressed` 없음
- **렌더 위치: `src/views/my-page/ui/my-page-header.tsx:21` 한 곳**(`/me`). 다른 화면에는 테마 전환 UI가 없다.

### 2.11 `Toaster` / `toast` — `src/shared/ui/toaster.tsx`, `src/shared/ui/toast.ts`

- `Toaster`: sonner `position="bottom-center"`, `offset={{ bottom: 76 }}`, `mobileOffset={{ bottom: 76 }}`, `duration: 2500`, `unstyled: true`(`toaster.tsx:7-13`)
  - 클래스: `inset-x-0 mx-auto flex w-fit ... rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg`. default/success는 `bg-toast`, error는 `bg-danger-solid`(`toaster.tsx:18-22`)
  - success와 default의 배경이 같다. 아이콘이 따로 지정되어 있지 않다
- `toast`: `toast.success(message)`, `toast.error(message)` 두 개만 감싼다(`toast.ts:4-7`). info/loading/promise는 없다
- `Toaster` 사용처: `src/app/layout.tsx:33`
- `toast` 사용처(12곳): `src/widgets/game-form/ui/game-form.tsx`, `src/features/adjust-roster/ui/{remove-member-item,promote-button,demote-member-item}.tsx`, `src/features/create-second-round/ui/round-sheet.tsx`, `src/features/edit-profile/ui/{avatar-refresh-field,edit-profile-form}.tsx`, `src/features/delete-game/model/use-delete-game.ts`, `src/features/join-game/ui/{join-game-button,leave-game-button}.tsx`, `src/features/coordinate-session/ui/availability-grid.tsx`, `src/features/confirm-session/ui/confirm-session-form.tsx`

### 2.12 `StatCard` — `src/shared/ui/stat-card.tsx`

- Props: `value: number | string`, `label: string`, `urgent?`(`:4-12`)
- `Card padding="none"` `px-3.5 py-3.5`. urgent이면 `border-danger-200 bg-danger-50/40`, 값은 `text-danger-600`(`:14-24`)
- 값은 `text-2xl leading-none font-extrabold tracking-tight tabular-nums`로 `typography` variant가 아니라 직접 지정한 크기다. 라벨은 `body4 muted font-semibold`
- 사용처: `src/views/manage-participants/ui/roster-stats.tsx`, `src/views/my-page/ui/my-page-view.tsx`

### 2.13 `SlotGrid` — `src/shared/ui/slot-grid.tsx`

- Props: `days: DayColumn[]`, `timeRows: TimeRow[]`, `renderCell: (slotKey: string) => ReactNode`, `className?`(`:7-18`)
- `overflow-x-auto` 래퍼 + `grid min-w-full select-none`, 열 템플릿 `40px repeat(n, minmax(0, 1fr))`(`:20-24`)
- 헤더: 요일 `body4 hint`, 날짜 `subtitle2`. 시각 라벨은 정시에만 표시(`:26-47`)
- 시간 범위는 `src/shared/lib/slots.ts:3-5`(`SLOT_MINUTES=30`, `DAY_START_HOUR=12`, `DAY_END_HOUR=24`)
- `role="grid"` 같은 ARIA 구조는 없다
- 사용처: `src/views/game-schedule/ui/heatmap.tsx`, `src/features/coordinate-session/ui/availability-grid.tsx`

---

## 3. UI 라이브러리

### 3.1 `@trpg/ui` (`packages/ui`)

- `package.json` exports: `"."` → `./src/index.ts`, `"./styles.css"` → `./src/styles.css`
- 의존성: `@base-ui-components/react 1.0.0-rc.0`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `cn()` = `twMerge(clsx(...))`(`packages/ui/src/cn.ts:4-6`)
- Base UI 사용 범위: `useRender`(Button/IconButton/Chip/Text의 `asChild`·`render`), `Select`(`packages/ui/src/select.tsx:3`). Dialog/Popover는 앱 쪽 `src/shared/ui`에서 직접 import한다.

| 컴포넌트 | 파일 | variants / sizes | 기본값 | 앱 사용(파일 수) |
|---|---|---|---|---|
| `Box` | `packages/ui/src/box.tsx:6` | 없음(div + cn) | — | 0 |
| `Flex` / `VStack` / `HStack` | `packages/ui/src/flex.tsx:31,59,63` | `direction` row/column, `align` start·center·end·stretch·baseline, `justify` start·center·end·between·around·evenly, `gap`(GapToken), `wrap`, `inline` | direction `row` | Flex 0 / VStack 39 / HStack 22 |
| `Grid` | `packages/ui/src/grid.tsx:20` | `cols` 1–6, 12, `gap` | — | 0 |
| `Container` | `packages/ui/src/container.tsx:16` | `size` sm=`max-w-2xl`, md=`max-w-4xl`, lg=`max-w-6xl`, xl=`max-w-7xl`, full. 공통 `mx-auto w-full px-4` | `lg` | 14 |
| `Text` | `packages/ui/src/text.tsx:41` | `typography` 12종(4.2), `foreground` normal·muted·hint·primary·success·danger·white, `render` | `body2` / `normal` | 56 |
| `Avatar` / `AvatarGroup` | `packages/ui/src/avatar.tsx:44,71` | `size` sm 24·md 32·stack 34·lg 48·xl 52·2xl 60·3xl 84(px). 이름 해시로 6색 팔레트(생 hex). Group `max` 기본 3 | `md` | 8 / 1 |
| `Badge` | `packages/ui/src/badge.tsx:23` | `color` gray·primary·success·danger·discord | `gray` | 3 |
| `Button` | `packages/ui/src/button.tsx:37` | `variant` solid·discord·confirm·outline·tinted·ghost·danger, `size` sm h-8·md h-10·lg h-12, `loading`(스피너 + `bg-primary-300`), `asChild` | `solid` / `md` | 26 |
| `IconButton` | `packages/ui/src/icon-button.tsx:28` | `variant` solid·ghost·outline, `size` sm 32·md 40·lg 48, `asChild` | `ghost` / `md` | 5 |
| `Chip` | `packages/ui/src/chip.tsx:29` | `shape` pill·block, `selected` true/false, `asChild` | `pill` / `false` | 3 |
| `Card` | `packages/ui/src/card.tsx:15` | `padding` none·sm·md·lg, `interactive` | `md` / `false` | 3 |
| `Field` | `packages/ui/src/field.tsx:17` | `label`, `description`, `error`, `required`(빨간 `*`), `htmlFor` | — | 8 |
| `TextInput` / `Textarea` | `packages/ui/src/text-input.tsx:20,26` | `invalid` true/false. Input `h-11`, Textarea `min-h-24`. `[color-scheme:light]` 고정 | `invalid: false` | 5 / 2 |
| `Select` | `packages/ui/src/select.tsx:140-150` | compound: Root·Trigger(`placeholder` 기본 `"선택"`, `invalid`)·Popup·Item + Base UI Value·Icon·Group·GroupLabel·Separator | — | 2 |
| `Pagination` | `packages/ui/src/pagination.tsx:15` | `page`, `totalPages`, `hrefFor`, `siblings`(기본 2). 일반 `<a>`, `aria-label="페이지네이션"`, `aria-current="page"` | — | 1 |
| `Skeleton` | `packages/ui/src/skeleton.tsx:6` | className으로 크기 지정, `shimmer` 1.3s 애니메이션 | — | 5 |
| `Progress` | `packages/ui/src/progress.tsx:16` | `color` recruiting(primary-500)·confirmed(success-600)·closed(gray-400), `h-1`. `role="progressbar"` 없음 | `recruiting` | 1 |
| `Calendar` | `packages/ui/src/calendar.tsx:22` | `value`, `onSelect`, `min`, `max`. 요일 `일`–`토`, 이전/다음 달 `aria-label` | — | 1 |
| `cn` | `packages/ui/src/cn.ts:4` | — | — | 20 |
| `gapMap` / `GapToken` | `packages/ui/src/tokens.ts:2,15` | gap 0,1,2,3,4,5,6,8,10,12 | — | 0(패키지 내부에서만 사용) |

"앱 사용" 수는 `import ... from "@trpg/ui"` 문에 해당 이름이 들어 있는 `apps/web/src` 파일 수다.

### 3.2 `apps/web/package.json` 의 기타 라이브러리

| 라이브러리 | 버전 | 실제 사용 |
|---|---|---|
| `lucide-react` | ^1.32.0 | 사용 중. 쓰는 아이콘: Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, List, Moon, MoreHorizontal, Pencil, Sun, User |
| `sonner` | ^2.0.8 | `src/shared/ui/toaster.tsx`, `src/shared/ui/toast.ts`에서만 사용 |
| `react-hook-form` | ^7.85.0 | `src/widgets/game-form/**`에서만 사용(`game-form.tsx`의 `useForm`) |
| `@hookform/resolvers` | ^5.7.1 | `src/widgets/game-form/ui/game-form.tsx`(`zodResolver`) |
| `zod` | ^4.4.3 | `src/features/write-game/model/game-form.ts`에서만 사용 |
| `@base-ui-components/react` | 1.0.0-rc.0 | `src/shared/ui/{sheet,confirm-dialog,date-picker}.tsx` |
| `@tanstack/react-query` | ^5.101.4 | **`src` 전체 사용 0건** |
| `zustand` | ^5.0.14 | **`src` 전체 사용 0건** |
| Tailwind | `tailwindcss` ^4.3.3 + `@tailwindcss/postcss` | v4 CSS-first 설정(`@theme`, `@utility`). 별도 `tailwind.config` 파일 없음 |

---

## 4. 디자인 토큰

정의 위치는 `packages/ui/src/styles.css`다. `@theme` 블록의 `--color-*`가 Tailwind 유틸리티(`bg-primary-600` 등)를 만들고, `.dark` 블록이 같은 변수를 덮어쓴다.

### 4.1 색상

#### Primary (`styles.css:10-19`, dark `:109-111`)

| 토큰 | Light | Dark |
|---|---|---|
| primary-50 | `#eef0fe` | `#1e1e3a` |
| primary-100 | `#e0e7ff` | `#26264d` |
| primary-200 | `#c7d2fe` | `#313166` |
| primary-300 | `#a5b4fc` | (동일) |
| primary-400 | `#818cf8` | (동일) |
| primary-500 | `#6366f1` | (동일) |
| primary-600 | `#4f46e5` | (동일) |
| primary-700 | `#4338ca` | (동일) |
| primary-800 | `#3730a3` | (동일) |
| primary-900 | `#312e81` | (동일) |

#### Gray, 웜 뉴트럴 (`styles.css:30-39`, dark `:97-106`)

| 토큰 | Light | Dark |
|---|---|---|
| gray-50 | `#fafafc` | `#26262e` |
| gray-100 | `#f2f2f6` | `#2e2e38` |
| gray-200 | `#eaeaef` | `#3a3a45` |
| gray-300 | `#dcdce4` | `#4a4a55` |
| gray-400 | `#b4b4be` | `#6a6a76` |
| gray-500 | `#8a8a95` | `#9a9aa5` |
| gray-600 | `#5f5f6b` | `#b4b4be` |
| gray-700 | `#3a3a45` | `#cfcfd6` |
| gray-800 | `#26262e` | `#e6e6ea` |
| gray-900 | `#17171c` | `#f2f2f5` |

#### Success (`styles.css:22-27`, dark `:113-117`)

| 토큰 | Light | Dark |
|---|---|---|
| success-50 | `#f1faf5` | `#12291f` |
| success-100 | `#e3f5ec` | `#17352a` |
| success-200 | `#cdebdd` | `#1f4a39` |
| success-600 | `#0b9c6c` | (동일) |
| success-700 | `#0b7a55` | `#6ee7b7` |
| success-800 | `#0a5c41` | `#a7f3d0` |

300–500 단계는 정의되어 있지 않다.

#### Danger (`styles.css:49-54`, dark `:119-124`)

| 토큰 | Light | Dark |
|---|---|---|
| danger-50 | `#fef5f5` | `#2a1a1a` |
| danger-100 | `#fbebeb` | `#3a2222` |
| danger-200 | `#f0dada` | `#4f2e2e` |
| danger-300 | `#e9c9c9` | `#5f3838` |
| danger-400 | `#e5a0a0` | `#8a5252` |
| danger-600 | `#c33b3b` | `#f08a8a` |

500 단계와 700 이상은 정의되어 있지 않다.

#### Warning (`styles.css:62`, dark `:126`)

| 토큰 | Light | Dark |
|---|---|---|
| warning-600 | `#b45309` | `#fbbf24` |

사용처: `src/views/manage-participants/ui/confirmed-roster-row.tsx:26` 한 곳.

#### 시맨틱 · 역할 토큰

| 토큰 | Light | Dark | 용도(코드 주석 / 사용) | 근거 |
|---|---|---|---|---|
| canvas | `#e9e9ee` | `#131318` | body 배경(프레임 바깥) | `styles.css:44`, `:93`, `src/app/layout.tsx:28` |
| surface | `#ffffff` | `#1e1e26` | 프레임, 카드, 헤더, 시트 배경 | `styles.css:46`, `:94` |
| toast | `#23232b` | `#3a3a45` | 토스트 default/success 배경 | `styles.css:45`, `:95` |
| hint | `#70707a` | `#8f8f9a` | 보조 문구. 주석: gray-400=2.06:1, 500=3.41:1이라 4.5:1용으로 따로 둠 | `styles.css:66-68`, `:128` |
| primary-ink | `#4f46e5` | `#a5b4fc` | `Text foreground="primary"` | `styles.css:69`, `:129`, `packages/ui/src/text.tsx:26` |
| tinted-bg | `#f5f4ff` | `#262647` | Button tinted, Chip selected | `styles.css:70`, `:130` |
| tinted-bg-hover | `#eeedfc` | `#2f2f57` | 〃 hover | `styles.css:71`, `:131` |
| tinted-border | `#d5d3f7` | `#3a3a6b` | 〃 테두리 | `styles.css:72`, `:132` |
| tinted-ink | `#4338ca` | `#c7d2fe` | 〃 글씨 | `styles.css:73`, `:133` |
| danger-solid | `#c33b3b` | (동일, 테마 불변) | 흰 글씨가 올라가는 솔리드 배경(토스트 error) | `styles.css:55-57` |
| success-solid | `#0b7a55` | (동일) | Button `confirm` | `styles.css:58` |
| success-solid-hover | `#0a5c41` | (동일) | Button `confirm` hover | `styles.css:59` |
| discord | `#5865f2` | (동일) | Button/Badge `discord` | `styles.css:42` |
| discord-dark | `#4752c4` | (동일) | Button `discord` hover | `styles.css:43` |

#### 히트맵 (`:root`, `@theme` 밖) (`styles.css:78-88`, dark `:135-141`)

`@theme`에 넣으면 Tailwind가 쓰이지 않는 토큰으로 보고 제거하기 때문에 `:root`에 따로 두었다고 주석에 적혀 있다(`:76-77`). `src/views/game-schedule/model/heat-scale.ts:9,14`에서 인라인 `var(--color-heat-N)`으로 사용한다.

| 토큰 | Light | Dark |
|---|---|---|
| heat-0 | `#ffffff` | `#1e1e26` |
| heat-1 | `#edeefc` | `#262649` |
| heat-2 | `#d8dafa` | `#2f2f66` |
| heat-3 | `#b7baf5` | `#3c3c8c` |
| heat-4 | `#8e92ef` | `#4b4bb5` |
| heat-5 | `#5b60e4` | `#6a6fe8` |
| heat-ink | `#2b2d78` | `#c7d2fe` |
| heat-ink-strong | `#ffffff` | (동일, 오버라이드 없음) |

#### 토큰 밖의 고정 색

- `Avatar` 이니셜 팔레트 6쌍 + 이름 없을 때 `#EAEAEF`/`#8A8A95`(`packages/ui/src/avatar.tsx:23-30`, `:47`). tokens-check 예외 대상이라 다크 모드에서도 바뀌지 않는다.
- 임의 rgba 그림자: Button discord `rgba(88,101,242,0.24)`(`packages/ui/src/button.tsx:13`), Select popup `rgba(23,23,28,0.12)`(`packages/ui/src/select.tsx:101`), Sheet `rgba(23,23,28,0.1)`(`src/shared/ui/sheet.tsx:13`).
- `text-white`, `bg-black/30`·`bg-black/40`(Dialog backdrop).

### 4.2 타이포그래피 — `Text` `typography` (`packages/ui/src/text.tsx:8-21`)

| variant | font-size | line-height | weight | 기타 |
|---|---|---|---|---|
| display1 | 28px | 1.2 | extrabold(800) | tracking-tight |
| heading1 | 22px | 1.25 | extrabold(800) | tracking-tight |
| heading2 | 18px | 1.3 | bold(700) | |
| heading3 | 16px | 1.4 | bold(700) | |
| subtitle1 | 14px | 1.4 | bold(700) | |
| subtitle2 | 12px | 1.4 | bold(700) | |
| body1 | 16px | 1.6 | normal(400) | |
| body2 | 14px | 1.5 | normal(400) | **기본값** |
| body3 | 13px | 1.5 | normal(400) | |
| body4 | 12px | 1.4 | normal(400) | |
| code1 | 13px | 1.5 | normal(400) | font-mono |
| code2 | 12px | 1.4 | normal(400) | font-mono |

- `foreground`(`text.tsx:22-30`): normal=`gray-900`, muted=`gray-600`, hint=`hint`, primary=`primary-ink`, success=`success-700`, danger=`danger-600`, white=`white`. 기본값 `normal`.
- `Text`는 기본으로 `<span>`을 렌더한다. 제목 요소가 필요하면 `render={<h1 />}`처럼 넘긴다(예: `src/views/home/ui/landing-hero.tsx:14`).
- `font-mono` 스택은 따로 정의하지 않았다(Tailwind 기본값).
- 컴포넌트 안에 variant 밖의 크기가 섞여 있다: `text-[11px]`(Badge), `text-[12.5px]`(Chip pill, Field label), `text-[13px]`(Pagination), `text-[14.5px]`(Sheet.Item), `text-[15px]`(Button lg), `text-2xl`(StatCard) 등.

### 4.3 간격 · 반경 · 그림자 · 브레이크포인트

- **간격**: 별도 spacing 토큰은 없고 Tailwind 기본 스케일을 쓴다. `Flex`/`Grid`의 `gap` prop은 `gapMap`(0,1,2,3,4,5,6,8,10,12) 값만 받는다(`packages/ui/src/tokens.ts:2-15`).
- **반경**: 토큰 없음. 컴포넌트마다 임의값을 쓴다.

| 값 | 사용 |
|---|---|
| `rounded-[7px]` | Badge |
| `rounded-md` | IconButton, DatePicker 트리거, Calendar 셀, Skeleton |
| `rounded-[9px]` | Pagination 셀 |
| `rounded-[10px]` | TextInput, Select trigger, Chip block |
| `rounded-lg` | 토스트, DatePicker popup, Select item |
| `rounded-xl` | Button, Select popup, StatusNotice |
| `rounded-[14px]` | Card |
| `rounded-2xl` | ConfirmDialog, EmptyState |
| `rounded-t-[20px]` | Sheet |
| `rounded-full` | Avatar, Chip pill |

- **그림자**: 토큰 없음. `shadow-lg`(토스트, DatePicker), `shadow-xl`(ConfirmDialog), 임의 rgba 그림자 3종(4.1 참고).
- **z-index**: AppBar·BottomNav `z-20`, sticky 서브헤더/CTA `z-10`, Dialog·Sheet Backdrop `z-40`, Popup/Positioner `z-50`.
- **브레이크포인트**: 커스텀 정의 없음. `apps/web/src`와 `packages/ui/src`에서 `sm:`/`md:`/`lg:`/`xl:` 접두 유틸리티 사용 0건. 반응형은 1.1의 320–412px 고정 프레임으로만 처리한다.
- **컨테이너**: `Container` 기본 `lg`=`max-w-6xl`(1152px), `md`=`max-w-4xl`, `sm`=`max-w-2xl`. 모두 412px 프레임보다 넓어서 실질적으로는 좌우 `px-4`만 적용된다.
- **애니메이션**: `@keyframes shimmer`(opacity 0.5 → 1 → 0.5)(`styles.css:145-153`), Skeleton에서 1.3s로 사용.

### 4.4 `scripts/tokens-check.mjs` (`pnpm lint:tokens`)

- 검사 대상: `apps/web/src`, `packages/ui/src`의 `.ts`/`.tsx`/`.css`(`scripts/tokens-check.mjs:6-9`, `:21`)
- 금지 규칙
  1. 6자리 생 hex `#[0-9A-Fa-f]{6}`(`:12`, `:33`). 3자리·8자리 hex, `rgb()`/`rgba()`는 정규식에 걸리지 않는다.
  2. Tailwind 기본 팔레트 클래스: `bg|text|border|from|via|to|ring|outline|fill|stroke|decoration|shadow` + `red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|zinc|neutral|stone` + `-숫자`(`:14-15`). `gray`는 프로젝트 토큰이므로 목록에 없다.
- 예외: 파일 `styles.css`, `packages/ui/src/avatar.tsx`(`:11`). 해당 줄에 `tokens-check-ignore` 문자열이 있으면 그 줄은 건너뛴다(`:32`).
- 실패하면 "색은 --color-* 토큰만 쓴다. 새 축이 필요하면 packages/ui/src/styles.css에 추가하고 .dark 값도 함께 넣는다."를 출력하고 exit 1(`:41-45`).

---

## 5. 테마(다크 모드)

| 단계 | 동작 | 근거 |
|---|---|---|
| 방식 | `<html>`의 `dark` 클래스. `.dark { --color-*: ... }`로 CSS 변수를 덮어쓴다. `dark:` 유틸리티는 0건(주석: "No dark: utilities needed") | `packages/ui/src/styles.css:90-92` |
| 첫 페인트 전 | `localStorage.getItem('theme')`가 `'dark'`이거나, 값이 없고 `prefers-color-scheme: dark`이면 `classList.add('dark')`. try/catch로 감싼다 | `src/app/layout.tsx:24` |
| 전환 | `ThemeToggle`이 클래스를 토글하고 `localStorage.theme`에 `"dark"`/`"light"`를 저장 | `src/shared/ui/theme-toggle.tsx:14-23` |
| 전환 UI 위치 | `/me`의 `MyPageHeader`만 | `src/views/my-page/ui/my-page-header.tsx:21` |
| OS 설정 변경 추적 | 없음(`matchMedia` change 리스너 없음). 저장된 값이 생기면 이후로는 OS 설정을 따르지 않는다. "시스템 설정 따르기"로 되돌리는 UI도 없다 | — |
| `color-scheme` | 전역 `color-scheme` 선언 없음. `TextInput`/`Textarea`는 `[color-scheme:light]`로 고정 | `packages/ui/src/text-input.tsx:6` |
| 테마 불변 색 | `*-solid`, `discord*`, `heat-ink-strong`, Avatar 팔레트, `text-white` | 4.1 |

- ❓ 확인 필요: `<html>`에 `suppressHydrationWarning`이 없는 상태에서 `dark` 클래스가 추가될 때 실제로 hydration 경고가 뜨는지(런타임 확인 필요).
- ❓ 확인 필요: `next/script` `beforeInteractive`를 App Router의 `<head>` 안에 직접 둔 배치가 Next 16에서 의도대로 페인트 전에 실행되는지.

---

## 6. 반응형 · 접근성 전역 현황

### 반응형
- 레이아웃은 320–412px 단일 컬럼 프레임 하나다(`src/app/globals.css:5-6`, `src/app/layout.tsx:29`). 412px보다 넓은 화면에서는 프레임이 가운데에 놓이고 양옆에 `bg-canvas`가 보인다.
- 반응형 접두사(`sm:` 등) 사용 0건.
- 뷰포트 기준으로 뜨는 요소가 있다: Sheet(`fixed inset-x-0 ... max-w-[412px]`, 프레임 폭과 같은 값을 하드코딩), ConfirmDialog(화면 중앙 `max-w-sm`), Toaster(body 직속, `bottom: 76`).
- 고정 높이 결합: AppBar 52px ↔ `top-[52px]` 2곳, BottomNav 58px ↔ `bottom-[58px]` 2곳(2.1, 2.2).
- `SlotGrid`는 `overflow-x-auto` + 날짜 열 `minmax(0,1fr)`이라, 날짜가 많아지면 칸이 좁아진다.

### 접근성
- `lang="ko"`(`src/app/layout.tsx:13`).
- 앱 + ui 패키지 전체 ARIA 사용량(grep): `aria-hidden` 18, `aria-label` 14, `aria-current` 2(`packages/ui/src/pagination.tsx:51`, `src/views/my-sessions/ui/session-tab-filter.tsx:28`), `aria-selected` 1, `role="tablist"`/`role="tab"`(`src/views/game-schedule/ui/schedule-tabs.tsx:16,23`).
- `sr-only` 사용 0건. skip link 없음.
- focus 스타일: `focus-visible:ring-2 ring-primary-200`은 `Button`/`IconButton`/`Chip`에만 있다. 입력류(TextInput, Select trigger, DatePicker trigger)는 `focus:ring-2`를 쓴다. `Calendar` 날짜/월 이동 버튼, `BottomNav` 링크, `Pagination` 링크에는 focus 스타일이 없다.
- 주요 누락: BottomNav `aria-current`/`nav aria-label`, AppBar 제목이 heading 요소가 아님, `Progress`에 `role="progressbar"`/aria 값 없음, `StatusNotice`·토스트 외 상태 알림에 `aria-live` 없음(sonner 자체 live region은 ❓ 확인 필요), `ThemeToggle`에 `aria-pressed` 없음, `DateTimePicker` 시/분 Select에 라벨 없음, `Calendar` 비활성 날짜는 시각적으로 `line-through`만 표시.
- 명도 대비 근거: `hint` 토큰 주석에 gray-400=2.06:1, gray-500=3.41:1 수치가 적혀 있다(`packages/ui/src/styles.css:66-67`). 그런데도 `text-gray-500`이 DatePicker 아이콘(`src/shared/ui/date-picker.tsx:39`), Calendar 월 이동 버튼(`packages/ui/src/calendar.tsx:50,61`), Select 아이콘(`packages/ui/src/select.tsx:84`)에 쓰인다. 비활성 Pagination 화살표는 `text-gray-400`(`packages/ui/src/pagination.tsx:42,72`).
- 전역 헤더/내비의 터치 영역: AppBar 뒤로가기 36×36(`h-9 w-9`), ThemeToggle 36×36, IconButton sm 32×32, Calendar 셀 높이 32px(`h-8`), Pagination 34px.

---

## 7. 전역 UX 문제점 메모 (코드로 확인한 사실)

1. 모든 라우트에서 BottomNav가 보인다. 생성 위저드, 상세 CTA, 로그인 전 랜딩(`/`)도 예외가 없다(`src/app/layout.tsx:31`).
2. BottomNav에 홈(`/`) 탭이 없고, `/`에서는 활성 탭도 없다(`src/shared/ui/bottom-nav.tsx:8-11`, `:19`). 홈으로 가는 경로는 `ErrorScreen`의 "메인으로 돌아가기" 정도다.
3. `startsWith` 규칙이라 `/games/new`, `/games/[id]/...`도 전부 "구인 목록" 탭 활성으로 표시된다.
4. 테마 전환은 `/me`에서만 할 수 있다(`src/views/my-page/ui/my-page-header.tsx:21`). `/me`는 비로그인 사용자를 `/`로 redirect하므로(`src/views/my-page/ui/my-page-view.tsx:14`), 비로그인 사용자는 테마를 바꿀 방법이 없다. BottomNav "마이페이지" 탭을 누른 비로그인 사용자도 같은 이유로 `/`로 이동한다.
5. `EmptyState`를 쓰지 않는 빈 상태(`src/views/games/ui/games-empty.tsx`)가 있어 빈 상태 표현이 두 벌이다. `empty-party.png`는 어디서도 참조하지 않는다.
6. 토스트는 success와 기본 스타일이 같은 배경(`bg-toast`)이고 아이콘 설정이 없어 성공/일반을 시각적으로 구분하지 않는다(`src/shared/ui/toaster.tsx:20-21`).
7. `ConfirmDialog`는 `pending`이어도 취소 버튼이 활성이고, 확인 버튼에 loading 표시가 없다(`src/shared/ui/confirm-dialog.tsx:41-52`).
8. `DateTimePicker`의 분 선택지가 60개(1분 단위)다(`src/shared/ui/date-time-picker.tsx:11-14`). 반면 슬롯 격자는 30분 단위다(`src/shared/lib/slots.ts:3`).
9. 매직 넘버 결합: 52px(AppBar) · 58px(BottomNav) · 76px(Toaster offset) · 412px(Sheet)가 여러 파일에 흩어진 리터럴이다(6장 참고).
10. `global-error.tsx`가 없어서, 루트 layout에서 난 에러는 `error.tsx`가 받지 못한다(1.3).
11. `Container`의 max-width 값(2xl–7xl)은 412px 프레임에서 의미가 없다(4.3).
12. `@tanstack/react-query`, `zustand`는 의존성에 있지만 코드에서 쓰지 않는다(3.2).
