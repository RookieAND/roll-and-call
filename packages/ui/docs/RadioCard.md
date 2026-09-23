---
category: Selection
---

## Props

`Root`는 `ref`·`className`을 받는다(상태 기반 함수형 `className` 포함).

```ts
RadioCard.Root: {
  value: string; // BaseRadio.Root의 필수 prop
  indicator?: "radio" | "check" | "none"; // 기본 radio
  disabled?: boolean;
  // 그 외 Base UI Radio.Root를 그대로 받는다
}

RadioCard.Indicator: { className?: string }
RadioCard.Title: { className?: string; children: ReactNode }
RadioCard.Description: { className?: string; children: ReactNode }
RadioCard.Meta: { className?: string; children: ReactNode }
```

## 언제 쓰나

후보가 몇 개뿐이고 각각에 설명이나 부가 정보(정원, 신청 현황 등)가 붙을 때 쓴다. 모집 방식 고르기, 확정할 일정 고르기가 제자리다.

## 쓰지 않을 때

설명 없이 값만 고르면 `RadioGroup` + `Radio`를 쓴다. 같은 목록을 거르는 자리는 `RadioCard`가 아니라 `SegmentedControl`이다.

## 함께 쓰는 것

`RadioCard.Root`는 반드시 `RadioGroup`(Base UI, `name`·`value`/`defaultValue`·`aria-label` 필요) 안에서만 쓴다. `Root` 안에 `RadioCard.Title` · `RadioCard.Description`(선택) · `RadioCard.Indicator`(`indicator="none"`이 아니면) 또는 `RadioCard.Meta`(선택)를 둔다.

## 예제

```tsx
<RadioGroup name="recruit-method" defaultValue="lottery" aria-label="모집 방식">
  <RadioCard.Root value="first-come">
    <RadioCard.Title>선착순</RadioCard.Title>
    <RadioCard.Description>먼저 신청한 참여자부터 확정</RadioCard.Description>
    <RadioCard.Indicator />
  </RadioCard.Root>
  <RadioCard.Root value="lottery">
    <RadioCard.Title>추첨</RadioCard.Title>
    <RadioCard.Description>마감 후 무작위로 확정</RadioCard.Description>
    <RadioCard.Indicator />
  </RadioCard.Root>
  <RadioCard.Root value="gm-approval">
    <RadioCard.Title>GM 승인</RadioCard.Title>
    <RadioCard.Description>GM이 직접 참여자를 선택</RadioCard.Description>
    <RadioCard.Indicator />
  </RadioCard.Root>
</RadioGroup>
```

```tsx
<RadioGroup name="recruit-method-meta" defaultValue="first-come" aria-label="모집 방식">
  <RadioCard.Root value="first-come" indicator="none">
    <RadioCard.Title>선착순</RadioCard.Title>
    <RadioCard.Description>먼저 신청한 참여자부터 확정</RadioCard.Description>
    <RadioCard.Meta>정원 4명 중 4명 신청</RadioCard.Meta>
  </RadioCard.Root>
  <RadioCard.Root value="lottery" indicator="none">
    <RadioCard.Title>추첨</RadioCard.Title>
    <RadioCard.Description>마감 후 무작위로 확정</RadioCard.Description>
    <RadioCard.Meta>정원 4명 중 2명 신청</RadioCard.Meta>
  </RadioCard.Root>
</RadioGroup>
```

## data-* · 접근성

`data-slot`: `radio-card`(루트) · `radio-card-indicator` · `radio-card-title` · `radio-card-description` · `radio-card-meta`.

`Root`는 Base UI Radio가 붙이는 `data-checked`/`data-disabled`를 갖고, 고른 카드는 테두리·배경·표시가 함께 바뀐다(색 단독 의존 금지). 카드 전체가 라벨이자 히트 영역이다. `RadioGroup` 안에서 ↑↓/←→로 항목 간 이동, Space로 선택하는 네이티브 라디오 키보드 동작을 따른다.
