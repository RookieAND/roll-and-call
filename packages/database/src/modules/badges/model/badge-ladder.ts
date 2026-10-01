export const BADGE_ROLE = { player: "pl", gm: "gm", special: "sp" } as const;
export type BadgeRole = (typeof BADGE_ROLE)[keyof typeof BADGE_ROLE];

// 뱃지 키의 앞부분. 룰별은 뒤에 룰 분류 id, 이달의 GM·PL은 뒤에 달(2026-09)을 붙인다.
export const BADGE_LADDER = {
  playerTotal: "pl.total",
  playerRule: "pl.rule",
  playerReviews: "pl.reviews",
  playerMonthly: "pl.monthly",
  gmTotal: "gm.total",
  gmRule: "gm.rule",
  gmVariety: "gm.variety",
  gmReviews: "gm.reviews",
  gmMonthly: "gm.monthly",
  developer: "sp.dev",
  guildMaster: "sp.guild",
} as const;
export type BadgeLadderKey = (typeof BADGE_LADDER)[keyof typeof BADGE_LADDER];

export type BadgeGrade = 1 | 2 | 3 | 4 | 5;

export type BadgeLook = BadgeGrade | "monthly" | "developer" | "guildMaster";

export type BadgeStep = {
  threshold: number;
  emoji: string;
  name: string;
  grade: BadgeGrade;
  look?: BadgeLook;
};
