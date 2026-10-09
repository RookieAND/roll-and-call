export type GameCancelKind = "gm" | "staff" | "auto" | "min_players_unmet" | "selection_expired";

export const GAME_CANCEL_KIND = {
  gm: "gm",
  staff: "staff",
  auto: "auto",
  minPlayersUnmet: "min_players_unmet",
  selectionExpired: "selection_expired",
} as const satisfies Record<string, GameCancelKind>;

export const MIN_PLAYERS_UNMET_CANCEL_TEXT = "최소 인원이 모이지 않아 취소되었습니다.";
export const SELECTION_EXPIRED_CANCEL_TEXT = "기한 안에 선발을 마치지 않아 취소되었습니다.";
