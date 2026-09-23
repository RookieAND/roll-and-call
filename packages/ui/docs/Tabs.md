---
category: Selection
---

## Props

모든 하위 컴포넌트는 `ref`·`className`을 받는다(상태 기반 함수형 `className` 포함). 아래는 그 외 고유 prop이다.

```ts
Tabs.Root: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  // Base UI Tabs.Root 그대로(orientation 등 포함)
}

Tabs.List: {
  variant?: "line" | "solid"; // 기본 line
  scrollable?: boolean; // 기본 true. 넘치면 가로 스크롤 + 양끝 페이드
  "aria-label": string;
}

Tabs.Trigger: {
  value: string;
  // Base UI Tabs.Tab 그대로
}

Tabs.Indicator   // Base UI Tabs.Indicator 그대로. variant="line"에서만 보인다
Tabs.Panel: {
  value: string;
  // Base UI Tabs.Panel 그대로
}
```

## 언제 쓰나

탭마다 다른 콘텐츠(공지·참여자·일정 조율처럼 성격이 다른 패널)를 갈아끼울 때 쓴다. 칸이 5개를 넘어도 콘텐츠를 바꾸는 자리라면 Tabs를 쓴다.

## 쓰지 않을 때

같은 목록을 조건으로 거르기만 하는 자리(전체/모집 중/마감처럼 필터)는 `SegmentedControl`을 쓴다.

## 함께 쓰는 것

`Tabs.Root` 안에 `Tabs.List`(+ `variant="line"`일 때만 `Tabs.Indicator`) · `value`가 일치하는 `Tabs.Trigger`들 · 각 `Tabs.Panel`을 둔다. `Tabs.List`에는 `aria-label`을 반드시 준다.

## 예제

```tsx
<Tabs.Root defaultValue="notice">
  <Tabs.List aria-label="게임 상세 탭">
    <Tabs.Trigger value="notice">공지</Tabs.Trigger>
    <Tabs.Trigger value="participants">참여자</Tabs.Trigger>
    <Tabs.Trigger value="schedule">일정 조율</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="notice">모집 마감까지 2일 남았습니다.</Tabs.Panel>
  <Tabs.Panel value="participants">참여자 4명이 확정되었습니다.</Tabs.Panel>
  <Tabs.Panel value="schedule">일정 조율이 진행 중입니다.</Tabs.Panel>
</Tabs.Root>
```

```tsx
<Tabs.Root defaultValue="waiting">
  <Tabs.List variant="solid" scrollable={false} aria-label="참여 상태 탭">
    <Tabs.Trigger value="confirmed">확정</Tabs.Trigger>
    <Tabs.Trigger value="waiting">대기</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="confirmed">확정된 참여자 목록입니다.</Tabs.Panel>
  <Tabs.Panel value="waiting">대기 중인 참여자 목록입니다.</Tabs.Panel>
</Tabs.Root>
```

## data-* · 접근성

`data-slot`: `tabs-list`(+`data-variant`) · `tabs-trigger`(Base UI가 `data-selected` 부여) · `tabs-indicator` · `tabs-panel`.

`Tabs.List`는 `role="tablist"`, `Tabs.Trigger`는 `role="tab"`(Base UI 기본). ←→로 탭 사이를 이동하며 포커스를 따라 즉시 선택된다. `Tabs.Panel`은 내용이 길어 스크롤될 수 있어 `tabIndex={0}`으로 패널 자체가 포커스를 받는다.
