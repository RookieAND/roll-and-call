import { handleActionResult, reportError, toast } from "@/shared/ui";

import { restoreRoster } from "../api/restore-roster";
import type { RosterEntry } from "../model/roster-entry";

// 되돌리기는 토스트 콜백이라 ErrorBoundary 밖이다. page 에러도 토스트로 알린다.
export function toastWithUndo(message: string, gameId: string, before: RosterEntry[]) {
  toast.success(message, {
    undo: async () => {
      try {
        const result = await restoreRoster(gameId, before);
        handleActionResult(result, { onSuccess: () => toast.success("되돌렸습니다") });
      } catch (error) {
        reportError(error);
      }
    },
  });
}
