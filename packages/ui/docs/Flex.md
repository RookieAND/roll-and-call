---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface FlexProps {
  direction?: "row" | "column"; // 기본 row. column이면 data-slot이 v-stack이 된다
  align?: "start" | "center" | "end" | "stretch" | "baseline"; // align-items
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"; // justify-content
  gap?: GapToken; // 토큰 이름 문자열. 예: "100" → gap-100 (0은 숫자 0)
  wrap?: boolean; // 기본 false. true면 flex-wrap
  inline?: boolean; // 기본 false. true면 inline-flex
}
```

## 언제 쓰나

방향을 props로 골라야 하는 범용 가로·세로 배치에 쓴다. 방향이 고정된 자리는 `HStack`·`VStack`을 쓴다.

## 쓰지 않을 때

한 줄 또는 한 열로 쌓기만 하면 `HStack`·`VStack`이 더 짧다. 같은 크기 항목을 열 맞춰 배치하면 `Grid`를 쓴다.

## 함께 쓰는 것

`Text`·`Badge`·`Button`을 한 줄에 맞출 때 쓴다. 자식 간격은 `gap`으로 주고, 자식에 margin을 따로 주지 않는다.

## 예제

```tsx
<Flex direction="row" align="center" justify="between">
  <Text typography="body3" weight="medium">
    모집 중인 세션
  </Text>
  <Badge colorPalette="primary">모집 중</Badge>
</Flex>
```

```tsx
<Flex direction="column" gap="075" wrap>
  <Text typography="body4" foreground="muted">
    GM 달빛 · 초심자 환영
  </Text>
  <Text typography="body4" foreground="muted">
    정원 4/6 · 토요일 오후 2시
  </Text>
</Flex>
```

## data-* · 접근성

`data-slot`: `direction`이 `row`면 `h-stack`, `column`이면 `v-stack`. 기본 태그는 `<div>`다.
