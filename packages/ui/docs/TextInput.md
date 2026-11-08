---
category: Forms
---

## Props

공통 props(className·style·render·ref)를 받는다. 그 밖에 `<input>`의 네이티브 속성(`type`·`placeholder`·`value`·`onChange`·`id` 등)을 모두 그대로 받는다. 높이는 44px로 고정돼 있다.

```ts
interface TextInputProps {
  invalid?: boolean; // 기본 false. 테두리·배경을 위험색으로 바꾸고 aria-invalid를 켠다
  disabled?: boolean; // 기본 false
  // + <input> 네이티브 속성 전부
}
```

## 언제 쓰나

구인 제목, 룰 이름처럼 한 줄짜리 글을 입력받을 때 쓴다. 숫자만 받으면 `inputMode="numeric"`을 준다.

## 쓰지 않을 때

여러 줄을 쓰는 소개글이나 메모는 `Textarea`를 쓴다. 정원처럼 ±로 줄이고 늘리는 숫자는 `Stepper`가 낫다.

## 함께 쓰는 것

`Field.Root`로 감싸 라벨·설명·에러를 붙인다. `Field.Root`의 `error`가 있으면 `aria-invalid`와 `aria-describedby`는 `TextInput`이 `Field`에서 자동으로 받는다. `htmlFor`와 `id`는 직접 맞춘다.

## 예제

```tsx
<Field.Root label="구인 제목" htmlFor="title" required>
  <TextInput id="title" placeholder="예: 마지막 열차" />
</Field.Root>
```

```tsx
<Field.Root label="룰" htmlFor="rule" required error="룰 이름을 입력해 주세요.">
  <TextInput id="rule" invalid placeholder="예: 크툴루의 부름 7판" />
</Field.Root>
```

```tsx
<TextInput type="text" value="GM 달빛" disabled />
```

## data-* · 접근성

`data-slot="text-input"`. 기본 태그는 `<input>`이다. `invalid`면 `aria-invalid="true"`가 붙고, `Field`의 설명·에러 id가 `aria-describedby`에 함께 들어간다. 포커스 링은 `focus:ring-2`로 보인다.
