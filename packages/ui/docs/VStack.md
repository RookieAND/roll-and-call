---
category: Layout
---

## Props

공통 props(className·style·render·ref)를 받는다. 기본 태그는 `<div>`이고 `flex-col`이다. `direction`은 고정이라 받지 않는다. 기본 간격은 없고, 간격은 `gap`으로만 준다.

```ts
interface VStackProps {
  align?: "start" | "center" | "end" | "stretch" | "baseline"; // align-items
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"; // justify-content
  gap?: GapToken; // 0 · "025" · "050" · "075" · "100" · "125" · "150" · "175" · "200" · "225" · "250" · "300" · "400" · "500" · "600" · "700" · "800"
  wrap?: boolean; // flex-wrap
  inline?: boolean; // inline-flex
}
```

## 언제 쓰나

제목·본문·버튼처럼 위아래로 쌓이는 요소를 한 묶음으로 배치할 때 쓴다. 카드 안쪽 구성에 가장 많이 쓴다.

## 쓰지 않을 때

한 줄로 나란히 놓을 때는 `HStack`을 쓴다. 행과 열을 함께 맞춰야 하면 `Grid`를 쓴다. 간격이 필요 없는 단순한 블록이면 `div`로 충분하다.

## 함께 쓰는 것

`Card.Body` 안에서 `Text`들을 묶는다. 옆에 `Button`을 둘 때는 `HStack`으로 한 번 더 감싼다.

## 예제

```tsx
<VStack gap="050">
  <Text typography="subtitle1" weight="bold">
    크툴루의 부름 단편
  </Text>
  <Text typography="body4" foreground="muted">
    GM 달빛 · 초심자 환영
  </Text>
</VStack>
```

```tsx
<VStack gap="100" align="start">
  <Badge colorPalette="primary">모집 중</Badge>
  <Text typography="body4" foreground="muted">
    정원 4/6 · 토요일 오후 2시
  </Text>
</VStack>
```

## data-* · 접근성

`data-slot="v-stack"`. `VStack`은 역할(role)을 주지 않는 레이아웃이라 접근성 속성은 없다. 목록 의미가 필요하면 `render`로 `<ul>`을 넘기고 자식을 `<li>`로 바꾼다.
