export type GameStatus = "recruiting" | "closed" | "confirmed";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
} as const satisfies Record<GameStatus, GameStatus>;

export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "일정조율",
  closed: "마감",
  confirmed: "확정",
};

// Badge/Progress color token per status (shared by card, list item, detail).
export const gameStatusColor: Record<
  GameStatus,
  "primary" | "gray" | "success"
> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
};
