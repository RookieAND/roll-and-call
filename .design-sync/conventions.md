# Nat20 디자인 시스템

모바일 우선(320–412px 한 칸) 한국어 ORPG 세션 앱을 만드는 키트다. 코드 이름은 Roll & Call(`@roll-and-call/ui`, `window.RollAndCallUI`)이다.

- 대상: 구인, 모집, 일정 조율, 확정, 후기 같은 세션 앱 화면
- 컴포넌트: 40개(버튼, 카드, 폼, 시트, 토스트 등)
- 테마: 라이트와 다크
- 글꼴: Pretendard
- 문구: 도메인 낱말을 쓴다. 구인, 모집 중, 대기 접수 중, 마감, GM, 참여자, 일정 조율, 확정, 추첨, 디스코드

## 시작하기

1. 페이지에 React를 먼저 불러온다.
2. `styles.css`를 불러온다. 폰트와 컴포넌트 CSS가 함께 들어온다.
3. `_ds_bundle.js`를 불러온다. 모든 컴포넌트가 `window.RollAndCallUI`에 올라온다.
4. 컴포넌트를 꺼내 쓴다. 프로바이더는 필요 없다.

```tsx
const { Card, Text, Badge, Button, VStack } = window.RollAndCallUI;
```

## 테마

- 켜는 법: `data-theme` 속성을 쓴다.
- 페이지 전체: `<html data-theme="dark">`
- 일부만: 그 상자에 `data-theme="dark"`
- 속성이 없으면 라이트다.
- `.dark` 클래스는 쓰지 않는다.

```tsx
<html lang="ko" data-theme="dark">
  <body className="bg-canvas font-sans text-gray-900">…</body>
</html>
```

## 스타일 쓰는 법

클래스는 Tailwind 모양이지만 **이 키트가 정한 이름만** 컴파일돼 있다. `bg-blue-500`, `p-4`, `rounded-lg` 같은 기본 이름은 오류 없이 무시된다.

면(배경)

- `bg-canvas`: 페이지 바탕
- `bg-surface`: 카드·시트의 표면
- `bg-gray-50`: 카드 안 구획, hover 배경
- `bg-gray-100`: 보조 면
- `bg-tinted-bg`: 연한 강조 면
- `bg-success-100` `bg-warning-50` `bg-warning-weakest` `bg-danger-50`: 상태 면
- `bg-primary-600` `bg-success-solid` `bg-warning-solid` `bg-danger-solid`: 진한 단색 면
- `bg-toast` `bg-disabled`

글씨 색

- `text-gray-900`: 본문
- `text-gray-600`: 보조 문구
- `text-label`: 라벨, 버튼, 메뉴 글씨
- `text-hint`: 힌트, 자리 표시
- `text-disabled`: 비활성
- `text-tinted-ink`: 강조 글씨
- `text-success-700` `text-warning-600` `text-danger-600`: 상태 글씨
- `text-on-primary` `text-on-solid`: 진한 단색 면 위 글씨. 단색 면이 `success` `warning` `danger`면 `text-on-solid`를 쓴다.
- `text-inverse`

선

- `border-gray-200`: 일반 구분선, 카드 테두리
- `border-gray-300`: 강한 구분선
- `border-input`: 입력칸·체크박스·라디오 테두리
- `border-tinted-border` `border-success-200` `border-warning-border` `border-danger-200`

그림자

- `shadow-popup`: 팝오버, 셀렉트
- `shadow-sheet`: 바닥 시트, 플로팅 바
- `shadow-modal`: 다이얼로그

글자 크기

- 제목: `text-heading1`(22) `text-heading2`(18) `text-heading3`(16)
- 부제: `text-subtitle1`(14) `text-subtitle2`(13)
- 본문: `text-body2`(14) `text-body3`(13) `text-body4`(12, 기준) `text-body5`(10)
- 큰 숫자: `Text typography="metric"`(32)
- 굵기는 `Text weight`로 따로 고른다.

간격

