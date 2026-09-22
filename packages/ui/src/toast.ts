import { toast as sonnerToast } from "sonner";

import { toToastOptions } from "./to-toast-options";
import type { ToastOptions } from "./toast-options";

// 폼 오류는 Field error, 되돌릴 수 없는 결과는 Dialog로 알린다. 토스트가 유일한 통보가 되지 않게 한다.
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, toToastOptions(options)),
  danger: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, toToastOptions(options)),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, toToastOptions(options)),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};
