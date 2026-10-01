import type { BadgeGrade } from "@roll-and-call/database/badges/model";

export interface DemoMedal {
  emoji: string;
  grade: BadgeGrade;
  name: string;
}

// 소개 화면의 "실제 화면 조각" 데모 값이다.
export const ACHIEVEMENT_MEDALS: DemoMedal[] = [
  { emoji: "🎲", grade: 1, name: "첫 주사위" },
  { emoji: "💖", grade: 2, name: "CoC 애호가" },
  { emoji: "⚔️", grade: 3, name: "용사" },
  { emoji: "🎓", grade: 4, name: "CoC 전문가" },
  { emoji: "🎖️", grade: 4, name: "이달의 GM" },
  { emoji: "🌟", grade: 5, name: "창조주" },
];

export const FEATURED_MEDALS: DemoMedal[] = [
  { emoji: "🌟", grade: 5, name: "창조주" },
  { emoji: "🎖️", grade: 4, name: "이달의 GM" },
  { emoji: "🎓", grade: 4, name: "CoC 전문가" },
];

export const FEATURE_MEDALS: DemoMedal[] = [
  { emoji: "🎲", grade: 1, name: "첫 주사위" },
  { emoji: "💖", grade: 2, name: "CoC 애호가" },
  { emoji: "⚔️", grade: 3, name: "용사" },
  { emoji: "🌟", grade: 5, name: "창조주" },
];
