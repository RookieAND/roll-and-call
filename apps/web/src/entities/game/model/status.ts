export type GameStatus = "recruiting" | "closed" | "confirmed" | "full";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
  full: "full",
} as const satisfies Record<GameStatus, GameStatus>;

// 배지는 모집 상태(지금 신청할 수 있나)만 말한다. 일정 상태는 배지가 아니라 글로 쓴다.
// 정원 충족(confirmed)은 마감이 아니다: 대기 신청을 받는다 → "대기 접수 중".
// 대기 신청을 끈 게임의 정원 충족(full)은 신청이 막히므로 기한 경과(closed)와 같은 "모집 마감"으로 보인다.
export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집 중",
  closed: "모집 마감",
  confirmed: "대기 접수 중",
  full: "모집 마감",
};

// Badge/Progress color token per status (shared by card, list item, detail).
export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
  full: "gray",
};
