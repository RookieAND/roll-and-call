import type { BadgeGrade } from "@roll-and-call/database/badges/model";

export interface DemoMedal {
  emoji: string;
  grade: BadgeGrade;
  name: string;
}

// 소개 화면의 "실제 화면 조각" 데모 값이다.
// 단계가 오를수록 메달이 커진다. 시안의 32→56px을 BadgeMedal 크기 단계에 맞췄다.
export const LADDER_MEDALS = [
  { emoji: "🎲", grade: 1, size: "xs" },
  { emoji: "💖", grade: 2, size: "sm" },
  { emoji: "⚔️", grade: 3, size: "sm" },
  { emoji: "🎓", grade: 4, size: "md" },
  { emoji: "🌟", grade: 5, size: "lg" },
] as const satisfies ReadonlyArray<{ emoji: string; grade: DemoMedal["grade"]; size: string }>;

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
