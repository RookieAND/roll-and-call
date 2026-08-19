import { toast as sonnerToast } from "sonner";

// sonner-based toast — visual styling lives in the <Toaster> classNames.
export const toast = {
  success: (message: string) => sonnerToast.success(message),
  error: (message: string) => sonnerToast.error(message),
};
