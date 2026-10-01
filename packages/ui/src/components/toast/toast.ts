import { toast as sonnerToast } from "sonner";

import { toToastOptions } from "./to-toast-options";
import type { ToastOptions } from "./toast-options";

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, toToastOptions(options)),
  danger: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, toToastOptions(options)),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, toToastOptions(options)),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
