# 프로필 편집 (`/me/edit`)

## 1. 개요

본인 프로필을 편집하는 화면이다. 표시 이름(`profiles.username`), 한 줄 소개(`profiles.bio`), 기본 가능 시간대 프리셋(`profiles.default_slots`)을 바꿀 수 있고, Discord 아바타를 다시 불러올 수 있다. 하단에 로그아웃 버튼이 있다.

- 라우트: `src/app/me/edit/page.tsx:1-4` → `EditProfileView` (`src/views/edit-profile/ui/edit-profile-view.tsx:8`)
- 폼: `src/features/edit-profile/**`
- 공통 레이아웃: [_shared-layout.md](./_shared-layout.md)

## 2. 접근 조건

| 조건                           | 결과                                                                                                                                                  | 근거                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 비로그인                       | `redirect("/")` (`next` 없음)                                                                                                                         | `src/views/edit-profile/ui/edit-profile-view.tsx:9-10`            |
| 로그인, `profiles` 행 있음     | 기존 값으로 폼 초기화                                                                                                                                 | 같은 파일 `:12, :20-25`                                           |
| 로그인, `profiles` 행 없음     | 이름·소개는 `""`, 슬롯은 `[]`로 시작. 아바타만 Discord 메타데이터로 대체. 저장하면 `UPDATE`가 0행에 적용되지만 성공 토스트와 redirect는 그대로 나간다 | `:21-24`, `src/features/edit-profile/api/update-profile.ts:28-34` |
| Server Action 호출 시 비로그인 | `{ error: "로그인이 필요합니다." }`                                                                                                                   | `update-profile.ts:15-16`, `refresh-avatar.ts:10-11`              |

- notFound 규칙 없음. 본인 외 프로필 편집 경로 없음.
- `profiles` 행은 가입 시 `handle_new_user` 트리거가 `INSERT … ON CONFLICT DO NOTHING`으로 만든다(`drizzle/0001_auth_trigger_and_rls.sql:5-33`). 그래서 "행 없음"은 예외적인 경우다.

## 3. 진입 경로와 이탈 경로

### 진입

| 출발                                    | 요소                                           | 근거                                         |
| --------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `/me`                                   | 헤더 연필 아이콘 "프로필 편집"                 | `src/views/my-page/ui/my-page-header.tsx:28` |
| `/` (로그인 대시보드, 내 게임 0건일 때) | "프로필과 기본 가능 시간대 설정" 행의 "설정 ›" | `src/views/home/ui/home-dashboard.tsx:44-57` |

### 이탈

| 요소          | 목적지                                                                              | 근거                                                                            |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| AppBar 뒤로   | `/me`                                                                               | `src/views/edit-profile/ui/edit-profile-view.tsx:17`                            |
| "저장" 성공   | `router.push("/me")`                                                                | `src/features/edit-profile/ui/edit-profile-form.tsx:39`, `update-profile.ts:34` |
| "로그아웃"    | 목적지 이동 없음. `router.refresh()` → 뷰 재렌더 시 비로그인이 되어 `redirect("/")` | `src/features/auth/ui/sign-out-button.tsx:10-13`, `edit-profile-view.tsx:10`    |
| 비로그인 접근 | `/`                                                                                 | `edit-profile-view.tsx:10`                                                      |

## 4. 데이터

### 조회

| 호출                  | 쿼리                                        | 근거                                 |
| --------------------- | ------------------------------------------- | ------------------------------------ |
| `getCurrentUser()`    | Supabase `auth.getUser()`                   | `src/shared/server/supabase.ts:7-13` |
| `getProfile(user.id)` | `profiles` where `id = user.id` (전체 컬럼) | `src/shared/server/profiles.ts:3-7`  |

### 필드

| 폼 필드          | 컬럼                                    | 초기값                                                      | 저장 시 변환                                                         |
| ---------------- | --------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| 표시 이름        | `profiles.username` (text, not null)    | `profile?.username ?? ""`                                   | `trim()`. 1~30자                                                     |
| 한 줄 소개       | `profiles.bio` (text, null)             | `profile?.bio ?? ""`                                        | `trim()`. 200자 이하. 빈 문자열이면 `null` 저장                      |
| 기본 가능 시간대 | `profiles.default_slots` (text[], null) | `profile?.defaultSlots ?? []`                               | `SLOT_KEYS`에 포함된 값만 남긴다                                     |
| 아바타           | `profiles.avatar_url` (text, null)      | `profiles.avatar_url` ?? `user_metadata.avatar_url` ?? null | 별도 액션 `refreshAvatar`로 `user_metadata.avatar_url` 값을 덮어쓴다 |

