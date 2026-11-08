---
category: Overlays
---

## Props

`children`은 감싸는 버튼 없이 그대로 트리거가 된다. 그래서 링크 안에도 넣을 수 있다. `children`은 ref와 props를 받을 수 있는 요소여야 한다.

```ts
interface TooltipProps {
  content: ReactNode; // 툴팁 글자
  children: ReactElement; // 트리거. 감싸는 래퍼 없이 그대로 쓴다
  open?: boolean; // 제어 모드
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right"; // 기본 "top"
  delay?: number; // 기본 300 (ms). 마우스를 올린 뒤 열리기까지의 시간
  className?: StateClassName<BaseTooltip.Popup.State>; // 문자열 또는 Base UI 팝업 상태를 받는 함수. 터치 기기에서는 문자열만 넘어간다
}
```

## 언제 쓰나

아이콘이나 짧은 말만 있는 버튼이 무슨 뜻인지 마우스를 올렸을 때 한 줄로 알려줄 때 쓴다. 예: 마감 안내, 공개 범위 설명.

## 쓰지 않을 때

툴팁 내용은 스크린리더에 `aria-describedby`로만 전해진다. 꼭 읽어야 하는 정보(신청 조건, 마감 시각)는 툴팁에 넣지 않고 화면에 바로 쓴다. 버튼이나 링크를 담거나 긴 내용을 보여야 하면 `Popover`를 쓴다.

## 함께 쓰는 것

`Button`이나 `Text`처럼 포커스를 받는 요소를 `children`으로 준다. 손가락으로 쓰는 기기에서는 hover가 없어 툴팁이 열리지 않으므로, 이때는 자동으로 탭하면 열리는 `Popover`로 바뀐다.

## 예제

```tsx
<Tooltip content="모집이 마감되면 자동으로 닫혀요.">
  <Button variant="ghost" colorPalette="primary">
    마감 안내
  </Button>
</Tooltip>
```

```tsx
<Tooltip content="GM이 확정한 참여자만 볼 수 있어요." side="bottom" delay={500}>
  <Text typography="body4" foreground="hint">
    참여자 명단
  </Text>
</Tooltip>
```

## data-* · 접근성

팝업은 `data-slot="tooltip-popup"`이다. 열리고 닫힐 때 `data-starting-style`·`data-ending-style`로 투명도가 바뀌고, `motion-reduce`에서는 전환이 없다. 툴팁 내용은 트리거의 `aria-describedby`로 연결된다. 터치 기기에서 열리는 Popover 대체물은 같은 `data-slot`을 쓴다.
