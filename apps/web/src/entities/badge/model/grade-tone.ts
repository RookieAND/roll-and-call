import type { BadgeGrade } from "@roll-and-call/database/rules";

import { BADGE_TONE, type BadgeTone } from "./badge-tone";

const TONE_BY_GRADE: Record<BadgeGrade, BadgeTone> = {
  1: BADGE_TONE.muted,
  2: BADGE_TONE.bronze,
  3: BADGE_TONE.primary,
  4: BADGE_TONE.gold,
  5: BADGE_TONE.gold,
};

export function gradeTone(grade: BadgeGrade): BadgeTone {
  return TONE_BY_GRADE[grade];
}
