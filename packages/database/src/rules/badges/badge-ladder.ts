export const BADGE_ROLE = { player: "pl", gm: "gm", special: "sp" } as const;
export type BadgeRole = (typeof BADGE_ROLE)[keyof typeof BADGE_ROLE];

// 뱃지 키의 앞부분. 룰별은 뒤에 룰 분류 id, 이달의 GM·PL은 뒤에 달(2026-09)을 붙인다.
export const BADGE_LADDER = {
  playerTotal: "pl.total",
  playerRule: "pl.rule",
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

// 베이직·브론즈·실버·골드·프리즘. 골드부터 빛이 지나가고, 프리즘은 무지개 테두리와 후광이 붙는다.
export type BadgeGrade = 1 | 2 | 3 | 4 | 5;

// 단계 색 대신 따로 칠하는 뱃지. 이달의 GM·PL은 금색 후광, 특별 칭호는 저마다의 테두리.
export type BadgeLook = BadgeGrade | "monthly" | "developer" | "guildMaster";

export type BadgeStep = {
  threshold: number;
  emoji: string;
  name: string;
  grade: BadgeGrade;
  look?: BadgeLook;
};
