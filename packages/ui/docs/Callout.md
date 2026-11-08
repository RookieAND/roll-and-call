---
category: Display
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `Icon`·`Title`·`Description`·`Action`은 `children`과 `className`만 받는다.

```ts
Callout.Root: {
  variant?: "tinted" | "outline"; // 기본 tinted(옅은 채움). outline은 배경을 비우고 테두리만 둔다
  colorPalette?: "gray" | "primary" | "success" | "warning" | "notice" | "danger"; // 기본 gray
  size?: "sm" | "md"; // 기본 md. sm은 패딩과 제목 글자를 줄인다
  // 그 외 div props 그대로. className·style은 상태 기반 함수형도 된다
}

Callout.Icon: {
  children?: ReactNode; // 생략하면 팔레트별 기본 아이콘을 쓴다
  className?: string;
}
Callout.Title: {
  children: ReactNode; // 필수. size에 따라 글자 크기가 달라진다
  className?: string;
}
Callout.Description: {
  children: ReactNode; // 필수
  className?: string;
}
Callout.Action: {
  children: ReactNode; // 보통 Button 하나. 오른쪽 열에 세로 가운데로 놓인다
  className?: string;
}
```

## 언제 쓰나

구인 글 편집 화면이나 상세 화면에서 사용자가 알아야 할 상태를 본문 위에 한 번 알릴 때 쓴다. 예를 들어 판본이 아직 구인 룰로 고를 수 없다거나, 참여가 확정됐다는 안내다.

## 쓰지 않을 때

짧은 필드 오류는 Field의 error로 보여준다. 일시적으로 떴다 사라지는 결과 알림은 Toast를 쓴다. 제목 없이 한 줄 안내만 필요하면 `Text`로 충분하다.

## 함께 쓰는 것

`Callout.Icon`(생략 가능) · `Callout.Title`(생략 가능) · `Callout.Description` 순서로 두고, 행동이 필요하면 `Callout.Action`에 `Button`을 넣는다. `Title`을 넣으면 `Description`은 자동으로 조금 내려가 제목과 구분된다.

## 예제

```tsx
<Callout.Root colorPalette="warning">
  <Callout.Icon />
  <Callout.Description>
    크툴루의 부름 2판은 아직 구인 룰로 고를 수 없습니다.
    <br />
    기본 룰북을 먼저 추가해 주세요.
  </Callout.Description>
</Callout.Root>
```

```tsx
<Callout.Root colorPalette="success" variant="outline">
  <Callout.Icon />
  <Callout.Title>참여가 확정됐어요</Callout.Title>
  <Callout.Description>9월 27일 토요일 오후 7시 세션에 자리가 잡혔습니다.</Callout.Description>
  <Callout.Action>
    <Button size="sm" variant="outline" colorPalette="success">
      일정 보기
    </Button>
  </Callout.Action>
</Callout.Root>
```

```tsx
<Callout.Root colorPalette="danger" size="sm">
  <Callout.Icon />
  <Callout.Description>모집이 마감돼 더는 신청할 수 없습니다.</Callout.Description>
</Callout.Root>
```

## data-* · 접근성

`data-slot`: `callout`(Root) · `callout-icon` · `callout-title` · `callout-description` · `callout-action`. Root에는 `data-color-palette`가 붙는다.

Root의 `role`은 자동으로 정해진다. `warning`·`danger`는 `role="alert"`로 나와 바로 읽히고, 나머지는 `role="note"`다. `Icon`은 `aria-hidden`이라 화면 낭독기가 읽지 않으므로, 색만으로 뜻을 전하지 않도록 팔레트별 기본 아이콘이 함께 나온다. 아이콘을 직접 넘기면 그 아이콘이 쓰인다.
