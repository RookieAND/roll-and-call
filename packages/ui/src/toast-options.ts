import type { ReactNode } from "react";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  action?: { label: string; onClick: () => void };
  // 밀리초. 0이면 사용자가 닫을 때까지 남는다.
  duration?: number;
}
