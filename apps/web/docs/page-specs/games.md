# 구인 목록 (`/games`)

> 전역 레이아웃(BottomNav, Toaster, 테마)은 [_shared-layout.md](./_shared-layout.md) 참고.

## 1. 개요

- **라우트**: `/games`
- **파일 위치**
  - page: `src/app/games/page.tsx:1-17`
  - loading: `src/app/games/loading.tsx:1-22`
  - error: 전용 파일은 없고 루트 `src/app/error.tsx`가 적용됩니다.
  - view 진입: `src/views/games/ui/games-view.tsx:11-18` (`GamesAppBar` + `GameBoard`)
  - 필터 feature: `src/features/filter-games/**` (`GameSearchForm`, `GamesFilterSheet`, `gamesHref`)
- **페이지 목적**: 모집 기한이 남았고 플레이가 끝나지 않은 구인글을 검색, 정렬, 페이지 단위로 보여줍니다. 정원이 찬 구인글도 대기 신청을 받을 수 있어 목록에 남깁니다 (`src/shared/server/games.ts:8`, commit 097e713).

## 2. 접근 조건

| 사용자 | 결과 |
|---|---|
| 비로그인 | 같은 화면이 보입니다. 인증 확인 코드가 없습니다 (`page.tsx`, `games-view.tsx`에 `getCurrentUser` 없음) |
| 로그인 | 같은 화면 |
| GM(호스트) / 참여자 | 차이 없음. 카드에 "내 글"이나 "참여 중" 표시도 없습니다 |

- 리다이렉트나 `notFound`는 없습니다.
- AppBar의 "새 구인"은 비로그인에게도 보입니다. 이동한 `/games/new`는 비로그인이면 `redirect("/")`합니다 (`src/views/create-game/ui/create-game-view.tsx:6`).

## 3. 진입 경로와 이탈 경로

### 진입

| 출발 | 요소 | 근거 |
|---|---|---|
| 전역 | BottomNav "구인 목록" 탭 | `src/shared/ui/bottom-nav.tsx:9` |
| 홈 랜딩 | "전체 보기" | `src/views/home/ui/landing-recruiting-preview.tsx:17` |
| 홈 대시보드 | "구인 목록 보기" | `src/views/home/ui/home-dashboard.tsx:74` |
| 홈 대시보드(빈 상태) | "구인 목록 둘러보기" | `src/views/home/ui/home-start-empty.tsx:15` |
| 마이페이지 빈 상태 | "구인 목록 보기" | `src/views/my-page/ui/session-summary-empty.tsx:14` |
| 구인 상세 | AppBar 뒤로가기 (`back="/games"`) | `src/views/game-detail/ui/game-detail.tsx:25`, `src/app/games/[id]/loading.tsx:6` |
| 구인 작성 1단계 | 뒤로가기 (`backHref="/games"`) | `src/widgets/game-form/ui/game-form-wizard.tsx:57` |
| 구인 삭제 후 | `{ redirect: "/games" }` 반환 | `src/features/delete-game/api/delete-game.ts:16` |
| 목록 자체 | 검색 폼 제출, 정렬 적용, 페이지네이션, "검색 초기화" | 5장 |

### 이탈

| 요소 | 목적지 | 근거 |
|---|---|---|
| AppBar "새 구인" | `/games/new` | `src/views/games/ui/games-app-bar.tsx:12` |
| 구인글 카드 | `/games/{id}` | `src/views/games/ui/game-list.tsx:41` |
| 검색 제출 | `GET /games?q=…(&sort=…)` | `src/features/filter-games/ui/game-search-form.tsx:6-8` |
| 정렬 "적용하기" | `router.push(gamesHref({ q, sort }))` → `/games?…` | `games-filter-sheet.tsx:20-23` |
| 페이지네이션 | `/games?q&sort&page=n` (일반 `<a>`) | `game-list.tsx:46-50`, `packages/ui/src/pagination.tsx:34,48,64` |
| 빈 상태 "검색 초기화" | `/games` | `src/views/games/ui/games-empty.tsx:27` |
| 빈 상태 "새 구인 등록" | `/games/new` | `games-empty.tsx:30` |

## 4. 데이터

### searchParams (`page.tsx:6-17`)

