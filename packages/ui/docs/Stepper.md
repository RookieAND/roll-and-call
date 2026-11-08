---
category: Actions
---

## Props

공통 props(className·style·render)를 받는다. `ref`는 이 컴포넌트의 타입에 없다.

```ts
interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  id?: string; // 가운데 input의 id. Field 라벨의 htmlFor와 맞춘다
  invalid?: boolean; // 기본 false
  disabled?: boolean; // 기본 false
  "aria-label"?: string;
  "aria-describedby"?: string;
}
```

## 언제 쓰나

정원·횟수처럼 작은 정수를 ±로 조절할 때 쓴다. 예: 모집 정원 4명.

## 쓰지 않을 때

범위가 넓어 직접 숫자를 치는 게 기본이면 `TextInput`(`inputMode="numeric"`)을 쓴다. 값이 두세 개의 고정 항목이면 `SegmentedControl`이 낫다.

## 함께 쓰는 것

`Field.Root`로 감싸 라벨을 붙이고, 라벨의 `htmlFor`를 `id`와 맞춘다. ± 버튼은 `min`·`max`에서 멈추지만, 직접 입력은 범위를 막지 않는다. 범위를 벗어난 값은 `invalid`로 표시하고 검증 메시지는 `Field`가 알리게 한다. 입력에서 숫자가 아닌 글자는 지워진다.

## 예제

```tsx
<Field.Root label="정원" htmlFor="capacity" required>
  <Stepper id="capacity" value={capacity} onChange={setCapacity} min={2} max={6} />
</Field.Root>
```

```tsx
<Stepper value={rounds} onChange={setRounds} min={1} max={12} aria-label="회차 수" />
```

## data-* · 접근성

`data-slot`: `stepper`(루트 div) · `stepper-decrement` · `stepper-input` · `stepper-increment`. `invalid`는 입력칸에 `aria-invalid`를 붙이고 테두리를 위험색으로 바꾼다. ± 버튼의 `aria-label`은 상태에 따라 "줄이기"·"늘리기"로, 끝에 닿으면 "더 줄일 수 없습니다"·"더 늘릴 수 없습니다"로 바뀐다. 끝에 닿은 버튼은 `disabled`가 된다.
