import { toast as sonnerToast } from "sonner";

import { toToastOptions } from "./to-toast-options";
import type { ToastOptions } from "./toast-options";

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, toToastOptions({ id: message, ...options })),
  danger: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, toToastOptions({ id: message, ...options })),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, toToastOptions({ id: message, ...options })),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
