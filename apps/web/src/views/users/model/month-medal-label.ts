import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

export const MEDAL_EMOJI = { 1: "🥇", 2: "🥈", 3: "🥉" } as const;

// 칭호 알약의 등급 모양을 빌려 쓴다: 1위 금(반짝임), 2위 은, 3위 동.
export const MEDAL_LOOK = { 1: 4, 2: 3, 3: 2 } as const;

export const MEDAL_ROLE_LABEL = {
  [BADGE_ROLE.gm]: "GM",
  [BADGE_ROLE.player]: "PL",
} as const;
