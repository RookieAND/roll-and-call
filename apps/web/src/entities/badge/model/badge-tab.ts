export const BADGE_TAB = { gm: "gm", player: "pl", special: "special" } as const;
export type BadgeTab = (typeof BADGE_TAB)[keyof typeof BADGE_TAB];

export const BADGE_TABS = [
  { key: BADGE_TAB.gm, label: "GM" },
  { key: BADGE_TAB.player, label: "PL" },
  { key: BADGE_TAB.special, label: "특별" },
] as const;
