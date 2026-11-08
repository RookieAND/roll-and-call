---
category: Selection
---

## Props

`RadioGroup`은 `@base-ui-components/react/radio-group`을 그대로 다시 내보낸다. 이 패키지가 더하는 prop은 없고, 아래는 앱에서 쓰는 base-ui props다.

```ts
interface RadioGroupProps {
  value?: unknown; // 선택된 항목의 값. 앱에서 as로 좁혀 쓴다
  onValueChange?: (value: unknown) => void; // 선택이 바뀔 때 호출된다
  disabled?: boolean; // 묶음 전체를 막는다
  "aria-label"?: string; // 묶음의 이름. 눈에 보이는 제목이 있으면 aria-labelledby를 쓴다
  "aria-labelledby"?: string;
  className?: string;
  render?: ReactElement; // 기본 div 대신 다른 요소로 바꾼다
}
```

## 언제 쓰나

`Radio.Root`를 여러 개 묶어 값 하나를 고르게 할 때 쓴다. 항목은 `Radio.Root`가 `value`로 구분한다.

## 쓰지 않을 때

고르는 항목이 두 개 이하이고 화면에 항상 펼쳐 있으면 묶음 없이 `Radio.Root`를 직접 쓰기보다 이 묶음을 쓰는 편이 맞다. 여러 개를 동시에 고르면 `CheckboxGroup`을 쓴다.

## 함께 쓰는 것

`Radio.Field`를 자식으로 넣고, 묶음의 세로 간격은 `className`으로 준다. 제목은 `Text`를 두고 `aria-labelledby`로 연결한다.

## 예제

```tsx
<RadioGroup
  value={cert}
  onValueChange={(next) => setCert(next as string)}
  aria-label="인증 정책"
  className="grid grid-cols-2 gap-100"
>
  <Radio.Field>
    <Radio.Root value="required">
      <Radio.Indicator />
    </Radio.Root>
    <Radio.Label>인증 필요</Radio.Label>
  </Radio.Field>
  <Radio.Field>
    <Radio.Root value="optional">
      <Radio.Indicator />
    </Radio.Root>
    <Radio.Label>인증 없이 참여</Radio.Label>
  </Radio.Field>
</RadioGroup>
```

## data-* · 접근성

묶음은 base-ui가 `role="radiogroup"`을 준다. 이름은 `aria-label` 또는 `aria-labelledby`로 꼭 준다. 항목의 키보드 이동과 선택 상태는 base-ui가 처리한다.
