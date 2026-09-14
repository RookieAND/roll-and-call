import { toast } from "@/shared/ui";
import { restoreRoster, type RosterEntry } from "../api/adjust-roster";

// 결과를 한 문장으로 알리고, "되돌리기"를 누르면 바꾸기 전 상태(before)로 그대로 돌린다.
export function toastWithUndo(message: string, gameId: string, before: RosterEntry[]) {
  toast.success(message, {
    undo: async () => {
      const result = await restoreRoster(gameId, before);
      if (result.error) toast.error(result.error);
      else toast.success("되돌렸습니다");
    },
  });
}
