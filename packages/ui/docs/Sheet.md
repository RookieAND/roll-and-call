---
category: Overlays
---

## Props

모든 하위 컴포넌트는 `ref`·`className`을 받고, `Header`·`Body`·`Footer`는 `style`·`render`도 받는다(상태 기반 함수형 `className`/`style` 포함). 아래는 그 외 고유 prop이다.

```ts
Sheet.Root: {
  side?: "bottom" | "left" | "right"; // 기본 bottom
  size?: "auto" | "half" | "full"; // 기본 auto. bottom에서만 half·full 의미가 있다
  dismissible?: boolean; // 기본 true. false면 딤 탭·핸들 드래그·ESC로 못 닫고 Close 버튼으로만 닫힌다
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => void;
  // 그 외 Base UI Dialog.Root(actionsRef 등)를 그대로 받는다
}

Sheet.Trigger   // Base UI Dialog.Trigger 그대로
Sheet.Popup     // Base UI Dialog.Popup 그대로. Portal·Overlay를 알아서 감싼다(자체 prop 없음)
Sheet.Handle    // className? 외 고유 prop 없음
Sheet.Title     // Base UI Dialog.Title 그대로
Sheet.Close     // Base UI Dialog.Close 그대로
Sheet.Item      // Button의 모든 prop을 받는다(variant는 ghost로 고정)
```

## 언제 쓰나

바닥에서 올라오는 선택지 목록이나 메뉴, 또는 폭 380px 아래에서 선택지가 3개를 넘거나 내용이 긴 확인 화면에 쓴다.

## 쓰지 않을 때

선택지가 3개 이하이고 바로 답하는 물음이면 `Dialog`를 쓴다. 되돌릴 수 없는 확인은 `Dialog`가 아니라 `AlertDialog`를 쓴다. Sheet 안에 Sheet나 Dialog를 겹쳐 열지 않는다.

## 함께 쓰는 것

`Sheet.Popup` 안에 `Sheet.Handle`(드래그 그립, bottom에서만 동작) · `Sheet.Header` + `Sheet.Title` · `Sheet.Body` · `Sheet.Footer`를 둔다. 목록형 시트는 `Sheet.Item`을 `Sheet.Body` 대신 바로 나열해도 된다(MemberMenu 예제 참고).

## 예제

```tsx
<Sheet.Root>
  <Sheet.Popup>
    <Sheet.Handle />
    <Sheet.Header>
      <Sheet.Title>일정 조율</Sheet.Title>
    </Sheet.Header>
    <Sheet.Body>
      <Sheet.Item>토요일 오후 2시 · 4명 가능</Sheet.Item>
      <Sheet.Item>일요일 저녁 7시 · 3명 가능</Sheet.Item>
    </Sheet.Body>
    <Sheet.Footer>
      <Button>이 시간으로 확정하기</Button>
      <Sheet.Close render={<Button variant="outline" />}>닫기</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Popup>
</Sheet.Root>
```

```tsx
<Sheet.Root>
  <Sheet.Popup>
    <Sheet.Handle />
    <Sheet.Title>달빛 님</Sheet.Title>
    <Sheet.Item>프로필 보기</Sheet.Item>
    <Sheet.Item>확정 풀기</Sheet.Item>
    <Sheet.Item>
      <Text foreground="danger">내보내기</Text>
    </Sheet.Item>
  </Sheet.Popup>
</Sheet.Root>
```

## data-* · 접근성

`data-slot`: `sheet-trigger` · `sheet-overlay` · `sheet-popup`(+`data-side`, `data-size`) · `sheet-handle` · `sheet-header` · `sheet-title` · `sheet-body` · `sheet-footer` · `sheet-close` · `sheet-item`.

`dismissible`(기본값)이면 딤 탭·핸들 아래로 120px(또는 팝업 높이 1/4 중 작은 값) 이상 드래그·ESC로 닫힌다. `dismissible={false}`면 ESC 이벤트를 가로채 취소하고, 딤 탭도 막혀 `Sheet.Close`로만 닫힌다. `Sheet.Handle`은 보조 수단이라 `aria-hidden`으로 스크린리더에서 숨긴다. 포커스는 Base UI Dialog 기본대로 팝업 안에 갇히고, 닫으면 트리거로 돌아간다.
