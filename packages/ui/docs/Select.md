---
category: Forms
---

## Props

Select는 복합 컴포넌트다. `Select.Root`가 값과 `items`를 쥐고, 나머지 파트는 그 안에서 조립한다. 공통 props(className·style·render·ref)는 `Trigger`·`Popup`·`Item`에서 쓴다.

```ts
Select.Root: {
  value?: string; // 제어 모드
  defaultValue?: string; // 비제어 모드. 나중에 바뀌면 드롭다운을 다시 마운트한다
  onValueChange?: (value: string) => void;
  items?: { label: string; value: string }[]; // Trigger가 선택값의 글자를 찾는 데 쓴다. 빠지면 값이 그대로 보인다
  name?: string;
  disabled?: boolean;
  children: ReactNode;
}

Select.Trigger: {
  placeholder?: string; // 기본 "선택". 값이 없을 때 흐리게 보인다
  icon?: ReactNode; // 기본 "▾"
  invalid?: boolean; // 기본 false
  id?: string;
  "aria-label"?: string;
  className?: StateClassName<BaseSelect.Trigger.State>;
  children?: ReactNode; // 있으면 기본 글자·아이콘 대신 이것을 그린다
}

Select.Popup: {
  className?: StateClassName<BaseSelect.Popup.State>;
  children: ReactNode;
} // Portal·Positioner를 알아서 감싼다. 기본 sideOffset 6

Select.Item: {
  value: string;
  disabled?: boolean;
  className?: StateClassName<BaseSelect.Item.State>;
  children: ReactNode;
} // 선택되면 오른쪽에 ✓가 붙는다

Select.Value · Select.Icon · Select.Group · Select.GroupLabel · Select.Separator
// Base UI 파트를 그대로 쓴다
```

## 언제 쓰나

항목이 여러 개인데 화면에 다 펼치기엔 긴 값을 하나 고를 때 쓴다. 예: 모집 상태, 정렬 기준.

## 쓰지 않을 때

항목이 2~3개로 적고 한눈에 비교해야 하면 `RadioGroup`이나 `SegmentedControl`을 쓴다. 여러 개를 동시에 고르는 자리는 `CheckboxGroup`이다.

## 함께 쓰는 것

`Field.Root`로 감싸 라벨과 에러를 붙이고, 라벨의 `htmlFor`는 `Select.Trigger`의 `id`와 맞춘다. 값을 실제로 쓰는 곳에서는 `onValueChange`로 받는다. `Select.Item`의 `value`와 `items`의 `value`는 같은 문자열이어야 Trigger에 글자가 뜬다.

## 예제

```tsx
<Select.Root
  defaultValue="recruiting"
  items={[
    { label: "모집 중", value: "recruiting" },
    { label: "모집 마감", value: "closed" },
  ]}
  onValueChange={(value) => setStatus(value)}
>
  <Select.Trigger placeholder="모집 상태" />
  <Select.Popup>
    <Select.Item value="recruiting">모집 중</Select.Item>
    <Select.Item value="closed">모집 마감</Select.Item>
  </Select.Popup>
</Select.Root>
```

```tsx
<Field.Root label="정렬" htmlFor="sort">
  <Select.Root
    defaultValue="latest"
    items={[
      { label: "최신순", value: "latest" },
      { label: "정원 많은 순", value: "capacity" },
    ]}
  >
    <Select.Trigger id="sort" invalid />
    <Select.Popup>
      <Select.Item value="latest">최신순</Select.Item>
      <Select.Item value="capacity">정원 많은 순</Select.Item>
    </Select.Popup>
  </Select.Root>
</Field.Root>
```

## data-* · 접근성

`data-slot`: `select-trigger` · `select-popup` · `select-item` · `select-item-indicator` · `select-icon`. Trigger에 `invalid`를 주면 `data-invalid`와 `aria-invalid`가 붙는다. Trigger는 `Field`의 설명·에러 id를 `aria-describedby`로 자동 연결한다.
