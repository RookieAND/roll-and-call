export type GameStatus = "recruiting" | "closed" | "confirmed" | "full" | "scheduled";

export const GAME_STATUS = {
  recruiting: "recruiting",
  closed: "closed",
  confirmed: "confirmed",
  full: "full",
  scheduled: "scheduled",
} as const satisfies Record<GameStatus, GameStatus>;

// confirmed(정원 충족)는 대기를 받으므로 마감이 아니고, full(대기 끔)은 신청이 막혀 closed와 같은 문구다.
export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집 중",
  closed: "모집 마감",
  confirmed: "대기 접수 중",
  full: "모집 마감",
  scheduled: "일정 확정",
};

export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
  full: "gray",
  scheduled: "gray",
};
