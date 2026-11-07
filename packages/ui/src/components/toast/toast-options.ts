import type { ReactNode } from "react";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  // 문구 오른쪽의 버튼(되돌리기 등). 누르면 부르는 쪽이 toast.dismiss로 닫는다.
  action?: ReactNode;
  // 밀리초.
  duration?: number;
}
