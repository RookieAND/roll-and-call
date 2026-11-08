---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `Flex`의 props에서 `direction`만 빠지고 `row`로 고정된다.

```ts
interface StackProps {
  align?: "start" | "center" | "end" | "stretch" | "baseline"; // align-items
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"; // justify-content
  gap?: GapToken; // 토큰 이름 문자열. 예: "100" → gap-100 (0은 숫자 0)
  wrap?: boolean; // 기본 false. true면 flex-wrap
  inline?: boolean; // 기본 false. true면 inline-flex
}
```

## 언제 쓰나

버튼 묶음, 아바타와 이름, 제목과 배지처럼 항목을 가로 한 줄로 나란히 둘 때 쓴다.

## 쓰지 않을 때

줄이 넘칠 수 있는 여러 행의 카드 목록은 `Grid`를 쓴다. 방향을 나중에 바꿔야 하면 `Flex`를 쓴다.

## 함께 쓰는 것

`Card.Footer` 안의 주 액션·보조 액션 묶음, `Card.Header` 안의 제목·배지 줄에 흔히 쓴다. 세로 쌓기는 `VStack`을 쓴다.

## 예제

```tsx
<HStack gap="100">
  <Button variant="solid" colorPalette="primary">
    구인 등록
  </Button>
  <Button variant="outline" colorPalette="primary">
    임시 저장
  </Button>
</HStack>
```

```tsx
<HStack align="center" justify="between">
  <HStack align="center" gap="100">
    <Avatar name="새벽" size="sm" />
    <Text typography="body3" weight="medium">
      새벽
    </Text>
  </HStack>
  <Badge colorPalette="success">확정</Badge>
</HStack>
```

## data-* · 접근성

`data-slot="h-stack"`. 기본 태그는 `<div>`다.
