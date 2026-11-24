import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

export const MEDAL_ROLE_LABEL = {
  [BADGE_ROLE.gm]: "GM",
  [BADGE_ROLE.player]: "PL",
} as const;
