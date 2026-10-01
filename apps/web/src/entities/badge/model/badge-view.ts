import type {
  BadgeGrade,
  BadgeLadderKey,
  BadgeLook,
  BadgeRole,
  BadgeStep,
} from "@roll-and-call/database/badges/model";

export type BadgeView = {
  key: string;
  ladder: BadgeLadderKey;
  role: BadgeRole;
  emoji: string;
  name: string;
  grade: BadgeGrade;
  look: BadgeLook;
  tier: number;
  step: BadgeStep;
  stepCount: number;
  categoryName: string | null;
  monthKey: string | null;
};
