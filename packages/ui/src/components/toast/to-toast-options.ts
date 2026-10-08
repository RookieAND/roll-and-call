import type { ExternalToast } from "sonner";

import type { ToastOptions } from "./toast-options";

const DEFAULT_DURATION_MS = 3000;

export function toToastOptions({ duration, ...options }: ToastOptions = {}): ExternalToast {
  return { ...options, duration: duration ?? DEFAULT_DURATION_MS };
}