| 키 | 파싱 | 기본값 |
|---|---|---|
| `page` | `Number(sp.page) \|\| 1` | 1. 음수와 범위 초과 값은 거르지 않습니다. 쿼리 offset만 `Math.max(1, page)`로 보정합니다 (`games.ts:32`) |
| `q` | 문자열 그대로 | `undefined` |
| `sort` | `parseGameSort(sp.sort)` (`src/shared/api/game-sort.ts:11-13`). `latest`/`deadline`/`slots`가 아니면 기본값 | `"latest"` |

- 직렬화: `gamesHref`(`src/features/filter-games/lib/games-href.ts:2-9`)는 `undefined`와 `""` 값을 뺍니다. 파라미터가 없으면 `/games`를 돌려줍니다.
- 정렬 적용 시 `latest`는 URL에서 뺍니다 (`games-filter-sheet.tsx:21`).
- 페이지네이션 링크는 `sort`를 항상 넣습니다. `page.tsx`가 파싱한 값을 넘기므로 기본값이어도 `sort=latest`가 붙습니다 (`game-list.tsx:49`).

### 조회: `getRecruitingGamesPage(page, { q, sort })` (`src/shared/server/games.ts:9-47`)

- **where**
  - `q`가 있으면 `games.title ILIKE %q%` 또는 `games.rule ILIKE %q%` (`:16-18`)
  - `games.confirmed_at IS NULL` 또는 `games.confirmed_at > now`. 확정 세션이 지난 구인글은 제외합니다 (`:20`)
  - `games.end_date > now` (`:21`)
  - 정원으로 거르는 조건은 없습니다. 097e713에서 제거됐습니다.
- **orderBy** (`:24-30`)

  | sort | 라벨 | SQL |
  |---|---|---|
  | `latest` | "최신순" | `games.created_at desc` |
  | `deadline` | "마감 임박순" | `games.end_date asc` |
  | `slots` | "남은 자리순" | `games.max_players - (participants 전체 count)` desc. `status`를 구분하지 않고 대기자까지 셉니다 |

- **페이지 크기**: `GAMES_PAGE_SIZE = 12` (`:6`)
- **total**: `db.$count(games, where)` (`:44`)
- 반환값은 `{ rows, total, pageSize }`입니다. `GameBoard`가 promise 하나를 만들고 `GamesCount`와 `GameList`가 함께 await합니다 (`game-board.tsx:18,27,35`).

| 표시 필드 | 테이블.컬럼 |
|---|---|
| 썸네일 | `games.thumbnail_url` |
| 회차 | `games.round` |
| 제목 | `games.title` |
| 룰 | `games.rule` |
| GM 이름/아바타 | `profiles.username`, `profiles.avatar_url` |
| 확정 참여자 수 | `participants.status = 'confirmed'` 건수 |
| 정원 | `games.max_players` |
| 상태 | `games.end_date`, 정원, 확정 참여자 수, `games.waitlist_enabled`로 계산 (`deriveGameStatus`) |

### 캐시

- `export const dynamic = "force-dynamic"` (`page.tsx:4`)
- 이 경로를 `revalidatePath("/games")`로 무효화하는 곳:
  - `src/features/join-game/api/join-game.ts:73`
  - `src/features/join-game/api/leave-game.ts:41`
  - `src/features/adjust-roster/api/adjust-roster.ts:13`
  - `src/features/confirm-session/api/confirm-session.ts:25`
  - `src/features/create-second-round/api/create-second-round.ts:106`
- `Suspense key = "{q}|{sort}|{page}"` (`game-board.tsx:19`). 조건이 바뀌면 fallback이 다시 표시됩니다.

## 5. UI 구성 요소

- **GamesAppBar**: `src/views/games/ui/games-app-bar.tsx:6-17` → `src/shared/ui/app-bar.tsx:14-52`
  - sticky `top-0`, 높이 52px, 뒤로가기 없음
  - 제목 "구인 목록" (heading2)
  - 오른쪽 버튼 "새 구인" (size sm) → `/games/new`
