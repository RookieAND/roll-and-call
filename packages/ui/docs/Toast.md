---
category: Overlays
---

## Props

```ts
toast.success(message: string, options?: ToastOptions): void;
toast.danger(message: string, options?: ToastOptions): void;
toast.info(message: string, options?: ToastOptions): void;
toast.dismiss(id?: string | number): void;

interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  duration?: number; // 밀리초. 0이면 사용자가 닫을 때까지 남는다
}

Toast.Viewport: {
  position?: "top" | "bottom"; // 기본 bottom
  max?: number; // 한 번에 보이는 개수, 기본 3. 넘치면 오래된 것부터 걷힌다
  offset?: number; // 화면 끝에서 띄우는 거리(px), 기본 16
}
```

## 언제 쓰나

방금 한 행동의 결과(성공·실패·정보)를 짧게 알릴 때 쓴다. `toast.success`/`toast.danger`/`toast.info`를 직접 호출한다 — 컴포넌트로 렌더하지 않는다.

## 쓰지 않을 때

폼 필드 오류는 Toast가 아니라 Field error로 그 입력 옆에 보여준다. 되돌릴 수 없는 결과를 확인받아야 하면 AlertDialog를 쓴다. 토스트가 유일한 통보 수단이 되지 않게 한다.

## 함께 쓰는 것

앱 전체에 `Toast.Viewport` 하나만 둔다(레이아웃 최상단). 되돌릴 수 있는 동작에는 `action`(예: 되돌리기)을 붙인다 — `action`이 있으면 `duration`을 지정하지 않아도 저절로 닫히지 않고 닫기 버튼이 나타난다. 화면 하단에 `FloatingBar`가 떠 있으면 `Toast.Viewport`가 `--rc-floating-bar-height` CSS 변수를 자동으로 읽어 바 위로 띄운다.

## 예제

```tsx
toast.success("세션을 확정했습니다");
```

```tsx
toast.danger("구인 삭제에 실패했습니다");
```

```tsx
toast.success("출석을 확정했습니다", {
  action: { label: "되돌리기", onClick: () => undoAttendance() },
});
```

## data-* · 접근성

고유 `data-slot`은 없다 — 실제 토스트 렌더링은 `sonner`(Toaster)가 맡는다. 아이콘은 성공(`CircleCheck`)·실패(`CircleAlert`) 전용으로 고정되어 있고 `aria-hidden`이다. `duration`이 0(또는 `action`이 있어 자동으로 0이 되는 경우)이면 `closeButton`이 나타나 키보드·클릭으로 닫을 수 있다. 포커스를 가로채지 않아 화면 흐름을 막지 않는다.
