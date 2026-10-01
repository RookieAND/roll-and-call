import type { BadgeGrade } from "@roll-and-call/database/badges/model";

// 단계 이름 글자색. 메달 테두리 색과 같은 계열이다(badge-pill과 같은 값).
export const TIER_LABEL_CLASS: Record<BadgeGrade, string> = {
  1: "text-gray-600",
  2: "text-rank-bronze",
  3: "text-tinted-ink",
  4: "text-rank-gold",
  5: "text-badge-prism",
};
