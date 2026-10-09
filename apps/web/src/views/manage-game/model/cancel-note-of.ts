import { GAME_CANCEL_KIND, SELECTION_EXPIRED_CANCEL_TEXT } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

export function cancelNoteOf(game: Pick<GameDetailData, "cancelKind" | "cancelReason">): string {
  if (game.cancelKind === GAME_CANCEL_KIND.gm) return game.cancelReason ?? "";
  if (game.cancelKind === GAME_CANCEL_KIND.selectionExpired) return SELECTION_EXPIRED_CANCEL_TEXT;
  return "운영진이 취소한 구인입니다";
}
