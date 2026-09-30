import { BADGE_TONE, type BadgeTone } from "./badge-tone";

// Text의 foreground에 없는 금·동 색까지 한 곳에서 고른다.
export const TONE_CLASS: Record<BadgeTone, string> = {
  [BADGE_TONE.muted]: "text-gray-600",
  [BADGE_TONE.bronze]: "text-rank-bronze",
  [BADGE_TONE.primary]: "text-tinted-ink",
  [BADGE_TONE.gold]: "text-rank-gold",
  [BADGE_TONE.prism]: "text-badge-prism",
  [BADGE_TONE.developer]: "text-badge-developer",
  [BADGE_TONE.guild]: "text-badge-guild",
  [BADGE_TONE.hint]: "text-hint",
  [BADGE_TONE.success]: "text-success-700",
};
