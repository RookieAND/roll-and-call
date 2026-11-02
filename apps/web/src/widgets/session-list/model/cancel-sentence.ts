import { GAME_CANCEL_KIND, type SessionGame } from "@/entities/game";

export function cancelSentence(game: SessionGame): string {
  if (game.cancelKind === GAME_CANCEL_KIND.staff) return "운영진이 구인을 취소했습니다";
  if (game.cancelKind === GAME_CANCEL_KIND.auto) return "GM이 서버를 나가 취소되었습니다";
  if (game.cancelKind === GAME_CANCEL_KIND.minPlayersUnmet) {
    return "최소 인원이 모이지 않아 취소되었습니다";
  }
  if (game.cancelKind === GAME_CANCEL_KIND.selectionExpired) {
    return "기한 안에 선발을 마치지 않아 취소되었습니다";
  }
  return game.cancelReason ?? "GM이 구인을 취소했습니다";
}
