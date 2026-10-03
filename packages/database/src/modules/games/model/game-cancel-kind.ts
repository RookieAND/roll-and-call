export type GameCancelKind = "gm" | "staff" | "auto";

export const GAME_CANCEL_KIND = {
  gm: "gm",
  staff: "staff",
  auto: "auto",
} as const satisfies Record<GameCancelKind, GameCancelKind>;
