export type GameStatus = "recruiting" | "closed" | "confirmed" | "full";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
  full: "full",
} as const satisfies Record<GameStatus, GameStatus>;

// 정원 충족(confirmed)은 마감이 아니다: 대기 신청을 받아 2차 세션으로 나눌 수 있다.
// 대기 신청을 끈 게임의 정원 충족(full)은 신청이 막히므로 기한 경과(closed)와 같은 "모집 마감"으로 보인다.
// 색으로도 구분한다(초록=대기 모집 / 회색=모집 마감).
export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집 중",
  closed: "모집 마감",
  confirmed: "대기 모집",
  full: "모집 마감",
};

// Badge/Progress color token per status (shared by card, list item, detail).
export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
  full: "gray",
};
