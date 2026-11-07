---
category: Overlays
---

## Props

```ts
toast.success(message: string, options?: ToastOptions): void;
toast.danger(message: string, options?: ToastOptions): void;
toast.warning(message: string, options?: ToastOptions): void;
toast.info(message: string, options?: ToastOptions): void;
toast.dismiss(id?: string | number): void;

interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  duration?: number; // 밀리초. 기본 success·info 3000, warning 4000, danger 5000. 0이면 사용자가 닫을 때까지 남는다
}

Toast.Viewport: {
  position?: "top" | "bottom"; // 기본 bottom
  max?: number; // 1100px 이상에서 한 번에 보이는 개수, 기본 3. 1100px 미만은 늘 1개라 새 토스트가 이전 것을 대체한다
  offset?: number; // 화면 끝에서 띄우는 거리(px), 기본 16
  desktopTopRight?: boolean; // 1100px 이상에서 우상단에 360px 폭으로 8px 간격을 두고 쌓는다(웹만)
}
```

## 언제 쓰나

방금 한 행동의 결과를 짧게 알릴 때 쓴다. `toast.success`/`toast.info`/`toast.warning`/`toast.danger`를 직접 호출한다 — 컴포넌트로 렌더하지 않는다.

- `success`: 방금 한 행동이 끝났을 때
- `info`: 결과를 알리지만 성공도 실패도 아닐 때, 「복사했습니다」 같은 가벼운 확인
- `warning`: 행동이 막혔거나 일부만 처리됐거나 영향을 알려야 할 때
- `danger`: 행동이 실패했을 때

네 종류 모두 같은 어두운 바탕(`bg-toast`)이고 아이콘 색으로만 구분한다. 다크 테마에서는 1px 경계선이 붙는다.

## 쓰지 않을 때

폼 필드 오류는 Toast가 아니라 Field error로 그 입력 옆에 보여준다. 되돌릴 수 없는 결과를 확인받아야 하면 AlertDialog를 쓴다. 토스트가 유일한 통보 수단이 되지 않게 한다.

## 함께 쓰는 것

앱 전체에 `Toast.Viewport` 하나만 둔다(레이아웃 최상단). 되돌릴 수 있는 동작에는 `action`(예: 되돌리기)을 붙인다 — `action`이 있으면 `duration`을 지정하지 않아도 저절로 닫히지 않고 닫기 버튼이 나타난다. 화면 하단에 `FloatingBar`나 하단 탭이 떠 있으면 `Toast.Viewport`가 `--rc-floating-bar-height`와 `--rc-bottom-nav-height` CSS 변수 중 더 큰 값을 자동으로 읽어 그 위로 띄운다. 1100px 미만에서는 좌우 `offset`만 남기고 폭을 꽉 채운다.

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

고유 `data-slot`은 없다 — 실제 토스트 렌더링은 `sonner`(Toaster)가 맡는다. 아이콘은 종류마다 고정(18px, `aria-hidden`)이다 — success `CircleCheck`, info `Info`, warning `TriangleAlert`, danger `CircleAlert`. 색은 아이콘에만 입히며 토스트 전용 토큰(`text-toast-success`/`-warning`/`-danger`/`-muted`)을 쓴다. danger는 늘 닫기 버튼이 있다. `duration`이 0이거나 `action`이 있으면(이때 `duration`을 따로 주지 않았다면) 닫힐 때까지 남고 닫기 버튼이 나타나 키보드·클릭으로 닫을 수 있다. `action`은 오른쪽의 텍스트 버튼(터치 높이 44px)이고, `description`은 문구 아래 줄에 작은 글씨로 보인다. 포커스를 가로채지 않아 화면 흐름을 막지 않는다.
