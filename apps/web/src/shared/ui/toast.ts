import { toast as sonnerToast } from "sonner";

// 되돌릴 수 있는 동작(승격·강등·교체)은 확인 대신 토스트에 "되돌리기"를 단다. 누를 시간을 조금 더 준다.
const UNDO_DURATION_MS = 6000;

// sonner-based toast — visual styling lives in the <Toaster> classNames.
export const toast = {
  success: (message: string, options?: { undo?: () => void }) =>
    sonnerToast.success(
      message,
      options?.undo
        ? { duration: UNDO_DURATION_MS, action: { label: "되돌리기", onClick: options.undo } }
        : undefined,
    ),
  error: (message: string) => sonnerToast.error(message),
};
