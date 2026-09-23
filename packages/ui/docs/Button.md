---
category: Actions
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface ButtonProps {
  variant?: "solid" | "outline" | "tinted" | "ghost"; // 기본 solid
  colorPalette?: "primary" | "success" | "danger" | "warning" | "gray" | "discord";
  size?: "sm" | "md" | "lg"; // 기본 md. sm(32px)은 앱바처럼 좁은 자리 전용
  loading?: boolean; // 기본 false. true면 스피너를 보여주고 네이티브 disabled도 함께 켠다
}
```

## 언제 쓰나

신청, 확정, 저장, 취소처럼 사용자가 직접 누르는 주요 액션에 쓴다.

## 쓰지 않을 때

아이콘만 있는 좁은 자리(앱바 액션 등)는 `IconButton`을 쓴다. 값을 고르거나 목록을 거르는 자리는 `Chip` 또는 `SegmentedControl`을 쓴다.

## 함께 쓰는 것

`Card.Footer` 안에 주 액션·보조 액션을 나란히 두는 경우가 흔하다. `colorPalette`를 생략하면 `variant`에 맞는 기본 팔레트가 자동으로 붙는다.

## 예제

```tsx
<HStack gap="100">
  <Button variant="solid" colorPalette="primary">
    구인 등록
  </Button>
  <Button variant="outline" colorPalette="primary">
    임시 저장
  </Button>
  <Button variant="ghost" colorPalette="primary">
    취소
  </Button>
</HStack>
```

```tsx
<HStack gap="100">
  <Button variant="solid" colorPalette="success">
    참여 확정
  </Button>
  <Button variant="solid" colorPalette="danger">
    모집 마감
  </Button>
  <Button variant="solid" colorPalette="discord">
    디스코드 연동
  </Button>
</HStack>
```

```tsx
<HStack gap="100">
  <Button loading>참여 신청</Button>
  <Button variant="outline" disabled>
    대기 접수 중
  </Button>
</HStack>
```

## data-* · 접근성

`data-slot="button"`(로딩 중이면 스피너 span에 `data-slot="button-spinner"`도 붙는다). 상태 속성: `data-variant` · `data-size` · `data-color-palette`(항상 존재) · `data-loading`(로딩 중일 때만) · `data-disabled`(disabled거나 loading일 때만).

기본 태그는 `<button type="button">`이며 `loading`이 켜지면 네이티브 `disabled`도 함께 설정돼 포커스·클릭이 막힌다. `focus-visible` 시 링이 보인다.