- **GameBoard**: `src/views/games/ui/game-board.tsx:17-40`, `Container` (기본 size `lg`, `max-w-6xl`)
  - **sticky 헤더** (`:23-31`, `sticky top-[52px] z-10`)
    - **GameSearchForm** (`src/features/filter-games/ui/game-search-form.tsx:4-11`)
      - `<form action="/games" method="get">`
      - `sort`가 있으면 hidden input `sort`
      - `TextInput name="q"`, `defaultValue={q}`, placeholder "게임명 검색"
      - 제출 버튼이 없어 Enter로 제출합니다. `page`가 빠지므로 1페이지로 돌아갑니다.
    - **건수 + 정렬 행**
      - **GamesCount** (`game-list.tsx:12-19`): "전체 `{total}`건". 로딩 중에는 `Skeleton h-4 w-16`
      - **GamesFilterSheet 트리거** (`src/features/filter-games/ui/games-filter-sheet.tsx:27-37`): 현재 정렬 라벨("최신순"/"마감 임박순"/"남은 자리순")과 `ChevronDown`
        - 클릭하면 선택값을 현재 정렬로 초기화하고 시트를 엽니다.
  - **목록 영역** (`:33-37`, `Suspense` fallback `GameListSkeleton`)
    - **GameList** (`game-list.tsx:29-58`)
      - **GameCard × 최대 12** (`src/entities/game/ui/game-card.tsx:18-55`): `Link /games/{id}`로 감싼 `Card interactive`
        - **썸네일** (`thumbnail_url`이 있을 때만, h-32): `GameThumbnail` (`game-thumbnail.tsx`)이 로드 완료까지 Skeleton을 겹칩니다. `alt=""`
        - **1행**: 회차 뱃지("`{round}`회차", round ≥ 2만), 제목(heading3, 말줄임), 오른쪽 상태 뱃지
        - **2행**: `rule` (body2 muted)
        - **3행**
          - 왼쪽 `GameGmLabel`: 아바타 sm + "GM `{username ?? "?"}`" (`game-gm-label.tsx:19`)
          - 오른쪽 `GameSeatProgress`: 52px 진행바(상태색. UI 키트 `Progress`는 `recruiting`/`confirmed`/`closed` 세 색만 받아 `full`은 `closed` 색으로 바꿔 넘긴다)와 "`{확정 참여자 수}/{max_players}`" (`game-seat-progress.tsx:15-23`)
      - **Pagination** (`packages/ui/src/pagination.tsx:15-78`): `totalPages <= 1`이면 렌더하지 않습니다.
        - "‹"(이전) 버튼. 1페이지에서는 비활성 `span`
        - 현재 페이지 ±2 숫자. 현재 페이지는 `aria-current="page"`와 primary 배경
        - "›"(다음) 버튼
      - **페이지 안내** (`game-list.tsx:51-55`, `totalPages > 1`일 때): "`{page}`/`{totalPages}` 페이지 · `{pageSize}`개씩"
- **GamesFilterSheet 시트** (`games-filter-sheet.tsx:39-65`, `src/shared/ui/sheet.tsx`, Base UI Dialog, 하단 시트 `max-w-[412px]`)
  - 제목 "정렬"
  - 옵션 3행: "최신순" / "마감 임박순" / "남은 자리순". 선택된 행은 subtitle1과 `Check` 아이콘
    - 행을 클릭하면 로컬 상태만 바뀌고 즉시 적용되지 않습니다.
  - 버튼 "적용하기" → `router.push(gamesHref({ q, sort }))`, 시트 닫힘. `page`는 빠지므로 1페이지로 이동합니다.

### 상태 뱃지 / 진행바 색 (`src/entities/game/model/status.ts:13-26`, `derive-game-status.ts:7-23`)

| status | 조건 | 뱃지 라벨 | 색 | 진행바 `color` |
|---|---|---|---|---|
| `recruiting` | 기한 내, 확정 참여자 < 정원 | "모집 중" | primary | `recruiting` |
| `confirmed` | 기한 내, 확정 참여자 ≥ 정원, `waitlist_enabled = true` | "대기 모집" | success | `confirmed` |
| `full` | 기한 내, 확정 참여자 ≥ 정원, `waitlist_enabled = false` (커밋 `9f60a24`) | "모집 마감" | gray | `closed` |
| `closed` | `end_date < now` (정원·대기 설정보다 우선) | "모집 마감" | gray | `closed` |

- `full` 구인글도 목록 조회 조건(`end_date > now`, 확정 세션 미경과, `src/shared/server/games.ts:19-21`)에 걸리지 않으므로 목록에 계속 나온다. 상세에서는 신청이 막히지만 일정 조율·참여자 관리는 그대로 열려 있다([game-detail.md](./game-detail.md) §6).

## 6. 상태별 화면

