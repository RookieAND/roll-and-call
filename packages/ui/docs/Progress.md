---
category: Display
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다. `children`은 받지 않는다.

```ts
interface ProgressProps {
  value: number; // 필수. 현재 값
  max?: number; // 기본 100. 0 이하면 채움을 0으로 본다
  variant?: "solid" | "tinted"; // 기본 solid
  colorPalette?: "primary" | "success" | "gray"; // 기본 primary
}
```

## 언제 쓰나

세션 정원이 얼마나 찼는지, 튜토리얼 퀘스트를 몇 개 끝냈는지처럼 한 값이 전체의 어디쯤인지 보여줄 때 쓴다. 값은 0부터 `max` 사이로 자동으로 잘린다.

## 쓰지 않을 때

숫자만 보여주면 되면 `Text`로 충분하다. 단계가 나뉜 진행이면 `Stepper`를 쓴다.

## 함께 쓰는 것

`Card.Body` 안에서 `Text`로 "4/6"을 함께 적고 바를 아래에 둔다.

## 예제

```tsx
<VStack gap="050">
  <Text typography="body4" foreground="muted">
    정원 4/6
  </Text>
  <Progress value={4} max={6} />
</VStack>
```

```tsx
<Progress value={3} max={5} variant="tinted" colorPalette="success" />
```

## data-* · 접근성

바깥 `div`에 `data-slot="progress"`와 `data-color-palette`가 붙는다. 안쪽 채움은 `data-slot="progress-indicator"`이며 너비를 퍼센트로 준다. 접근성 역할(`role="progressbar"`)은 이 컴포넌트가 붙이지 않으므로 필요하면 `render`나 props로 직접 붙인다.
