---
category: Display
---

## Props

공통 props(className·style·render)를 받는다. `ref`는 이 컴포넌트의 타입에 없다.

```ts
interface SkeletonProps {
  width?: number | string; // 숫자는 px, 문자열은 CSS 길이 그대로("60%")
  height?: number | string; // 숫자는 px, 문자열은 CSS 길이 그대로
  rounded?: "none" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | "full"; // 기본 200
}
```

## 언제 쓰나

구인 목록·세션 상세처럼 데이터가 도착하기 전에 실제 글자나 카드 높이를 흉내 낸 자리를 먼저 보여 줄 때 쓴다.

## 쓰지 않을 때

진행률을 숫자로 보여야 하면 `Progress`를 쓴다. 불러오는 동안 한 줄짜리 문구만 필요하면 `Text`로 충분하다.

## 함께 쓰는 것

`VStack`으로 여러 줄을 쌓아 실제 레이아웃의 높이에 맞춘다. 뼈대는 `aria-hidden`이 고정으로 붙어 스크린리더에 읽히지 않으므로, 로딩 상태를 알리는 문구는 바깥 컨테이너에서 맡긴다.

## 예제

```tsx
<VStack gap="075">
  <Skeleton width="60%" height={21} />
  <Skeleton width="40%" height={17} />
  <Skeleton height={34} rounded={400} />
</VStack>
```

```tsx
<Skeleton width={44} height={44} rounded="full" />
```

## data-* · 접근성

`data-slot="skeleton"`. 기본 태그는 `<div>`이고 `aria-hidden="true"`가 항상 붙는다. 애니메이션은 `motion-reduce`에서 멈춘다.
