import { isUndefined } from "es-toolkit";
import type { ExternalToast } from "sonner";

import type { ToastOptions } from "./toast-options";

export const TOAST_DURATION_MS = {
  success: 3000,
  info: 3000,
  warning: 4000,
  danger: 5000,
} as const;

export type ToastKind = keyof typeof TOAST_DURATION_MS;

export function toToastOptions(
  kind: ToastKind,
  { duration, action, ...options }: ToastOptions = {},
): ExternalToast {
  // sonner는 duration 0을 기본값으로 바꿔 버린다. 남겨 두려면 Infinity를 줘야 한다.
  const persistent = duration === 0 || (!isUndefined(action) && isUndefined(duration));
  return {
    ...options,
    action,
    duration: persistent ? Infinity : (duration ?? TOAST_DURATION_MS[kind]),
    closeButton: persistent || kind === "danger",
  };
}
