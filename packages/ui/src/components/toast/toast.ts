import { toast as sonnerToast } from "sonner";

import { toToastOptions } from "./to-toast-options";
import type { ToastOptions } from "./toast-options";

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, toToastOptions("success", { id: message, ...options })),
  danger: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, toToastOptions("danger", { id: message, ...options })),
  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, toToastOptions("warning", { id: message, ...options })),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, toToastOptions("info", { id: message, ...options })),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
