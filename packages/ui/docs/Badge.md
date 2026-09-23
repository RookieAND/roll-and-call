---
category: Display
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface BadgeProps {
  colorPalette?: "primary" | "success" | "danger" | "warning" | "gray" | "discord"; // 기본 gray
}
```

## 언제 쓰나

모집 중, 대기 접수 중, 마감, 확정처럼 누를 수 없는 상태를 짧은 텍스트 라벨로 보여줄 때 쓴다.

## 쓰지 않을 때

누를 수 있어야 하는 필터·태그는 `Chip`을 쓴다. 문단 수준의 안내·경고는 `Callout`을 쓴다.

## 함께 쓰는 것

`Card.Header`에서 제목 옆 상태 표시로, `Table.Cell`에서 상태 열 값으로 자주 함께 쓴다.

## 예제

```tsx
<HStack gap="100">
  <Badge colorPalette="primary">모집 중</Badge>
  <Badge colorPalette="success">대기 접수 중</Badge>
  <Badge colorPalette="warning">마감 임박</Badge>
  <Badge>마감</Badge>
</HStack>
```

```tsx
<Card.Header>
  <Text typography="subtitle1" weight="bold">
    크툴루의 부름 단편
  </Text>
  <Badge colorPalette="primary">모집 중</Badge>
</Card.Header>
```

```tsx
<Table.Cell>
  <Badge colorPalette="success">확정</Badge>
</Table.Cell>
```

## data-* · 접근성

`data-slot="badge"`, `data-color-palette`(항상 존재).

기본 태그는 `<span>`이라 클릭·포커스 동작이 없다. 색만으로 상태를 구분하지 않도록 라벨 텍스트를 항상 함께 넣는다.
