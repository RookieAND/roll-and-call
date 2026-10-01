import { BADGE_ROLE, type BadgeRole } from "@roll-and-call/database/rules";

export function dexTabKey(tab: string | string[] | undefined): BadgeRole {
  return tab === BADGE_ROLE.gm ? BADGE_ROLE.gm : BADGE_ROLE.player;
}
