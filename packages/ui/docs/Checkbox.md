---
category: Forms
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. 아래는 각 부품의 고유 prop이며, `Root`·`Indicator`는 Base UI 부품을 그대로 감싼다.

```ts
Checkbox.Root: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, eventDetails) => void;
  indeterminate?: boolean; // 일부만 선택된 상태. 체크 표시 대신 가로 줄을 보여준다
  parent?: boolean; // 하위 체크박스들을 묶는 상위 체크박스로 쓴다
  name?: string;
  value?: string;
  // 그 외 Base UI Checkbox.Root props를 그대로 받는다
}

Checkbox.Indicator // Base UI Checkbox.Indicator 그대로. 체크 또는 줄 아이콘은 상태에 따라 자동으로 고른다

Checkbox.Label: {
  children: ReactNode; // 필수. 상자 옆 글씨
  className?: string;
}

Checkbox.Field: {
  children: ReactNode; // 필수. Root·Indicator·Label을 감싸는 label 영역
  className?: string;
}

CheckboxGroup.Root // Base UI CheckboxGroup.Root 그대로 (value·onValueChange 등)
```

## 언제 쓰나

여러 항목 중 여러 개를 고를 때, 또는 "동의합니다" 같은 참·거짓 하나를 받을 때 쓴다. 여러 체크박스를 묶어 하나의 값 목록으로 다룰 때는 `CheckboxGroup`으로 감싼다.

## 쓰지 않을 때

하나만 고르는 선택지는 `Radio`를 쓴다. 켜고 끄는 설정처럼 즉시 반영되는 값은 `Switch`가 더 맞다. 항목이 많아 검색이나 필터가 필요하면 `Select`나 `Chip` 목록을 쓴다.

## 함께 쓰는 것

`CheckboxGroup.Root`로 감싼 안에 `Checkbox.Field` 한 줄씩 `Checkbox.Root`(+ `Checkbox.Indicator`)와 `Checkbox.Label`을 둔다. 필드 전체가 label이라 글씨를 눌러도 체크된다. 전체 선택은 `parent`를 가진 상위 체크박스로 만든다.

## 예제

```tsx
<CheckboxGroup.Root
  value={selectedKinds}
  onValueChange={setSelectedKinds}
  aria-label="알림 받을 종류"
>
  <VStack gap="050">
    <Checkbox.Field>
      <Checkbox.Root name="kind" value="recruit">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Checkbox.Label>구인 모집 알림</Checkbox.Label>
    </Checkbox.Field>
    <Checkbox.Field>
      <Checkbox.Root name="kind" value="session">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <Checkbox.Label>세션 시작 전날 알림</Checkbox.Label>
    </Checkbox.Field>
  </VStack>
</CheckboxGroup.Root>
```

```tsx
<Checkbox.Field>
  <Checkbox.Root name="agreeRules">
    <Checkbox.Indicator />
  </Checkbox.Root>
  <Checkbox.Label>구인 규칙을 읽고 동의합니다</Checkbox.Label>
</Checkbox.Field>
```

## data-* · 접근성

`data-slot`: `checkbox`(Root) · `checkbox-indicator` · `checkbox-label` · `checkbox-field`. Root의 상태 표시는 Base UI가 붙이는 `data-checked`·`data-indeterminate`·`data-disabled`로 한다. `CheckboxGroup.Root`에는 이 프로젝트가 붙이는 `data-slot`이 없다.

Root는 `focus-visible`에 링이 보인다. 상자 전체가 `label`인 `Checkbox.Field`를 쓰면 글씨를 눌러도 같은 체크박스가 토글된다. 이름은 `Checkbox.Label`에서 오므로 상자만 두지 말고 라벨을 꼭 붙인다.
