import type { ExternalToast } from "sonner";

import type { ToastOptions } from "./toast-options";

const DEFAULT_DURATION_MS = 4000;

// 되돌리기 같은 행동이 붙은 토스트는 읽고 누를 시간이 필요해 기본으로 저절로 닫히지 않는다.
export function toToastOptions({ action, duration, ...options }: ToastOptions = {}): ExternalToast {
  const resolved = duration ?? (action ? 0 : DEFAULT_DURATION_MS);
  const persistent = resolved === 0;
  return {
    ...options,
    action,
    duration: persistent ? Infinity : resolved,
    closeButton: persistent,
  };
}
