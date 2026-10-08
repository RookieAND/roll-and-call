import { toast as uiToast } from "@roll-and-call/ui";

const UNDO_DURATION_MS = 6000;

export const toast = {
  ...uiToast,
  success: (message: string, options?: { undo?: () => void }) =>
    uiToast.success(
      message,
      options?.undo
        ? { duration: UNDO_DURATION_MS, action: { label: "되돌리기", onClick: options.undo } }
        : undefined,
    ),
};
