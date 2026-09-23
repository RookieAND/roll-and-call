---
category: Forms
---

## Props

`Field.Root`는 `className`·`style`·`render`만 받는다(다른 컴포넌트와 달리 `ref`·`id`나 그 외 임의 props는 받지 않는다). `Label`·`Description`·`Error`는 독립 컴포넌트로 `className`만 받는다.

```ts
Field.Root: {
  label?: string;
  counter?: ReactNode; // label 오른쪽에 보이는 글자 수 등
  description?: string; // error가 없을 때만 보인다
  error?: string; // 있으면 description 대신 이걸 보여준다
  required?: boolean; // 기본 false
  htmlFor?: string; // 자식 컨트롤의 id와 맞춰야 라벨 클릭이 연결된다
  children: ReactNode;
}

Field.Label: { label?: ReactNode; counter?: ReactNode; required?: boolean; htmlFor?: string; children?: ReactNode }
Field.Description: { text?: ReactNode; children?: ReactNode }
Field.Error: { message?: ReactNode; children?: ReactNode }
```

## 언제 쓰나

`TextInput`·`Textarea` 같은 폼 컨트롤에 라벨·설명·에러 메시지를 붙일 때 쓴다.

## 쓰지 않을 때

체크박스·스위치처럼 라벨이 컨트롤 옆에 바로 붙는 레이아웃은 `Field.Root`로 감싸지 않고 `Field.Label`·`Field.Description`·`Field.Error` 조각만 따로 배치한다.

## 함께 쓰는 것

`htmlFor`와 안에 넣는 컨트롤의 `id`를 반드시 맞춘다. `error`가 있으면 컨트롤에도 직접 `invalid`를 줘야 한다(`Field`가 자동으로 넘겨주지 않는다).

## 예제

```tsx
<Field.Root label="구인 제목" htmlFor="title" description="참여자에게 보이는 제목입니다.">
  <TextInput id="title" defaultValue="마지막 열차" />
</Field.Root>
```

```tsx
<Field.Root label="정원" htmlFor="capacity" required>
  <TextInput id="capacity" defaultValue="4" />
</Field.Root>
```

```tsx
<Field.Root label="룰" htmlFor="rule" required error="룰 이름을 입력해 주세요.">
  <TextInput id="rule" invalid placeholder="예: 크툴루의 부름 7판" />
</Field.Root>
```

## data-* · 접근성

`data-slot="field"`(Root) · `data-slot="field-header"`(라벨을 감싸는 div) · `data-slot="field-label"` · `data-slot="field-counter"` · `data-slot="field-description"` · `data-slot="field-error"`.

Root 상태 속성: `data-invalid`(`error`가 있을 때만) · `data-required`(`required`일 때만). `required`가 켜지면 라벨 옆에 `*`가 빨간 글씨로 붙는다. 라벨-컨트롤 연결(`htmlFor`/`id`)과 `aria-describedby`·`aria-invalid` 연결은 자동으로 되지 않으므로 컨트롤 쪽에서 직접 챙겨야 한다.
