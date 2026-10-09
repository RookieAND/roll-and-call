export const BADGE_ROLE = { player: "pl", gm: "gm", special: "sp" } as const;
export type BadgeRole = (typeof BADGE_ROLE)[keyof typeof BADGE_ROLE];

// 숨겨진 칭호. 받기 전에는 이름·조건을 숨기고, 받은 뒤에도 조건 대신 설명 한 줄만 보인다.
export const HIDDEN_LADDER = {
  critical: "sp.critical",
  extreme: "sp.extreme",
  luckySeven: "sp.lucky",
  fumble: "sp.fumble",
  nearMiss: "sp.near",
  oneMonth: "sp.month",
  halfYear: "sp.halfyear",
  oneYear: "sp.year",
  ambidextrous: "sp.ambi",
  doubleHeader: "sp.double",
  tripleHeader: "sp.triple",
  expedition: "sp.expedition",
  popular: "sp.popular",
  needle: "sp.needle",
  marathon: "sp.marathon",
  rush: "sp.rush",
  hundred: "sp.hundred",
  owl: "sp.owl",
  pullUp: "sp.pullup",
  lightning: "sp.lightning",
  wins3: "sp.wins3",
  days3: "sp.days3",
  allNight: "sp.allnight",
  fullCast: "sp.fullcast",
  weekdays: "sp.weekdays",
  coin: "sp.coin",
  revive: "sp.revive",
  days7: "sp.days7",
  wins5: "sp.wins5",
  wins7: "sp.wins7",
  slump3: "sp.slump3",
  slump5: "sp.slump5",
  slump7: "sp.slump7",
  days10: "sp.days10",
  allSizes: "sp.sizes",
  allTimes: "sp.times",
  collectorKing: "sp.king",
  boxOffice: "sp.boxoffice",
  lantern: "sp.lantern",
} as const;
export type HiddenLadderKey = (typeof HIDDEN_LADDER)[keyof typeof HIDDEN_LADDER];

// 뱃지 키의 앞부분. 룰별은 뒤에 룰 분류 id, 이달의 GM·PL은 뒤에 달(2026-09)을 붙인다.
export const BADGE_LADDER = {
  playerTotal: "pl.total",
  playerRule: "pl.rule",
  playerVariety: "pl.variety",
  playerReviews: "pl.reviews",
  playerMonthly: "pl.monthly",
  gmTotal: "gm.total",
  gmRule: "gm.rule",
  gmVariety: "gm.variety",
  gmReviews: "gm.reviews",
  gmMonthly: "gm.monthly",
  developer: "sp.dev",
  guildMaster: "sp.guild",
  apprentice: "sp.apprentice",
  ...HIDDEN_LADDER,
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