- 슬롯 프리셋 (`src/features/edit-profile/model/slot-presets.ts:2-10`):

  | key               | label       |
  | ----------------- | ----------- |
  | `weekday_evening` | "평일 저녁" |
  | `weekend_day`     | "주말 낮"   |
  | `weekend_evening` | "주말 저녁" |

- `profiles.discord_id`, `created_at`은 이 화면에서 쓰지 않는다.
- params / searchParams 없음.

### 캐시

- `dynamic` 선언 없음. 쿠키 기반 `getCurrentUser`를 쓴다.
- 저장과 아바타 갱신은 `revalidatePath("/me")`만 호출한다. `/me/edit` 자체나 username·avatar를 표시하는 `/games/**` 경로는 revalidate하지 않는다. ❓ 확인 필요: `/games` 목록·상세가 동적 렌더라서 영향이 없는지.

## 5. UI 구성 요소

```
AppBar (뒤로 → /me, "프로필 편집")
Container(size="md", py-6, gap 6)
├─ EditProfileForm <form>
│  ├─ AvatarRefreshField (아바타 + "Discord 아바타 다시 불러오기")
│  ├─ Field "표시 이름" + TextInput
│  ├─ Field "한 줄 소개" + Textarea
│  ├─ SlotPresetField "기본 가능 시간대" (Chip ×3)
│  ├─ 폼 에러 텍스트 (조건부)
│  └─ Button "저장"
└─ 구분선 + SignOutButton "로그아웃"
```

- **AppBar**: `src/views/edit-profile/ui/edit-profile-view.tsx:17`, `src/shared/ui/app-bar.tsx:14-51`
  - 표시: ChevronLeft 뒤로 링크(`aria-label="뒤로"`, → `/me`), 제목 "프로필 편집"(`heading3`, truncate).
- **AvatarRefreshField**: `src/features/edit-profile/ui/avatar-refresh-field.tsx:9-40`
  - 표시: `Avatar size="3xl"`, 가운데 정렬. 이미지가 없으면 이니셜을 쓰는데, `name`에 폼의 현재 `username` 상태가 들어간다(`edit-profile-form.tsx:51`). 그래서 이름을 입력하는 동안 이니셜이 따라 바뀐다.
  - 버튼: "Discord 아바타 다시 불러오기"(ghost, sm). 실행 중에는 `loading`이라 disabled다.
  - 버튼은 `type`을 지정하지 않았지만 `@trpg/ui` Button 기본값이 `type="button"`이라 폼을 제출하지 않는다(`packages/ui/src/button.tsx:64`).
  - 클릭 결과는 §8.
- **표시 이름**: `edit-profile-form.tsx:53-66`, `packages/ui/src/field.tsx:64-86`
  - 라벨 "표시 이름"(`<label htmlFor="username">`), 설명 "구인 카드와 참여자 목록에 보이는 이름입니다."
  - `TextInput id="username"`, `maxLength={30}`, placeholder 없음.
  - 서버 에러가 `field: "username"`이면 설명 대신 빨간 에러 문구를 보이고 `invalid`로 표시한다.
- **한 줄 소개**: `edit-profile-form.tsx:68-77`
  - 라벨 "한 줄 소개". 설명 없음.
  - `Textarea id="bio"`, placeholder "주로 크툴루를 굴립니다. 평일 저녁 선호.", `maxLength={200}`, `min-h-[76px]`.
  - 에러는 `field: "bio"`일 때 표시되지만, Textarea에는 `invalid`를 넘기지 않는다(TextInput과 다름).
- **SlotPresetField**: `src/features/edit-profile/ui/slot-preset-field.tsx:7-34`
  - 라벨 "기본 가능 시간대", 설명 "일정 조율 그리드의 초기값으로 씁니다." `htmlFor`는 없다.
  - `Chip shape="block"` 3개("평일 저녁", "주말 낮", "주말 저녁")가 가로로 균등 분할(`flex-1`)되고 간격은 7px다.
  - Chip은 `type="button"`으로 렌더된다(`packages/ui/src/chip.tsx:48`). 클릭하면 key를 선택 목록에 넣거나 뺀다(복수 선택). 선택된 칩은 tinted 스타일이다.