- `p-*` `px-*` `gap-*` 같은 곳에 `025 050 075 100 125 150 175 200 225 250 300 400 500 600 700 800`을 쓴다.
- 이름은 px의 절반이 아니라 rem×100이다. `150`은 12px이다.

라디우스

- `rounded-100`(4) `200`(6) `300`(8) `400`(10) `500`(12) `600`(14) `700`(16) `800`(20) `rounded-full`

## 토큰

토큰은 두 층이다.

1. 프리미티브: 값 그대로의 색 단계다. 예: `--rc-color-gray-050`
2. 역할: 쓰임새 이름이다. **화면 코드는 역할 토큰만 읽는다.**
   - 색: `--rc-color-bg-*`(면) `--rc-color-fg-*`(글씨) `--rc-color-border-*`(선)
   - 그 밖: `--rc-size-*` `--rc-radius-*` `--rc-z-*`

유틸리티가 없는 값은 인라인 `style`에 역할 토큰을 쓴다.

```tsx
<div style={{ background: "var(--rc-color-bg-canvas-raised)" }} />
```

## 컴포넌트 고르는 법

- 배치: 직접 그리지 말고 `VStack` `HStack` `Grid`에 `gap` 토큰을 준다.
- 글씨: `Text`의 `typography`와 `foreground`를 쓴다.
- 상태 표시: `Badge colorPalette`를 쓴다.
- `variant`는 모양이다: `solid` `outline` `tinted` `ghost`
- `colorPalette`는 색이다: `primary` `success` `danger` `warning` `gray` `discord`
- 기본값: solid와 tinted는 `primary`, outline과 ghost는 `gray`
- 되돌릴 수 없는 확정: `variant="solid" colorPalette="danger"`
- 삭제로 들어가는 입구: `variant="outline" colorPalette="danger"`

## 에셋

- `assets/Logo`: 로고 한 쌍(라이트, 다크)
- `assets/EmptyStates`: 빈 상태 일러스트 16종, 각각 라이트·다크 한 쌍
- 코드에서는 `<UiImage name="empty-party" />`나 `EmptyState`의 `image`로 쓴다. 테마에 맞는 파일이 자동으로 골라진다.
- 크기는 한 화면을 채울 때 140px, 구역 안에서는 104px이다.
- 장식이므로 `alt=""`로 둔다. 제목이 같은 말을 한다.
- 색을 바꾸거나 다시 그리지 않는다.

## 지킬 것

- 터치 대상은 44px보다 작게 하지 않는다. `Button`은 md=40, lg=48이고 세그먼트·탭 칸은 44다.
- 화면 높이는 `100vh`가 아니라 `dvh`를 쓴다.
- 화면 바닥에 붙는 것은 `--rc-safe-bottom`을 더한다.
- 입력칸 테두리는 `border-input`을 쓴다. 대비가 3:1 이상으로 맞춰져 있다.
- 임의 값(`shadow-[...]`, `text-[13px]`, `rounded-[10px]`)을 새로 쓰지 않는다.

## 어디를 읽나

1. `styles.css`와 그 안에서 불러오는 `_ds_bundle.css`, `fonts/fonts.css`: 실제 토큰 값과 다크 정의
2. `components/<이름>/README.md`: 컴포넌트별 props와 예제
3. `components/<그룹>/<이름>/<이름>.d.ts`: 타입

## 조립 예

```tsx
<Card.Root padding="md">
  <Card.Header>
    <Text typography="heading3">달빛 여관의 실종자</Text>
    <Badge colorPalette="primary">모집 중</Badge>
  </Card.Header>
  <Card.Body>
    <VStack gap="075">
      <Text typography="body4" foreground="muted">
        CoC 7판 · 4시간 예정
      </Text>
      <Text typography="body4" foreground="hint">
        정원 4명 중 3명 신청
      </Text>
    </VStack>
  </Card.Body>
  <Card.Footer>
    <Button className="w-full">참가 신청하기</Button>
  </Card.Footer>
</Card.Root>
```
