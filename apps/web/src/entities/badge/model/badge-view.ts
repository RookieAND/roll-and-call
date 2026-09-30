import type {
  BadgeGrade,
  BadgeLadderKey,
  BadgeLook,
  BadgeRole,
  BadgeStep,
} from "@roll-and-call/database/rules";

// 화면이 뱃지 하나를 그리는 데 필요한 값. 이름은 룰 분류 이름까지 붙인 완성형이다.
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
  // 이달의 GM·PL의 달("2026-09"). 그 외에는 null.
  monthKey: string | null;
};