- **폼 에러 텍스트**: `edit-profile-form.tsx:81-85`
  - 서버 에러에 `field`가 없을 때만 보인다(예: "로그인이 필요합니다."). `body2`, danger 색.
- **저장 버튼**: `edit-profile-form.tsx:86-88`
  - "저장", `type="submit"`, `size="lg"`, 높이 50px, 전체 폭. 제출 중에는 `loading`(disabled, `bg-primary-300`)이다.
- **SignOutButton**: `src/views/edit-profile/ui/edit-profile-view.tsx:26-28`, `src/features/auth/ui/sign-out-button.tsx:7-20`
  - 상단 구분선 아래에 "로그아웃"(outline, 46px, 전체 폭)이 있다. `<form>` 바깥이다.
  - 클릭하면 Supabase 브라우저 클라이언트 `auth.signOut()` 후 `router.refresh()`.
  - 로딩 상태, 확인 다이얼로그, 토스트 모두 없다.

## 6. 상태별 화면

| 상태           | 화면                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로딩(최초)     | `loading.tsx` 없음                                                                                                                                                                                |
| 저장 중        | "저장" 버튼 로딩. 입력 필드는 비활성화되지 않는다                                                                                                                                                 |
| 아바타 갱신 중 | 아바타 버튼 로딩                                                                                                                                                                                  |
| 필드 에러      | 해당 필드 아래 빨간 문구(설명 문구를 대체)                                                                                                                                                        |
| 폼 에러        | 저장 버튼 위 빨간 문구                                                                                                                                                                            |
| 새 제출 시작   | 기존 에러를 `setFailure(null)`로 먼저 지운다(`edit-profile-form.tsx:31`)                                                                                                                          |
| 런타임 예외    | 전역 `src/app/error.tsx` ("문제가 발생했습니다"). Server Action 안의 DB 예외는 try/catch가 없다. ❓ 확인 필요: 클라이언트 transition 안의 액션 throw가 error boundary로 가는지, 조용히 실패하는지 |
| 빈 상태        | 해당 없음(빈 값으로 폼 표시)                                                                                                                                                                      |
| 권한별         | 본인 전용. GM/참여자 차이 없음                                                                                                                                                                    |

## 7. 폼과 유효성 검사

제출 흐름: `onSubmit`에서 `preventDefault`한 뒤 `startTransition`으로 `updateProfile({ username, bio, defaultSlots })`를 호출한다(`edit-profile-form.tsx:29-41`). 네이티브 `required`는 없다.

| 필드         | 클라이언트                   | 서버 (`update-profile.ts`)                                        | 에러 문구(원문)                                          |
| ------------ | ---------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| username     | `maxLength=30` (입력 제한만) | `trim()` 후 길이 `< 1` 또는 `> 30` (`:18-21`)                     | "닉네임은 1~30자로 입력하세요." (`field: "username"`)    |
| bio          | `maxLength=200`              | `trim()` 후 `> 200` (`:22-25`)                                    | "한 줄 소개는 200자 이내로 입력하세요." (`field: "bio"`) |
| defaultSlots | 프리셋 칩만 선택 가능        | `SLOT_KEYS.includes`로 필터. 알 수 없는 키는 조용히 버린다(`:26`) | 없음                                                     |
| 인증         | 없음                         | `getCurrentUser()` null (`:15-16`)                                | "로그인이 필요합니다." (필드 없음 → 폼 에러)             |

- 필드 라벨은 "표시 이름"인데 에러 문구는 "닉네임"이라고 한다.
- 이름 중복 검사는 없다(`profiles.username`에 unique 제약 없음, `src/shared/server/schema.ts:24`).
- 변경 여부(dirty) 확인이나 이탈 경고는 없다.

## 8. 액션과 부수효과

### `updateProfile` (Server Action, `src/features/edit-profile/api/update-profile.ts:14-35`)

1. 인증 및 유효성 검사(§7)
2. `UPDATE profiles SET username, bio (빈 값 → null), default_slots WHERE id = user.id` (`:28-31`)
3. `revalidatePath("/me")` (`:33`)
4. `{ redirect: "/me" }`를 반환하고, 클라이언트가 `toast.success("프로필을 저장했습니다")` 후 `router.push("/me")` (`edit-profile-form.tsx:38-39`)
5. 실패하면 토스트 없이 인라인 에러만 표시

