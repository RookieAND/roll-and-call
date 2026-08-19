export type GameStatus = "recruiting" | "closed" | "confirmed";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
} as const satisfies Record<GameStatus, GameStatus>;

// 사용자 관점에선 정원 충족(confirmed)과 기한 경과(closed) 모두 "모집 마감".
// 색만 다르게(초록=정원 충족 / 회색=기한 경과) 구분한다.
export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집 중",
  closed: "모집 마감",
  confirmed: "모집 마감",
};

// Badge/Progress color token per status (shared by card, list item, detail).
export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
};
