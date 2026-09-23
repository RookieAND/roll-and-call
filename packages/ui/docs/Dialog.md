---
category: Overlays
---

## Props

모든 하위 컴포넌트는 `ref`·`className`을 받고, `Header`·`Body`·`Footer`는 `style`·`render`도 받는다(상태 기반 함수형 `className`/`style` 포함). 아래는 그 외 고유 prop이다.

```ts
Dialog.Root: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => void;
  // Base UI Dialog.Root 그대로(modal 등 포함)
}

Dialog.Trigger      // Base UI Dialog.Trigger 그대로
Dialog.Popup: {
  size?: "sm" | "md" | "lg"; // 기본 md. sm=320px, md=384px, lg=512px 상한
  initialFocus?: RefObject<HTMLElement | null>; // 기본은 첫 포커스 가능 요소
  // 그 외 Base UI Dialog.Popup을 그대로 받는다. Portal·Overlay를 알아서 감싼다
}
Dialog.Description   // Base UI Dialog.Description 그대로
Dialog.Footer: {
  layout?: "row" | "stack"; // 기본 stack(세로로 쌓기). 버튼 둘을 가로로 두려면 row
}
Dialog.Close         // Base UI Dialog.Close 그대로
```

## 언제 쓰나

선택지가 3개 이하이고 그 자리에서 바로 답하는 짧은 물음이나 안내에 쓴다.

## 쓰지 않을 때

선택지가 3개를 넘거나 내용이 길면 `Sheet`를 쓴다. 되돌릴 수 없는 확인(구인 삭제, 참여자 내보내기 등)은 `Dialog`가 아니라 `AlertDialog`를 쓴다. 폼 필드 오류는 Toast가 아니라 Field error로 보여준다.

## 함께 쓰는 것

`Dialog.Popup` 안에 `Dialog.Header`(+ `Dialog.Title`, 필요하면 `Dialog.Description`) · `Dialog.Body` · `Dialog.Footer`를 둔다. `Dialog.Title`은 필수다 — 없으면 개발 모드에서 화면 낭독기가 무엇을 묻는지 못 읽는다는 경고가 뜬다.

## 예제

```tsx
<Dialog.Root>
  <Dialog.Popup size="md">
    <Dialog.Header>
      <Dialog.Title>다음 세션 안내</Dialog.Title>
      <Dialog.Description>{"9월 27일 토요일 오후 7시\n달빛 여관 · 4시간 예정"}</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>
      <Text typography="body4" foreground="muted">
        참여자 전원에게 디스코드로 같은 안내가 전달됩니다.
      </Text>
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button />}>확인</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
```

```tsx
<Dialog.Root>
  <Dialog.Popup size="sm">
    <Dialog.Header>
      <Dialog.Title>초대 링크</Dialog.Title>
      <Dialog.Description>이 링크로 들어오면 바로 신청 화면이 열립니다.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer layout="row">
      <Dialog.Close render={<Button variant="outline" className="flex-1" />}>닫기</Dialog.Close>
      <Button className="flex-1">복사하기</Button>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
```

## data-* · 접근성

`data-slot`: `dialog-overlay` · `dialog-popup`(+`data-size`) · `dialog-header` · `dialog-title` · `dialog-description` · `dialog-body` · `dialog-footer`.

Base UI Dialog 기본 동작: ESC와 딤(backdrop) 클릭으로 닫힌다. 포커스는 팝업 안에 갇히고, 기본은 첫 포커스 가능 요소에 놓이며 `initialFocus`로 바꿀 수 있다. 닫으면 트리거로 포커스가 돌아간다.
