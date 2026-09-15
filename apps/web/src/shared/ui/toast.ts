import { toast as sonnerToast } from "sonner";

const UNDO_DURATION_MS = 6000;

export const toast = {
  success: (message: string, options?: { undo?: () => void }) =>
    sonnerToast.success(
      message,
      options?.undo
        ? { duration: UNDO_DURATION_MS, action: { label: "되돌리기", onClick: options.undo } }
        : undefined,
    ),
  error: (message: string) => sonnerToast.error(message, { id: message }),
};
