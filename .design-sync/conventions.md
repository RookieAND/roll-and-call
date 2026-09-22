# Roll & Call 디자인 시스템 사용 규칙

모바일 우선(320–412px 단일 컬럼)의 한국어 TRPG 세션 앱 키트다. 문구는 도메인 어휘(구인, 모집 중, 대기 접수 중, 마감, GM, 참여자, 일정 조율, 확정, 추첨, 디스코드)를 쓴다.

## 감싸는 것과 테마

프로바이더가 없다. 컴포넌트를 그대로 쓰면 된다. 필요한 것은 `styles.css` 하나이며, 그 안에서 폰트(`fonts/fonts.css`)와 컴포넌트 CSS(`_ds_bundle.css`)를 모두 불러온다.

테마는 **`data-theme` 속성**으로 켠다. 페이지 전체는 `<html data-theme="dark">`, 일부만 뒤집을 때는 그 상자에 `data-theme="dark"`를 준다. 속성이 없으면 라이트다. 클래스(`.dark`)는 쓰지 않는다.

```tsx
<html lang="ko" data-theme="dark">
  <body className="bg-canvas font-sans text-gray-900">…</body>
</html>
```

## 스타일 쓰는 법

클래스는 Tailwind 유틸리티지만 **이름이 이 키트의 것**이다. 기본 팔레트(`bg-blue-500`)나 기본 스케일(`p-4`, `rounded-lg`)은 컴파일돼 있지 않아 조용히 무시된다. 아래 표의 이름만 쓴다.

| 갈래 | 쓸 수 있는 이름 |
| --- | --- |
| 면 | `bg-surface` `bg-canvas` `bg-gray-50` `bg-gray-100` `bg-primary-600` `bg-tinted-bg` `bg-success-100` `bg-warning-50` `bg-danger-50` `bg-notice-bg` `bg-toast` |
| 글씨 | `text-gray-900` `text-gray-600` `text-hint` `text-tinted-ink` `text-success-700` `text-warning-600` `text-danger-600` `text-on-primary` `text-inverse` |
| 선 | `border-gray-200` `border-gray-300` `border-tinted-border` `border-success-200` `border-danger-200` `border-notice-border` |
| 글자 크기 | `text-heading1` `text-heading2` `text-heading3` `text-subtitle1` `text-subtitle2` `text-body2` `text-body3` `text-body4` `text-body5` |
| 간격 | `p-*` `px-*` `gap-*` 등에 `025 050 075 100 125 150 175 200 225 250 300 400 500 600 700 800` (이름은 px의 절반이 아니라 rem×100이다: `150` = 12px) |
| 라디우스 | `rounded-100`(4) `200`(6) `300`(8) `400`(10) `500`(12) `600`(14) `700`(16) `800`(20) `rounded-full` |

유틸리티가 없는 값은 인라인 `style`에 역할 토큰을 쓴다: `style={{ background: "var(--rc-color-bg-canvas-raised)" }}`. 토큰은 프리미티브(`--rc-color-gray-050`)와 역할(`--rc-color-bg-*`, `--rc-color-fg-*`, `--rc-color-border-*`, `--rc-size-*`, `--rc-radius-*`, `--rc-z-*`) 두 층이고, **화면 코드는 역할 토큰만** 읽는다.

배치는 직접 그리지 말고 `VStack` · `HStack` · `Grid`에 `gap` 토큰을 준다. 글씨는 `Text`의 `typography` · `foreground`를 쓰고, 상태 태그는 `Badge colorPalette`를 쓴다.

## 색과 모양을 고르는 축

`variant`는 **모양**(`solid` · `outline` · `tinted` · `ghost`), `colorPalette`는 **색**(`primary` · `success` · `danger` · `warning` · `gray` · `discord`)이다. 기본은 solid·tinted가 `primary`, outline·ghost가 `gray`. 되돌릴 수 없는 확정은 `variant="solid" colorPalette="danger"`, 삭제 입구는 `variant="outline" colorPalette="danger"`.

## 어디를 읽어야 하나

- `styles.css`와 그 `@import` 대상(`_ds_bundle.css`, `fonts/fonts.css`) — 실제 토큰 값과 다크 정의가 여기 있다.
- `components/<그룹>/<이름>/<이름>.prompt.md` — 컴포넌트별 props와 예제.
- `components/<그룹>/<이름>/<이름>.d.ts` — 타입 계약.

## 조립 예

```tsx
<Card.Root padding="md">
  <Card.Header>
    <Text typography="heading3">달빛 여관의 실종자</Text>
    <Badge colorPalette="primary">모집 중</Badge>
  </Card.Header>
  <Card.Body>
    <VStack gap="075">
      <Text typography="body4" foreground="muted">CoC 7판 · 4시간 예정</Text>
      <Text typography="body4" foreground="hint">정원 4명 중 3명 신청</Text>
    </VStack>
  </Card.Body>
  <Card.Footer>
    <Button className="w-full">참가 신청하기</Button>
  </Card.Footer>
</Card.Root>
```

터치 대상은 44px 아래로 내리지 않는다(`Button` md=40, lg=48, 세그먼트·탭 칸=44). 화면 높이는 `100vh`가 아니라 `dvh`를 쓰고, 바닥에 붙는 것은 `--rc-safe-bottom`을 더한다.
