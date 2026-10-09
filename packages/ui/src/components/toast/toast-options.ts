import type { ReactNode } from "react";

export interface ToastOptions {
  id?: string | number;
  description?: ReactNode;
  // 밀리초.
  duration?: number;
}
