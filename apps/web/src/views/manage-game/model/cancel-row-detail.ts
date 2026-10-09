import { isAwaitingResult } from "@roll-and-call/database/games/model";

import type { GameDetailData } from "@/shared/server";

export function cancelRowDetail({
  game,
  notifyCount,
}: {
  game: GameDetailData;
  notifyCount: number;
}): string {
  if (isAwaitingResult(game) && notifyCount > 0) return "구인을 취소하고 신청자에게 알립니다";
  if (notifyCount > 0) return "구인을 취소하고 확정자·대기자에게 알립니다";
  return "구인을 취소합니다";
}
