import type { BadgeLook } from "@roll-and-call/database/rules";

import { BADGE_TONE, type BadgeTone } from "./badge-tone";

const TONE_BY_LOOK: Record<BadgeLook, BadgeTone> = {
  1: BADGE_TONE.muted,
  2: BADGE_TONE.bronze,
  3: BADGE_TONE.primary,
  4: BADGE_TONE.gold,
  5: BADGE_TONE.prism,
  monthly: BADGE_TONE.gold,
  developer: BADGE_TONE.developer,
  guildMaster: BADGE_TONE.guild,
};

export function lookTone(look: BadgeLook): BadgeTone {
  return TONE_BY_LOOK[look];
}
