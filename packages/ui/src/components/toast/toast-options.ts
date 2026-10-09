import type { ReactNode } from "react";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  // 밀리초.
  duration?: number;
  // 토스트 안의 단일 동작 버튼. 누르면 토스트가 닫힌다.
  action?: { label: string; onClick: () => void };
}
