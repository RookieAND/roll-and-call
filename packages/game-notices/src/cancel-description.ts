import type { Game } from "@roll-and-call/database";
import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";

export function cancelDescription({
  kind,
  reason,
}: {
  kind: Game["cancelKind"];
  reason: string | null;
}): string {
  if (kind === GAME_CANCEL_KIND.staff) return "운영진이 취소한 구인입니다.";
  if (kind === GAME_CANCEL_KIND.auto) return "GM이 디스코드 서버를 나가 취소된 구인입니다.";
  return reason ? `GM이 세션을 취소했어요.\n사유: ${reason}` : "GM이 세션을 취소했어요.";
}
