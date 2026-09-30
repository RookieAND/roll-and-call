import type { BadgeGrade } from "@roll-and-call/database/rules";

import type { BadgeDetail } from "@/features/view-badge";

// 도감에서 누를 수 있는 메달 한 칸.
export type DexMedal = {
  key: string;
  emoji: string;
  grade: BadgeGrade;
  locked: boolean;
  isNew: boolean;
  name: string;
  caption: string;
  threshold: number;
  detail: BadgeDetail;
};
