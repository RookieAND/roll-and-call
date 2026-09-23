---
category: Selection
---

## Props

```ts
SegmentedControl.Root: {
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  size?: "sm" | "md"; // 기본 md
  fullWidth?: boolean; // 기본 true
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

SegmentedControl.Item: {
  value: string;
  disabled?: boolean;
  colorPalette?: "gray" | "success" | "danger"; // 기본 gray. 답 자체가 뜻을 가질 때만 색을 준다
  "aria-label"?: string; // 아이콘만 둘 때는 무엇인지 읽어 줄 라벨을 준다
  className?: string;
  children: ReactNode;
}
```

## 언제 쓰나

같은 목록을 즉시 반영되는 조건으로 거를 때 쓴다(구인 상태 필터, 참석 여부 응답처럼 고르는 즉시 결과가 바뀌는 자리).

## 쓰지 않을 때

칸이 5개를 넘거나 선택에 따라 다른 콘텐츠(패널)를 갈아끼우면 `Tabs`를 쓴다.

## 함께 쓰는 것

`SegmentedControl.Root` 안에 `SegmentedControl.Item`들만 둔다. 다른 부분 없이 완결된 짝이다.

## 예제

```tsx
<SegmentedControl.Root value="open" onValueChange={setStatusFilter} aria-label="구인 상태">
  <SegmentedControl.Item value="all">전체</SegmentedControl.Item>
  <SegmentedControl.Item value="open">모집 중</SegmentedControl.Item>
  <SegmentedControl.Item value="waiting">대기 접수 중</SegmentedControl.Item>
  <SegmentedControl.Item value="closed">마감</SegmentedControl.Item>
</SegmentedControl.Root>
```

```tsx
<SegmentedControl.Root value={attendance} onValueChange={setAttendance} aria-label="참석 여부">
  <SegmentedControl.Item value="present" colorPalette="success">
    참석
  </SegmentedControl.Item>
  <SegmentedControl.Item value="absent" colorPalette="danger">
    불참
  </SegmentedControl.Item>
</SegmentedControl.Root>
```

```tsx
<SegmentedControl.Root value="present" onValueChange={() => {}} disabled aria-label="확정된 응답">
  <SegmentedControl.Item value="present" colorPalette="success">
    참석
  </SegmentedControl.Item>
  <SegmentedControl.Item value="absent" colorPalette="danger">
    불참
  </SegmentedControl.Item>
</SegmentedControl.Root>
```

## data-* · 접근성

`data-slot`: `segmented-control`(루트, +`data-size`) · `segmented-control-indicator`(선택된 칸을 따라가는 배경) · `segmented-control-item`(+`data-state="checked"|"unchecked"`).

루트는 `role="radiogroup"` + `aria-label`, 각 항목은 `role="radio"` + `aria-checked`다. 선택된 항목만 `tabIndex={0}`이고 나머지는 `-1`이라 탭 한 번으로 그룹에 들어온다. ←→로 옮기면 그 자리에서 바로 선택되고(roving focus) 포커스도 함께 이동한다. 비활성 항목은 건너뛴다.
