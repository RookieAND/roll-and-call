---
category: Display
---

## Props

공통 props(className·style·render·ref)를 받는다. 기본 태그는 `<span>`이다. `typography`를 고르면 크기·행간·굵기가 한 번에 정해진다.

```ts
interface TextProps {
  typography?:
    | "metric"
    | "heading1"
    | "heading2"
    | "heading3"
    | "subtitle1"
    | "subtitle2"
    | "body2"
    | "body3"
    | "body4"
    | "body5"
    | "code2"; // 기본 "body2"
  foreground?:
    | "normal" // gray-900
    | "muted" // gray-600
    | "hint"
    | "primary" // tinted-ink
    | "success" // success-700
    | "successStrong" // success-800
    | "warning" // warning-600
    | "danger" // danger-600
    | "onPrimary"
    | "inverse"
    | "inherit"; // 기본 "normal". 부모 글자색을 그대로 쓴다
  weight?: "regular" | "medium" | "bold" | "extrabold"; // medium은 600(font-semibold)
  tight?: boolean; // 행간 1 (leading-none)
  numeric?: boolean; // 숫자 자릿수 맞춤 (tabular-nums)
  truncate?: boolean; // 한 줄로 자르고 말줄임표 (block truncate)
}
```

## 언제 쓰나

화면의 모든 글자에 쓴다. 제목은 `heading`, 본문은 `body`, 작은 보조 글씨는 `body4`와 `hint`처럼 고른다. 색을 바꿀 때도 `foreground`로 고르고, `className`으로 색을 직접 적지 않는다.

## 쓰지 않을 때

글자 하나에 크기를 임의로 매기는 `className`(예: `text-[13px]`)은 쓰지 않는다. 스케일에 없는 크기가 필요해 보이면 `typography` 중에서 고른다.

## 함께 쓰는 것

`VStack`·`HStack` 안에서 제목·부제를 쌓는다. 카드 안에서는 `Card.Header`에 `subtitle1`, `Card.Body`에 `body4`를 주는 식이 흔하다. 한 줄로 잘려야 하는 긴 제목에는 `truncate`를, 숫자 열에는 `numeric`을 붙인다.

## 예제

```tsx
<VStack gap="050">
  <Text typography="subtitle1" weight="bold">
    마지막 열차
  </Text>
  <Text typography="body4" foreground="muted">
    GM 달빛 · 초심자 환영
  </Text>
</VStack>
```

```tsx
<Text typography="heading2" weight="extrabold" foreground="primary">
  구인 모집 중
</Text>
```

```tsx
<HStack align="center" gap="100">
  <Text typography="body4" foreground="hint" numeric>
    정원 4/6
  </Text>
  <Text typography="body4" foreground="danger" truncate>
    모집 마감 임박
  </Text>
</HStack>
```

## data-* · 접근성

`data-slot="text"`. 기본 태그는 `<span>`이므로 문단이나 제목이 필요하면 `render`로 `<p>`·`<h2>` 같은 태그를 준다. `typography` 값은 제목 태그로 의미를 주지 않으니, 제목 역할이 필요한 자리는 `render`로 직접 고른다.
