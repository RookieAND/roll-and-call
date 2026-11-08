---
category: Actions
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface IconButtonProps {
  "aria-label": string; // 필수. 아이콘만 있으므로 읽어 줄 이름을 꼭 준다
  variant?: "solid" | "outline" | "ghost"; // 기본 ghost
  size?: "sm" | "md" | "lg"; // 기본 md. 정사각형 32px · 40px · 48px
  disabled?: boolean; // 기본 false. 네이티브 disabled를 건다
}
```

## 언제 쓰나

앱바의 뒤로 가기·공유, 카드 모서리의 더보기 메뉴처럼 아이콘만 있는 좁은 자리에 쓴다.

## 쓰지 않을 때

글자가 있는 액션은 `Button`을 쓴다. 값을 고르는 자리는 `Chip`이나 `SegmentedControl`을 쓴다.

## 함께 쓰는 것

`HStack`에 넣어 앱바 오른쪽 액션 묶음으로 쓴다. 아이콘은 프로젝트의 아이콘 컴포넌트를 자식으로 넣는다.

## 예제

```tsx
<HStack align="center" gap="050">
  <IconButton aria-label="공유하기" variant="ghost" size="sm">
    <ShareIcon />
  </IconButton>
  <IconButton aria-label="알림 설정" variant="ghost" size="sm">
    <BellIcon />
  </IconButton>
</HStack>
```

```tsx
<IconButton aria-label="참여자 추가" variant="solid" size="lg">
  <PlusIcon />
</IconButton>
```

```tsx
<IconButton aria-label="이전 쪽으로" variant="outline" disabled>
  <ChevronLeftIcon />
</IconButton>
```

## data-* · 접근성

`data-slot="icon-button"`. 상태 속성: `data-variant` · `data-size` · `data-disabled`(disabled일 때만). 태그가 `button`일 때 `type`은 기본 `"button"`이다. `render`로 다른 요소로 바꾸면 `type`은 붙지 않는다.
