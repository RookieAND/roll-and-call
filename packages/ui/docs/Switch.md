---
category: Forms
---

## Props

Switch는 복합 컴포넌트다. `Switch.Root`가 `<label>`을 만들고, 그 안에 `Control`(트랙)과 `Label`(글자)을 넣는다. `Switch.Root`의 나머지 props는 Base UI Switch.Root로 그대로 넘어간다. 부품은 `className`만 받는다.

```ts
Switch.Root: {
  checked?: boolean; // 제어 모드
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md"; // 기본 "md". Control과 Thumb 크기를 함께 정한다
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

Switch.Control: { className?: string } // 트랙. Base UI Switch.Root로 그려진다
Switch.Thumb: { className?: string } // 동그라미. 보통 직접 쓰지 않고 Control이 넣는다
Switch.Label: { className?: string; children: ReactNode } // subtitle1 글자
```

## 언제 쓰나

그 자리에서 바로 켜고 끄는 설정 하나에 쓴다. 예: 구인 공개 여부, 알림 받기.

## 쓰지 않을 때

체크 후 저장 버튼을 눌러야 반영되는 항목은 `Checkbox`를 쓴다. 켜짐·꺼짐 둘 중 하나가 아니라 여러 항목을 동시에 고르는 자리도 `Checkbox`다.

## 함께 쓰는 것

라벨이 컨트롤 옆에 바로 붙는 구조라서 `Field.Root`로 감싸지 않는다. 설명이 더 필요하면 `Field.Description`을 `Switch.Root` 아래에 따로 둔다.

## 예제

```tsx
<Switch.Root checked={isPublic} onCheckedChange={setIsPublic}>
  <Switch.Control />
  <Switch.Label>구인 공개</Switch.Label>
</Switch.Root>
```

```tsx
<Switch.Root size="sm" defaultChecked>
  <Switch.Control />
  <Switch.Label>모집 마감 알림 받기</Switch.Label>
</Switch.Root>
```

## data-* · 접근성

`data-slot`: `switch`(Root, label) · `switch-control` · `switch-thumb` · `switch-label`. 트랙의 켜짐·꺼짐은 `data-checked`·`data-unchecked`로 나뉜다. `disabled`일 때 트랙이 반투명해지고 클릭이 막힌다. 포커스가 트랙에 오면 링이 보인다. 최소 높이 44px 영역은 `label`이 잡는다.
