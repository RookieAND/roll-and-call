import { toast as uiToast } from "@roll-and-call/ui";

const DEFAULT_DURATION_MS = 2500;
const UNDO_DURATION_MS = 6000;

export const toast = {
  success: (message: string, options?: { undo?: () => void }) =>
    uiToast.success(
      message,
      options?.undo
        ? { duration: UNDO_DURATION_MS, action: { label: "되돌리기", onClick: options.undo } }
        : { duration: DEFAULT_DURATION_MS },
    ),
  error: (message: string) =>
    uiToast.danger(message, { id: message, duration: DEFAULT_DURATION_MS }),
};
