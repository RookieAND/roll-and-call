---
category: Overlays
---

## Props

공통 props(`className` · `style` · `render` · `ref`)는 모든 컴포넌트가 받는다.

```ts
// Popover.Root — Base UI Popover.Root 그대로
interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  // true면 뒤쪽 조작을 막는다. 기본은 false.
  modal?: boolean | "trap-focus";
}

// Popover.Popup — Portal·Positioner를 알아서 감싼다
interface PopoverPopupProps {
  side?: "top" | "bottom" | "left" | "right"; // 기본 "bottom"
  align?: "start" | "center" | "end"; // 기본 "center"
  sideOffset?: number; // 기본 8
  collisionPadding?: number; // 기본 8 — 좁은 화면에서 자동으로 뒤집힌다
}
```

`Popover.Trigger` · `Popover.Title` · `Popover.Description` · `Popover.Close` · `Popover.Arrow`는 Base UI 파트를 그대로 쓴다.

## 언제 쓰나

트리거를 눌러 여는 작은 창이다. 보조 설명, 짧은 확인, 한두 개의 추가 동작을 트리거 옆에 붙여 보여 줄 때 쓴다.

## 쓰지 않을 때

- 마우스를 올리기만 해도 보이면 되는 한 줄 설명 → `Tooltip`(터치 기기에서는 이 Popover로 알아서 바뀐다).
- 선택지가 여러 개거나 내용이 길면 → `Sheet`. 되돌릴 수 없는 확인은 → `AlertDialog`.
- 화면을 계속 봐야 하는 필수 정보는 Popover에 넣지 않는다. 화면 안에 둔다.

## 함께 쓰는 것

`Popover.Root` 안에 `Trigger`와 `Popup`을 둔다. `Popup` 안의 내용은 `Text`·`VStack`·`Button`으로 조립한다. 닫기 동작이 필요하면 `Popover.Close`에 `render={<Button variant="outline" />}`를 준다. 꼬리표가 필요하면 `Popover.Arrow`.

## 예제

```tsx
<Popover.Root>
  <Popover.Trigger render={<IconButton aria-label="추첨 방식 안내" />}>
    <Info size={16} aria-hidden />
  </Popover.Trigger>
  <Popover.Popup>
    <VStack gap="075">
      <Text typography="subtitle2">추첨은 이렇게 돌아갑니다</Text>
      <Text typography="body4" foreground="muted">
        마감 뒤 GM이 정원만큼 무작위로 뽑고, 뽑히지 않은 신청자는 대기 명단에 순서대로 남습니다.
      </Text>
    </VStack>
  </Popover.Popup>
</Popover.Root>
```

```tsx
<Popover.Root>
  <Popover.Trigger render={<Button variant="outline" />}>확정 풀기</Popover.Trigger>
  <Popover.Popup side="bottom" align="start">
    <VStack gap="100">
      <Text typography="body4">달빛님의 확정을 풀면 대기 1번이 자동으로 올라갑니다.</Text>
      <HStack gap="100">
        <Popover.Close render={<Button variant="outline" size="sm" />}>취소</Popover.Close>
        <Button size="sm" colorPalette="danger">
          확정 풀기
        </Button>
      </HStack>
    </VStack>
  </Popover.Popup>
</Popover.Root>
```

## data-* · 접근성

- `Popup`에 `data-slot="popover-popup"`, `Arrow`에 `data-slot="popover-arrow"`. 열린 상태·방향은 Base UI가 `data-open` · `data-side` · `data-align`으로 붙인다.
- 열리면 포커스가 창 안으로 들어가고, `Esc`로 닫히며 포커스는 트리거로 돌아온다.
- 겹침 순서는 `--rc-z-popover`(60)다. 시트(40)·다이얼로그(50) 위에 뜬다.
- 폭은 `min(320px, 화면폭 - 32px)`이고, 자리가 모자라면 `collisionPadding`만큼 띄운 채 반대쪽으로 뒤집힌다.
