import { BADGE_TAB, type BadgeTab } from "@/entities/badge";

export function dexTabKey(tab: string | string[] | undefined): BadgeTab {
  if (tab === BADGE_TAB.gm || tab === BADGE_TAB.special) return tab;
  return BADGE_TAB.player;
}