| 상태 | 화면 |
|---|---|
| 라우트 로딩 (`loading.tsx`) | `GamesAppBar`, 빈 `GameSearchForm`(q/sort 없음), 건수 Skeleton, `GameListSkeleton`(카드 셰이머 4개, `game-list-skeleton.tsx:5-20`). 정렬 트리거는 없습니다 |
| 스트리밍 로딩 (조건 변경) | sticky 헤더는 그대로 두고 건수 자리 Skeleton과 카드 Skeleton 4개를 보여줍니다 (`game-board.tsx:26,34`) |
| 빈 상태 (rows 0건) | `GamesEmpty` (`games-empty.tsx:6-35`): 이미지 `/empty-states/empty-search.png` 140px(alt "조건에 맞는 구인이 없습니다"), 제목 "조건에 맞는 구인이 없습니다", 설명 "검색어를 바꾸거나 / 직접 구인을 올려보세요.", 버튼 "검색 초기화"(outline → `/games`), "새 구인 등록" → `/games/new`. 헤더 건수는 "전체 0건" |
| 범위 초과 페이지 | rows가 0건이면 같은 `GamesEmpty`가 나옵니다 (`game-list.tsx:33-35`). 헤더에는 실제 total이 표시되고 페이지네이션은 렌더되지 않습니다 |
| 에러 | 루트 `src/app/error.tsx`: "문제가 발생했습니다" / "잠시 후 다시 시도해 주세요." / "다시 시도" + "메인으로 돌아가기". "다시 시도"는 Next 16.3이 넘기는 `retry` prop을 호출한다 (`src/app/error.tsx:8,22`, `node_modules/next/dist/client/components/error-boundary.d.ts:6`) |
| 도메인 상태 | 카드별 "모집 중" / "대기 모집" / "모집 마감" 뱃지. 목록의 "모집 마감"은 대부분 `full`(대기 신청을 끈 구인글의 정원 충족)입니다. `closed`는 where 조건(`end_date > now`) 때문에 조회 시점에는 나오지 않고, 렌더 사이에 기한이 지나는 경우에만 나올 수 있습니다 |
| 확정 세션 | `confirmed_at`이 미래인 구인글은 목록에 남지만 카드에는 확정 일시가 표시되지 않습니다 |
| 대기자 | 카드에는 확정 참여자 수만 표시되고 대기자 수는 없습니다 |
| 권한별 | 차이 없음 |

## 7. 폼과 유효성 검사

| 필드 | 필수 | 규칙 | 에러 메시지 |
|---|---|---|---|
| `q` (GameSearchForm) | 아님 | `type`, `maxLength`, `required` 속성이 없습니다. 빈 값으로 제출하면 `q=`가 붙고 `page.tsx`에서는 빈 문자열이 falsy라 검색 조건이 빠집니다 (`games.ts:16`). 입력한 `%`, `_`는 escape 없이 ILIKE 패턴에 들어갑니다 (`games.ts:17`) | 없음 |
| 정렬 (시트) | - | 3개 중 1개 선택, 알 수 없는 값은 `latest` | 없음 |

## 8. 액션과 부수효과

- Server Action과 API 호출은 없습니다. 모든 조작이 URL 이동입니다 (GET 폼, `router.push`, `<a href>`).
- 토스트, `revalidatePath`, Discord Webhook 알림도 없습니다 (이 페이지에서 발생하는 것 기준).

## 9. 반응형과 접근성 현황

- **breakpoint 클래스**: 목록 관련 컴포넌트에는 `sm:`/`md:`/`lg:`가 없습니다. 반응형 요소는 `GameCard` 썸네일의 `sizes="(max-width: 896px) 100vw, 896px"`(`game-card.tsx:31`)뿐입니다.
- **sticky**: AppBar `top-0 z-20`, 검색 헤더 `top-[52px] z-10`
- **aria**
  - Pagination `nav aria-label="페이지네이션"`, 이전/다음 `aria-label="이전"`/`"다음"`, 현재 페이지 `aria-current="page"`, 비활성 화살표 `aria-hidden` (`pagination.tsx:30,38,51,42,72`)
  - 정렬 트리거 `ChevronDown aria-hidden`, 선택 `Check aria-hidden` (`games-filter-sheet.tsx:36,56`)
  - 정렬 옵션 버튼에는 `aria-pressed`, `aria-selected`, `role="radio"` 같은 선택 상태 속성이 없습니다.
- **label**: 검색 `TextInput`에 `<label>`, `aria-label`, `type="search"`가 없고 placeholder "게임명 검색"만 있습니다 (`game-search-form.tsx:8`).
- **alt**
  - 카드 썸네일 `alt=""`(장식 처리)
  - GM 아바타 `alt={name ?? ""}` (`packages/ui/src/avatar.tsx:55`)
  - 빈 상태 이미지 alt는 제목과 같은 문구입니다.
