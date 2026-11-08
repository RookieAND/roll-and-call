---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `Container`는 `size` 외에 고유 prop이 없다.

```ts
Container: {
  size?: "sm" | "md" | "lg" | "xl" | "full"; // 기본 lg. 가로 최대 폭: sm=2xl(672px), md=4xl(896px), lg=6xl(1152px), xl=7xl(1280px), full=제한 없음
}
```

가운데 정렬(`mx-auto`)과 좌우 여백(`px-200`)은 항상 들어간다.

## 언제 쓰나

페이지 본문을 가로 최대 폭 안에 가운데로 모을 때 쓴다. 구인 목록, 구인 상세처럼 전체 화면을 쓰는 페이지의 가장 바깥 감싸개로 둔다.

## 쓰지 않을 때

카드 하나나 모달 안의 내용을 묶을 때는 `Card`나 `Dialog.Body`를 쓴다. 가로 칸을 나눠야 하면 `Grid`나 `HStack`을 쓴다. 폭 제한이 필요 없는 바깥 배경에는 굳이 감싸지 않는다.

## 함께 쓰는 것

페이지 최상위에서 `Container`로 감싸고 그 안에서 `VStack`으로 섹션을 세운다. 목록 칸은 `Grid`를 쓴다.

## 예제

```tsx
<Container size="md">
  <VStack gap="150">
    <Text typography="heading3" weight="extrabold">
      내 구인 글
    </Text>
    <Card.Root>
      <Card.Body>
        <Text typography="body4" foreground="muted">
          모집 중 2건 · 확정 1건
        </Text>
      </Card.Body>
    </Card.Root>
  </VStack>
</Container>
```

```tsx
<Container size="full">
  <Grid>{/* 구인 카드 목록 */}</Grid>
</Container>
```

## data-* · 접근성

`data-slot="container"`(`div`). 상태 속성은 따로 없다. 그냥 배치를 맡는 래퍼이므로 시맨틱 역할이 없다. 제목이나 `main` 같은 의미는 안쪽 요소가 맡는다.
