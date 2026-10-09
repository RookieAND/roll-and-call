import {
  BADGE_LADDER,
  BADGE_ROLE,
  type BadgeLadderKey,
  type BadgeRole,
  type BadgeStep,
} from "./badge-ladder";
import { HIDDEN_BADGE_LADDERS } from "./hidden-badge-ladders";

export type BadgeLadderDefinition = {
  role: BadgeRole;
  // 룰별 뱃지는 표시할 때 이름 앞에 룰 분류 이름을 붙인다.
  perRule: boolean;
  monthly: boolean;
  // 기록으로 계산하지 않고 오너가 직접 주는 칭호. 재계산이 건드리지 않는다.
  granted: boolean;
  // 특별 칭호의 한 줄 설명. 숨겨진 칭호는 조건 대신 이 문장만 보인다.
  description?: string;
  steps: BadgeStep[];
};

const RULE_PLAYER_STEPS: BadgeStep[] = [
  { threshold: 1, emoji: "🌱", name: "입문자", grade: 1 },
  { threshold: 5, emoji: "💖", name: "애호가", grade: 2 },
  { threshold: 15, emoji: "🎯", name: "숙련자", grade: 3 },
  { threshold: 30, emoji: "🎓", name: "전문가", grade: 4 },
  { threshold: 50, emoji: "🏆", name: "달인", grade: 5 },
];

const RULE_GM_STEPS: BadgeStep[] = [
  { threshold: 1, emoji: "🔰", name: "길잡이", grade: 1 },
  { threshold: 3, emoji: "📖", name: "해설자", grade: 2 },
  { threshold: 8, emoji: "🎩", name: "연출가", grade: 3 },
  { threshold: 15, emoji: "🎼", name: "지휘자", grade: 4 },
  { threshold: 25, emoji: "👑", name: "거장", grade: 5 },
];

export const BADGE_LADDERS: Record<BadgeLadderKey, BadgeLadderDefinition> = {
  [BADGE_LADDER.playerTotal]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 1, emoji: "🎲", name: "첫 주사위", grade: 1 },
      { threshold: 10, emoji: "🎒", name: "떠돌이", grade: 2 },
      { threshold: 30, emoji: "⚔️", name: "용사", grade: 3 },
      { threshold: 70, emoji: "🛡️", name: "수호자", grade: 4 },
      { threshold: 100, emoji: "🐉", name: "용 사냥꾼", grade: 5 },
    ],
  },
  [BADGE_LADDER.playerRule]: {
    role: BADGE_ROLE.player,
    perRule: true,
    monthly: false,
    granted: false,
    steps: RULE_PLAYER_STEPS,
  },
  [BADGE_LADDER.playerReviews]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 1, emoji: "✏️", name: "첫 기록", grade: 1 },
      { threshold: 5, emoji: "📝", name: "기록꾼", grade: 2 },
      { threshold: 15, emoji: "🖋️", name: "서기", grade: 3 },
      { threshold: 30, emoji: "📔", name: "편찬자", grade: 4 },
      { threshold: 50, emoji: "🏺", name: "전승자", grade: 5 },
    ],
  },
  [BADGE_LADDER.playerMonthly]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: true,
    granted: false,
    steps: [{ threshold: 1, emoji: "🏅", name: "이달의 PL", grade: 5, look: "monthly" }],
  },
  [BADGE_LADDER.gmTotal]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 1, emoji: "🕯️", name: "첫 막", grade: 1 },
      { threshold: 5, emoji: "📜", name: "이야기꾼", grade: 2 },
      { threshold: 20, emoji: "🎭", name: "음유시인", grade: 3 },
      { threshold: 40, emoji: "🧙", name: "대현자", grade: 4 },
      { threshold: 80, emoji: "🌟", name: "창조주", grade: 5 },
    ],
  },
  [BADGE_LADDER.gmRule]: {
    role: BADGE_ROLE.gm,
    perRule: true,
    monthly: false,
    granted: false,
    steps: RULE_GM_STEPS,
  },
  [BADGE_LADDER.playerVariety]: {
    role: BADGE_ROLE.player,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 3, emoji: "🧳", name: "나그네", grade: 1 },
      { threshold: 5, emoji: "🧭", name: "여행가", grade: 2 },
      { threshold: 7, emoji: "🌍", name: "세계 일주", grade: 3 },
      { threshold: 10, emoji: "🚀", name: "우주 여행", grade: 4 },
      { threshold: 15, emoji: "🌌", name: "은하 횡단", grade: 5 },
    ],
  },
  [BADGE_LADDER.gmVariety]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 3, emoji: "🔖", name: "책갈피", grade: 1 },
      { threshold: 5, emoji: "📚", name: "책벌레", grade: 2 },
      { threshold: 7, emoji: "🗝️", name: "서고지기", grade: 3 },
      { threshold: 10, emoji: "🪶", name: "필경사", grade: 4 },
      { threshold: 15, emoji: "🏛️", name: "대사서", grade: 5 },
    ],
  },
  [BADGE_LADDER.gmReviews]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 1, emoji: "💌", name: "첫 편지", grade: 1 },
      { threshold: 10, emoji: "💬", name: "입소문", grade: 2 },
      { threshold: 25, emoji: "📰", name: "인기작", grade: 3 },
      { threshold: 50, emoji: "📣", name: "화제작", grade: 4 },
      { threshold: 100, emoji: "🎬", name: "명작", grade: 5 },
    ],
  },
  [BADGE_LADDER.gmMonthly]: {
    role: BADGE_ROLE.gm,
    perRule: false,
    monthly: true,
    granted: false,
    steps: [{ threshold: 1, emoji: "🎖️", name: "이달의 GM", grade: 5, look: "monthly" }],
  },
  [BADGE_LADDER.developer]: {
    role: BADGE_ROLE.special,
    perRule: false,
    monthly: false,
    granted: true,
    description: "롤앤콜을 만든 사람입니다.",
    steps: [{ threshold: 1, emoji: "🛠️", name: "개발자", grade: 5, look: "developer" }],
  },
  [BADGE_LADDER.apprentice]: {
    role: BADGE_ROLE.special,
    perRule: false,
    monthly: false,
    granted: true,
    description: "튜토리얼 퀘스트를 모두 마쳤습니다.",
    steps: [{ threshold: 1, emoji: "🧭", name: "견습 모험가", grade: 1 }],
  },
  [BADGE_LADDER.rulebooks]: {
    role: BADGE_ROLE.special,
    perRule: false,
    monthly: false,
    granted: false,
    steps: [
      { threshold: 3, emoji: "📖", name: "서생", grade: 2 },
      { threshold: 10, emoji: "📚", name: "장서가", grade: 3 },
      { threshold: 20, emoji: "🎓", name: "박학다식", grade: 4 },
      { threshold: 30, emoji: "🏛️", name: "대도서관", grade: 5 },
    ],
  },
  [BADGE_LADDER.guildMaster]: {
    role: BADGE_ROLE.special,
    perRule: false,
    monthly: false,
    granted: true,
    description: "이 서버를 이끄는 사람입니다.",
    steps: [{ threshold: 1, emoji: "🏰", name: "길드장", grade: 5, look: "guildMaster" }],
  },
  ...HIDDEN_BADGE_LADDERS,
};