- **시트**: Base UI `Dialog` 기반이고 `Sheet.Title`이 `Dialog.Title`입니다. ❓ 확인 필요: Esc와 백드롭 클릭 닫기, 포커스 트랩이 Base UI 기본 동작으로 제공되는지.
- **키보드**: 검색은 Enter로 제출합니다 (제출 버튼 없음). 카드는 `Link`라 탭 포커스를 받습니다.
- **sr-only**: 없습니다.

## 10. 현재 UX 문제점 메모

1. **"남은 자리순"이 대기자까지 셉니다.** 정렬 SQL은 `participants` 전체를 세지만(`games.ts:24`) 카드의 인원 표시는 확정 참여자만 셉니다(`countConfirmed`). 대기자가 있는 구인글은 표시 인원과 정렬 순서가 어긋나고, 남은 자리가 음수가 될 수 있습니다.
2. **"모집 중"을 뜻하는 이름과 실제 목록이 다릅니다.** 함수명 `getRecruitingGamesPage`와 홈의 "지금 모집 중" 제목과 달리, 097e713 이후에는 정원이 찬("대기 모집") 구인글도 포함됩니다. 정원 필터를 켜는 옵션도 없습니다. 9f60a24 이후에는 대기 신청을 끈 구인글이 정원을 채우면 "모집 마감"(`full`) 뱃지를 단 채 남는데, 라벨·색이 기한 경과(`closed`)와 같습니다(`status.ts:15, 17, 23, 25`).
3. **검색 placeholder와 실제 검색 범위가 다릅니다.** placeholder는 "게임명 검색"이지만 `rule` 컬럼도 함께 검색합니다 (`games.ts:17`).
4. **로딩 폴백이 실제 헤더와 다릅니다.** `loading.tsx`의 `GameSearchForm`은 q/sort 없이 렌더되고 정렬 트리거가 없습니다 (`loading.tsx:13-14`). 주석은 "실제 화면과 같은 조각을 쓴다"(`loading.tsx:6`)고 하지만, 검색어가 있는 상태에서 라우트 전환이 일어나면 입력창이 잠깐 비고 정렬 버튼이 나중에 나타납니다.
5. **정렬 기본값이 URL에서 일관되지 않습니다.** 시트 적용은 `latest`를 URL에서 빼고, 페이지네이션 링크는 `sort=latest`를 넣습니다 (`games-filter-sheet.tsx:21` vs `game-list.tsx:49`). 같은 상태가 두 가지 URL로 표현됩니다.
6. **이동 방식이 섞여 있습니다.** 페이지네이션은 `next/link`가 아닌 일반 `<a>`라 전체 문서를 다시 불러오고(`pagination.tsx:14` 주석), 정렬은 `router.push`로 클라이언트 전환을 합니다.
7. **범위 밖 페이지가 빈 상태로 잘못 안내됩니다.** `?page=99`처럼 범위를 벗어나면 "조건에 맞는 구인이 없습니다"가 뜨는데, 헤더는 "전체 N건"을 보여주고 페이지네이션도 없어 복귀 수단이 "검색 초기화"뿐입니다. 음수 `page`도 `Pagination`에 그대로 전달됩니다.
8. **비로그인 "새 구인" 클릭 시 설명 없이 `/`로 튕깁니다.** AppBar "새 구인"과 빈 상태 "새 구인 등록"이 비로그인에게도 노출됩니다 (`create-game-view.tsx:6`).
9. **카드에서 내 관계를 알 수 없습니다.** 로그인 사용자도 목록에서 자신이 GM인지, 참여자나 대기자인지 알 수 없고 확정 세션 일시도 보이지 않습니다.
10. **정렬 시트는 즉시 적용되지 않습니다.** 옵션을 고른 뒤 "적용하기"를 눌러야 반영되고, 시트를 그냥 닫으면 선택이 버려집니다 (`games-filter-sheet.tsx:50,61`).
11. **검색 입력에 접근 가능한 이름과 제출 버튼이 없습니다** (9장).
12. **빈 상태 이미지 alt가 제목과 중복돼** 스크린리더에서 같은 문구를 두 번 읽습니다 (`games-empty.tsx:11,17`).
13. **폭 기준이 다른 페이지와 다릅니다.** 목록은 `Container` 기본 `lg`(`max-w-6xl`)인데 홈은 `size="sm"`입니다. 실제 폭은 루트 레이아웃의 `max-w-screen-max`가 제한합니다. ❓ 확인 필요: `screen-max` 토큰 값.
