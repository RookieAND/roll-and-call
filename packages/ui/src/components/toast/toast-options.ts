import type { ReactNode } from "react";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  // 문구 오른쪽의 텍스트 버튼(되돌리기 등). 있으면 저절로 닫히지 않고 닫기 버튼이 붙는다.
  action?: { label: string; onClick: () => void };
  // 밀리초. 0이면 사용자가 닫을 때까지 남는다.
  duration?: number;
}
