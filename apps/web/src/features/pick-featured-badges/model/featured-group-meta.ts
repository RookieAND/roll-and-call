import { BADGE_LADDER } from "@roll-and-call/database/badges/model";

export const SPECIAL_GROUP_KEY = "special";

export const FEATURED_GROUP_META: Record<string, { emoji: string; title: string }> = {
  [BADGE_LADDER.playerTotal]: { emoji: "📅", title: "누적 참여" },
  [BADGE_LADDER.playerRule]: { emoji: "🎲", title: "룰별 참여" },
  [BADGE_LADDER.playerReviews]: { emoji: "✏️", title: "후기 작성" },
  [BADGE_LADDER.playerMonthly]: { emoji: "🎖️", title: "이달의 PL" },
  [BADGE_LADDER.gmTotal]: { emoji: "📅", title: "누적 운영" },
  [BADGE_LADDER.gmRule]: { emoji: "🎲", title: "룰별 운영" },
  [BADGE_LADDER.gmVariety]: { emoji: "🧭", title: "다양한 룰 운영" },
  [BADGE_LADDER.gmReviews]: { emoji: "💬", title: "받은 후기" },
  [BADGE_LADDER.gmMonthly]: { emoji: "🎖️", title: "이달의 GM" },
  [SPECIAL_GROUP_KEY]: { emoji: "🏷️", title: "특별 칭호" },
};
