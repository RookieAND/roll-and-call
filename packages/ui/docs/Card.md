---
category: Layout
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `Header`·`Body`·`Footer`는 그 외 고유 prop이 없다.

```ts
Card.Root: {
  radius?: 400 | 500 | 600; // 기본 600. 카드·프레임은 600, 시트 안 상자는 500
  background?: "surface" | "subtle" | "none"; // 기본 surface
  padding?: "none" | "sm" | "md" | "lg"; // 기본 md
  interactive?: boolean; // 기본 false. hover 배경만 준다
}

Card.Header  // 고유 prop 없음
Card.Body    // 고유 prop 없음
Card.Footer  // 고유 prop 없음
```

## 언제 쓰나

구인 글, 세션 요약처럼 관련 정보를 박스 하나로 묶어 보여줄 때 쓴다.

## 쓰지 않을 때

여러 행을 열 맞춰 촘촘히 비교해야 하면 `Table`을 쓴다. 박스 없이 텍스트만 나열하면 되는 자리는 `VStack`/`HStack`으로 충분하다.

## 함께 쓰는 것

`Card.Root` 안에 `Card.Header`(제목 + `Badge`) · `Card.Body`(본문) · `Card.Footer`(`Button`들)를 필요한 만큼만 넣는다. 셋 다 넣어야 하는 건 아니며, 짧은 요약 카드는 자식을 바로 넣기도 한다.

## 예제

```tsx
<Card.Root>
  <Card.Header>
    <VStack gap="050">
      <Text typography="subtitle1" weight="bold">
        크툴루의 부름 단편
      </Text>
      <Text typography="body4" foreground="muted">
        GM 달빛 · 초심자 환영
      </Text>
    </VStack>
    <Badge colorPalette="primary">모집 중</Badge>
  </Card.Header>
  <Card.Body>
    <Text typography="body4" foreground="muted">
      정원 4/6 · 토요일 오후 2시
    </Text>
  </Card.Body>
  <Card.Footer>
    <Button colorPalette="primary">신청하기</Button>
    <Button variant="outline">자세히 보기</Button>
  </Card.Footer>
</Card.Root>
```

```tsx
<Card.Root background="subtle" radius={500} padding="lg">
  <VStack gap="075">
    <Text typography="body4" foreground="hint">
      다음 세션
    </Text>
    <Text typography="heading3" weight="extrabold">
      디아스포라 3화 — 궤도 위의 그림자
    </Text>
    <Text typography="body3" foreground="muted">
      확정 · 9월 27일 토요일 오후 7시
    </Text>
  </VStack>
</Card.Root>
```

```tsx
<Card.Root interactive padding="sm">
  <HStack align="center" justify="between">
    <HStack align="center" gap="100">
      <Avatar name="새벽" size="sm" />
      <Text typography="body3" weight="medium">
        새벽
      </Text>
    </HStack>
    <Badge colorPalette="success">확정</Badge>
  </HStack>
</Card.Root>
```

## data-* · 접근성

`data-slot`: `card`(Root) · `card-header` · `card-body` · `card-footer`.

Root 상태 속성: `data-radius` · `data-background` · `data-padding`(항상 존재) · `data-interactive`(interactive일 때만). 기본 태그는 `<div>`이며 `interactive`는 hover 배경만 줄 뿐 role·tabIndex·키보드 핸들러를 붙이지 않는다. 카드 전체를 누르는 대상으로 쓰려면 `onClick`·`tabIndex`·적절한 `role`을 직접 추가해야 한다.
