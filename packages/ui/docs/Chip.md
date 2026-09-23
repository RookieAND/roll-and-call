---
category: Actions
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface ChipProps {
  shape?: "block" | "pill"; // 기본 pill
  tone?: "outline" | "notice" | "interactive" | "neutral"; // 기본 interactive
  selected?: boolean; // 기본 false
}
```

## 언제 쓰나

필터, 태그, 참석 여부처럼 누를 수 있는 작은 선택 요소에 쓴다. 항상 `<button>`으로 렌더된다.

## 쓰지 않을 때

누를 수 없는 순수 상태 딱지(모집 중, 마감 등)는 `Badge`를 쓴다. 값 하나만 고르는 필터 그룹이 폭 전체를 채워야 하면 `SegmentedControl`이 더 맞는다.

## 함께 쓰는 것

여러 개를 `HStack`에 나열해 필터·태그 목록을 만든다. `shape="block"`은 폭을 부모가 정하는 참석/불참 같은 2분할 자리에 쓴다.

## 예제

```tsx
<HStack gap="075" className="flex-wrap">
  <Chip tone="interactive">전체</Chip>
  <Chip tone="neutral">모집 중</Chip>
  <Chip tone="outline">대기 접수 중</Chip>
  <Chip tone="notice">마감 임박</Chip>
</HStack>
```

```tsx
<HStack gap="075">
  <Chip selected>참여 확정</Chip>
  <Chip>추첨 대기</Chip>
  <Chip selected>디스코드</Chip>
</HStack>
```

```tsx
<HStack gap="075" className="w-80">
  <Chip shape="block" selected>
    참석
  </Chip>
  <Chip shape="block">불참</Chip>
</HStack>
```

## data-* · 접근성

`data-slot="chip"`. 상태 속성: `data-shape` · `data-tone` · `data-selected`(선택됐을 때만) · `data-disabled`(비활성일 때만).

네이티브 `<button type="button">`이라 `disabled`가 켜지면 클릭·키보드 포커스가 자동으로 막힌다. `focus-visible` 시 링이 보인다.
