export type GameStatus = "recruiting" | "closed" | "confirmed";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
} as const satisfies Record<GameStatus, GameStatus>;

// 정원 충족(confirmed)은 마감이 아니다: 대기 신청을 받아 2차 세션으로 나눌 수 있다.
// 색으로도 구분한다(초록=정원 충족 / 회색=기한 경과).
export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집 중",
  closed: "모집 마감",
  confirmed: "대기 모집",
};

// Badge/Progress color token per status (shared by card, list item, detail).
export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
};
