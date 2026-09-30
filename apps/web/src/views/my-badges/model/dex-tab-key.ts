import { BADGE_ROLE, type BadgeRole } from "@roll-and-call/database/rules";

// ?tab=gm이면 GM 운영, 그 외에는 PL 참여.
export function dexTabKey(tab: string | string[] | undefined): BadgeRole {
  return tab === BADGE_ROLE.gm ? BADGE_ROLE.gm : BADGE_ROLE.player;
}
