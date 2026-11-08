---
category: Selection
---

## Props

`Radio`는 조각을 묶은 복합 컴포넌트다. 공통 props(className·style·render·ref)는 모든 조각이 받는다. 값을 고르는 묶음은 `RadioGroup` 안에 둔다.

```ts
Radio.Root: {
  value: string; // 이 항목의 값. base-ui Radio.Root의 props를 그대로 받는다 (disabled 등)
}

Radio.Indicator: {
  // 고유 prop 없음. base-ui Radio.Indicator의 props를 그대로 받는다
}

Radio.Label: {
  className?: string;
  children: ReactNode; // data-slot은 radio-label로 고정된다
}

Radio.Field: {
  className?: string;
  children: ReactNode; // label 태그. 원과 글씨 전체가 눌리도록 감싼다
}
```

## 언제 쓰나

한 묶음에서 하나만 골라야 하는 짧은 선택지에 쓴다. 예: 참여 방식(온라인·오프라인), 인증 정책.

## 쓰지 않을 때

항목마다 설명과 메타 정보가 긴 선택지는 `RadioCard`를 쓴다. 여러 개를 동시에 고를 수 있으면 `Checkbox`를 쓴다.

## 함께 쓰는 것

`RadioGroup`으로 감싸고, 각 항목은 `Radio.Field` 안에 `Radio.Root`(`Radio.Indicator` 포함)와 `Radio.Label`을 둔다. 원만 누르게 하려면 `Radio.Root`만 쓰고 라벨을 따로 연결한다.

## 예제

```tsx
<RadioGroup value={mode} onValueChange={(next) => setMode(next as string)} aria-label="참여 방식">
  <Radio.Field>
    <Radio.Root value="online">
      <Radio.Indicator />
    </Radio.Root>
    <Radio.Label>온라인 (디스코드)</Radio.Label>
  </Radio.Field>
  <Radio.Field>
    <Radio.Root value="offline">
      <Radio.Indicator />
    </Radio.Root>
    <Radio.Label>오프라인</Radio.Label>
  </Radio.Field>
</RadioGroup>
```

## data-* · 접근성

`Radio.Root`는 `data-slot="radio"`이며 선택되면 `data-checked`, 막히면 `data-disabled`가 붙는다. `Radio.Indicator`는 `data-slot="radio-indicator"`, `Radio.Label`은 `data-slot="radio-label"`, `Radio.Field`는 `data-slot="radio-field"`다. `Radio.Field`는 `<label>`이라 글씨를 눌러도 선택된다.