### `refreshAvatar` (Server Action, `src/features/edit-profile/api/refresh-avatar.ts:9-19`)

1. 비로그인이면 `{ error: "로그인이 필요합니다." }`
2. `user.user_metadata.avatar_url`이 없으면 `{ error: "Discord 아바타 정보를 찾을 수 없습니다." }`
3. `UPDATE profiles SET avatar_url WHERE id = user.id`
4. `revalidatePath("/me")`
5. 클라이언트 처리(`avatar-refresh-field.tsx:20-30`): 실패면 `toast.error(result.error)`, 성공이면 로컬 `url` 상태를 교체하고 `toast.success("아바타를 다시 불러왔습니다")`

- 이 액션은 Discord API를 직접 호출하지 않는다. 현재 Supabase 세션의 `user_metadata`만 읽는다. ❓ 확인 필요: Supabase가 `user_metadata.avatar_url`을 재로그인 때만 갱신하는지. 그렇다면 로그인 상태에서 이 버튼을 눌러도 Discord에서 바꾼 새 아바타가 반영되지 않는다.

### 로그아웃 (`src/features/auth/api/sign-out.ts:3-6`)

- 클라이언트에서 `supabase.auth.signOut()` 후 `router.refresh()`. 토스트 없음.

### Discord Webhook

없음.

## 9. 반응형과 접근성 현황

- `Container size="md"`(`max-w-4xl`)를 쓴다. 마이페이지와 세션 목록은 `sm`(`max-w-2xl`)이라 데스크톱에서 폼 폭이 더 넓다.
- 브레이크포인트 분기 없음. 슬롯 칩 3개는 좁은 폭에서도 한 줄로 균등 분할되며 줄바꿈하지 않는다.
- 라벨: username과 bio는 `<label htmlFor>`로 연결돼 있다. 슬롯 그룹은 `<label>`만 있고 연결 대상이 없다(`fieldset`/`legend`, `role="group"` 없음).
- 에러와 설명 `<p>`는 `aria-describedby`로 연결되지 않았다. `invalid` prop은 스타일 클래스만 바꾸고 `aria-invalid`를 붙이지 않는다(`packages/ui/src/text-input.tsx:20-21`).
- 슬롯 Chip은 선택 상태가 클래스로만 표현되고 `aria-pressed`가 없다(`packages/ui/src/chip.tsx:29-50`, `slot-preset-field.tsx:22-29`).
- 저장 성공이나 아바타 결과는 토스트로만 알린다. 인라인 에러에는 라이브 영역(`role="alert"`)이 없다.
- 아바타 `<img>`의 `alt`는 `name`이다(`packages/ui/src/avatar.tsx:55`). 편집 중인 username이 그대로 들어간다.

## 10. 현재 UX 문제점 메모

- "기본 가능 시간대" 설명은 "일정 조율 그리드의 초기값으로 씁니다."인데, `default_slots`/`SLOT_PRESETS`를 읽는 곳이 편집 화면 말고는 없다(grep: `src/views/edit-profile/ui/edit-profile-view.tsx:23`, `schema.ts:29`뿐). 조율 그리드에 반영되지 않는, 사실상 저장만 되는 설정이다.
- 라벨 "표시 이름"과 에러 문구 "닉네임"의 용어가 다르다.
- 로그아웃이 편집 화면 맨 아래에 있다. 누르면 확인이나 피드백 없이 `/`로 튕긴다.
- 저장 후 무조건 `/me`로 이동한다. `/`의 "설정 ›"에서 들어온 경우에도 `/me`로 간다.
- 아바타 갱신은 DB만 바꾸고 `/me`만 revalidate한다. 폼을 저장하지 않고 뒤로 가도 아바타 변경은 이미 반영된 상태다. 즉 폼과 분리된 즉시 저장이다.
- `profiles` 행이 없는 사용자는 UPDATE가 0행이어도 성공 토스트가 뜬다(`update-profile.ts:28-34`).
- 한 줄 소개에 글자 수 카운터가 없고, 200자는 `maxLength`로 잘려서 입력만 막힌다.
- 한 줄 소개(`bio`)는 저장만 되고 표시하는 화면이 없다(`src/` 전체에서 `schema.ts:27`과 edit-profile 슬라이스 외 참조 없음).
