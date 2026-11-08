---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12; // 열 수. 생략하면 열 수 클래스가 붙지 않는다
  gap?: GapToken; // 토큰 이름 문자열. 예: "100" → gap-100 (0은 숫자 0)
}
```

## 언제 쓰나

같은 크기의 타일이나 카드를 열을 맞춰 여러 줄로 나열할 때 쓴다. 예: 스탯 타일 3열, 아이콘 메뉴 2열.

## 쓰지 않을 때

한 줄로만 나열하면 `HStack`을 쓴다. 행마다 비교할 항목이 있는 촘촘한 데이터는 `Table`을 쓴다.

## 함께 쓰는 것

`Card.Root`나 타일 요소를 자식으로 넣는다. 열 너비가 자식 내용에 따라 달라야 하면 `className`으로 `grid-cols-[...]`를 직접 지정한다.

## 예제

```tsx
<Grid cols={3} gap="075">
  <Card.Root padding="sm">
    <Text typography="body4" foreground="hint">
      참여 횟수
    </Text>
    <Text typography="heading3" weight="extrabold">
      12
    </Text>
  </Card.Root>
  <Card.Root padding="sm">
    <Text typography="body4" foreground="hint">
      GM 경력
    </Text>
    <Text typography="heading3" weight="extrabold">
      3
    </Text>
  </Card.Root>
  <Card.Root padding="sm">
    <Text typography="body4" foreground="hint">
      구인 글
    </Text>
    <Text typography="heading3" weight="extrabold">
      5
    </Text>
  </Card.Root>
</Grid>
```

```tsx
<Grid cols={2} gap="100">
  <Button variant="outline" colorPalette="primary">
    구인 글 보기
  </Button>
  <Button variant="outline" colorPalette="primary">
    참여 내역 보기
  </Button>
</Grid>
```

## data-* · 접근성

`data-slot="grid"`. 기본 태그는 `<div>`다.
