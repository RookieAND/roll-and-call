import {
  BADGE_LADDER,
  BADGE_ROLE,
  type BadgeLadderKey,
  type BadgeRole,
  type BadgeStep,
} from "./badge-ladder";

export type BadgeLadderDefinition = {
  role: BadgeRole;
  // 룰별 뱃지는 표시할 때 이름 앞에 룰 분류 이름을 붙인다.
  perRule: boolean;
  monthly: boolean;
  steps: BadgeStep[];
};

const RULE_PLAYER_STEPS: BadgeStep[] = [
  { threshold: 1, emoji: "🌱", name: "입문자", grade: 1 },
  { threshold: 10, emoji: "💖", name: "애호가", grade: 2 },
  { threshold: 30, emoji: "🎓", name: "전문가", grade: 3 },
  { threshold: 100, emoji: "🏆", name: "달인", grade: 4 },
];

const RULE_GM_STEPS: BadgeStep[] = [
  { threshold: 1, emoji: "🔰", name: "길잡이", grade: 1 },
  { threshold: 10, emoji: "📖", name: "해설자", grade: 2 },
  { threshold: 30, emoji: "🎩", name: "연출가", grade: 3 },
  { threshold: 100, emoji: "👑", name: "거장", grade: 4 },
];

export const BADGE_LADDERS: Record<BadgeLadderKey, BadgeLadderDefinition> = {
  [BADGE_LADDER.playerTotal]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: false,
    steps: [
      { threshold: 1, emoji: "🎲", name: "첫 주사위", grade: 1 },
      { threshold: 10, emoji: "🎒", name: "떠돌이", grade: 2 },
      { threshold: 50, emoji: "⚔️", name: "용사", grade: 3 },
      { threshold: 100, emoji: "🛡️", name: "수호자", grade: 4 },
      { threshold: 200, emoji: "🐉", name: "용 사냥꾼", grade: 5 },
    ],
  },
  [BADGE_LADDER.playerRule]: {
    role: BADGE_ROLE.player,
    perRule: true,
    monthly: false,
    steps: RULE_PLAYER_STEPS,
  },
  [BADGE_LADDER.playerMonthly]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: true,
    steps: [{ threshold: 1, emoji: "🏅", name: "이달의 PL", grade: 5 }],
  },
  [BADGE_LADDER.gmTotal]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    steps: [
      { threshold: 1, emoji: "🕯️", name: "첫 막", grade: 1 },
      { threshold: 10, emoji: "📜", name: "이야기꾼", grade: 2 },
      { threshold: 50, emoji: "🎭", name: "음유시인", grade: 3 },
      { threshold: 100, emoji: "🧙", name: "대현자", grade: 4 },
      { threshold: 200, emoji: "🌟", name: "창조주", grade: 5 },
    ],
  },
  [BADGE_LADDER.gmRule]: {
    role: BADGE_ROLE.gm,
    perRule: true,
    monthly: false,
    steps: RULE_GM_STEPS,
  },
  [BADGE_LADDER.gmVariety]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    steps: [
      { threshold: 3, emoji: "📚", name: "책벌레", grade: 2 },
      { threshold: 5, emoji: "🗝️", name: "서고지기", grade: 3 },
      { threshold: 10, emoji: "🏛️", name: "대사서", grade: 4 },
    ],
  },
  [BADGE_LADDER.gmReviews]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    steps: [
      { threshold: 10, emoji: "💬", name: "입소문", grade: 2 },
      { threshold: 50, emoji: "📣", name: "화제작", grade: 3 },
    ],
  },
  [BADGE_LADDER.gmMonthly]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: true,
    steps: [{ threshold: 1, emoji: "🎖️", name: "이달의 GM", grade: 5 }],
  },
};
