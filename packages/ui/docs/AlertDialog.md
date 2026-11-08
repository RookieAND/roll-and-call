---
category: Overlays
---

## Props

모든 하위 컴포넌트는 `ref`·`className`을 받는다. `Header`·`Body`는 `style`·`render`도 받는다. `Popup`·`Title`·`Description`·`Footer`는 `Dialog`와 같은 부품을 그대로 쓰므로 `Dialog.md`의 고유 prop이 그대로 적용된다.

```ts
AlertDialog.Root: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: AlertDialog.Root.ChangeEventDetails) => void;
  // Base UI AlertDialog.Root 그대로
}

AlertDialog.Trigger  // Base UI AlertDialog.Trigger 그대로
AlertDialog.Popup: {
  size?: "sm" | "md" | "lg"; // 기본 md. sm=320px, md=384px, lg=512px 상한
  // 그 외 Base UI Dialog.Popup props를 그대로 받는다. Portal·Overlay를 알아서 감싼다
}
AlertDialog.Header   // 고유 prop 없음
AlertDialog.Title    // Base UI Dialog.Title 그대로. 필수다
AlertDialog.Description // Base UI Dialog.Description 그대로
AlertDialog.Body     // 고유 prop 없음
AlertDialog.Footer: {
  layout?: "row" | "stack"; // 기본 stack(세로로 쌓기). 확인·취소 버튼을 가로로 두려면 row
}
AlertDialog.Close    // Base UI AlertDialog.Close 그대로
```

## Dialog와 다른 점

모양(Popup·Header·Footer)은 `Dialog`와 같다. 다른 것은 동작이다.

- 화면 낭독기에는 일반 창이 아니라 경고창(`role="alertdialog"`)으로 읽힌다.
- 바깥을 눌러도 닫히지 않는다. 확인이나 취소 버튼을 눌러야 닫힌다.
- 열릴 때 포커스가 안전한 쪽(취소)으로 간다.
- 되돌릴 수 없는 조치를 확인받는 자리에만 쓴다. 그 밖의 창은 `Dialog`다.

## 언제 쓰나

구인 삭제, 참여자 내보내기처럼 되돌릴 수 없는 조치를 한 번 더 확인받을 때 쓴다. 바깥을 눌러도 닫히지 않으며, 열리면 포커스가 취소 쪽에 가도록 Base UI가 처리한다.

## 쓰지 않을 때

되돌릴 수 있는 가벼운 안내나 선택지는 `Dialog`를 쓴다. 선택지가 많거나 긴 내용은 `Sheet`를 쓴다. 폼 입력 오류는 창으로 띄우지 말고 Field의 error로 보여준다.

## 함께 쓰는 것

`AlertDialog.Popup` 안에 `AlertDialog.Header`(+ `AlertDialog.Title`, 필요하면 `AlertDialog.Description`) · `AlertDialog.Body` · `AlertDialog.Footer`를 둔다. 확인 버튼은 `Button colorPalette="danger"`, 취소는 `AlertDialog.Close`로 감싼 `Button variant="outline"`을 쓴다.

## 예제

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger render={<Button variant="outline" colorPalette="danger" />}>
    구인 삭제
  </AlertDialog.Trigger>
  <AlertDialog.Popup size="sm">
    <AlertDialog.Header>
      <AlertDialog.Title>이 구인을 삭제할까요?</AlertDialog.Title>
      <AlertDialog.Description>
        신청자 목록과 세션 기록이 함께 사라지며 되돌릴 수 없습니다.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer layout="row">
      <AlertDialog.Close render={<Button variant="outline" className="flex-1" />}>
        취소
      </AlertDialog.Close>
      <Button colorPalette="danger" className="flex-1">
        삭제하기
      </Button>
    </AlertDialog.Footer>
  </AlertDialog.Popup>
</AlertDialog.Root>
```

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger render={<Button variant="outline" colorPalette="danger" />}>
    참여자 내보내기
  </AlertDialog.Trigger>
  <AlertDialog.Popup size="sm">
    <AlertDialog.Header>
      <AlertDialog.Title>참여자를 내보낼까요?</AlertDialog.Title>
      <AlertDialog.Description>GM 확인 없이 다시 신청할 수 없게 됩니다.</AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <Button colorPalette="danger">내보내기</Button>
      <AlertDialog.Close render={<Button variant="ghost" />}>취소</AlertDialog.Close>
    </AlertDialog.Footer>
  </AlertDialog.Popup>
</AlertDialog.Root>
```

## data-* · 접근성

`Popup`·`Header`·`Title`·`Description`·`Body`·`Footer`는 `Dialog`와 같은 `data-slot`을 쓴다(`dialog-popup`·`dialog-header`·`dialog-title`·`dialog-description`·`dialog-body`·`dialog-footer`). `Popup`에는 `data-size`가 붙는다. `Title`이 없으면 개발 모드에서 경고가 뜬다. `Root`·`Trigger`·`Close`는 Base UI가 붙이는 속성을 그대로 따른다.
