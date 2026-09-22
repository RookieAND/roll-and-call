import type { CSSProperties } from "react";

import { ROLL_GRADE, type RollGrade } from "./roll-grade";

type Sparkle = {
  size: number;
  position: Pick<CSSProperties, "top" | "right" | "bottom" | "left" | "marginLeft">;
  delay: number;
  duration: number;
};

// 시안 12 F의 별 자리. 둘 다 여섯을 두르고 박자를 어긋나게 반짝인다.
export const ROLL_SPARKLES = {
  [ROLL_GRADE.critical]: [
    { size: 9, position: { right: -4, top: -4 }, delay: 0.1, duration: 1.5 },
    { size: 8, position: { left: -4, bottom: -4 }, delay: 0.35, duration: 1.5 },
    { size: 6, position: { right: -3, bottom: -3 }, delay: 0.7, duration: 1.6 },
    { size: 6, position: { left: -3, top: -3 }, delay: 0.55, duration: 1.4 },
    { size: 5, position: { right: 8, top: -5 }, delay: 0.95, duration: 1.7 },
    { size: 5, position: { left: 8, bottom: -5 }, delay: 1.15, duration: 1.4 },
  ],
  [ROLL_GRADE.extreme]: [
    { size: 8, position: { right: -4, top: -4 }, delay: 0.2, duration: 1.8 },
    { size: 6, position: { left: -4, bottom: -4 }, delay: 0.8, duration: 1.8 },
    { size: 5, position: { left: -4, top: -3 }, delay: 1.2, duration: 1.6 },
    { size: 5, position: { right: -4, bottom: -3 }, delay: 0.5, duration: 1.7 },
    { size: 6, position: { left: "50%", marginLeft: -3, top: -6 }, delay: 0.95, duration: 1.5 },
    {
      size: 5,
      position: { left: "50%", marginLeft: -2.5, bottom: -6 },
      delay: 1.45,
      duration: 1.6,
    },
  ],
} as const satisfies Record<RollGrade, Sparkle[]>;
