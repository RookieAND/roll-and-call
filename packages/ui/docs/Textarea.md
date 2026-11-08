---
category: Forms
---

## Props

공통 props(className·style·render·ref)를 받는다. 그 밖에 `<textarea>`의 네이티브 속성(`rows`·`placeholder`·`value`·`onChange`·`id` 등)을 모두 그대로 받는다. 최소 높이는 96px이다.

```ts
interface TextareaProps {
  invalid?: boolean; // 기본 false. 테두리·배경을 위험색으로 바꾸고 aria-invalid를 켠다
  disabled?: boolean; // 기본 false
  // + <textarea> 네이티브 속성 전부
}
```

## 언제 쓰나

구인 소개글, 세션 후기처럼 여러 줄로 쓰는 긴 글에 쓴다.

## 쓰지 않을 때

한 줄짜리 제목이나 이름은 `TextInput`을 쓴다. 글자 수에 상한이 있고 짧게 끝나야 하는 자리도 `TextInput`이 낫다.

## 함께 쓰는 것

`Field.Root`로 감싸 라벨과 글자 수 안내(`counter`)를 붙인다. `htmlFor`와 `id`는 직접 맞춘다. 글자 수를 세려면 `value`를 제어 모드로 두고 `counter`에 길이를 넘긴다.

## 예제

```tsx
<Field.Root label="구인 소개" htmlFor="intro" description="참여자에게 보이는 소개입니다.">
  <Textarea id="intro" placeholder="세션 분위기, 진행 방식을 적어 주세요." />
</Field.Root>
```

```tsx
<Field.Root label="세션 후기" htmlFor="review" required error="후기를 한 줄 이상 적어 주세요.">
  <Textarea id="review" invalid rows={5} />
</Field.Root>
```

## data-* · 접근성

`data-slot="textarea"`. 기본 태그는 `<textarea>`이다. `invalid`면 `aria-invalid="true"`가 붙고, `Field`의 설명·에러 id가 `aria-describedby`에 함께 들어간다. 높이는 내용에 따라 늘지 않으니 `rows`나 `className`으로 조절한다.
