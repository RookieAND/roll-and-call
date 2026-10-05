import type { BadgeEvent } from "./reached-tier";

export type BadgeSession = {
  gameId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  categoryId: string | null;
  categoryName: string | null;
  // 불참이 아닌 확정 참여자 수(GM 제외).
  attendedCount: number;
};

export type BadgeReview = { gameId: string; createdAt: Date };

// 적용한 추첨에서 내가 굴린 1d100. nearMiss는 대기 1번(정원 + 1위), picked는 추첨 순간 확정이다.
export type BadgeDraw = {
  gameId: string;
  roll: number;
  nearMiss: boolean;
  picked: boolean;
  applicants: number;
  maxPlayers: number;
  drawnAt: Date;
};

// 내가 연 추첨 구인의 신청자(1d100을 굴린 사람) 수.
export type BadgeHostedDraw = {
  gameId: string;
  applicants: number;
  maxPlayers: number;
  drawnAt: Date;
};

export type BadgeFacts = {
  played: BadgeSession[];
  hosted: BadgeSession[];
  // 내가 GM인 구인에 달린 후기와 내가 쓴 후기. 공개 상태이고 공백 제외 10자 이상인 것만 담는다.
  reviews: BadgeReview[];
  written: BadgeReview[];
  draws: BadgeDraw[];
  hostedDraws: BadgeHostedDraw[];
  // 그 서버 가입 시각. 가입 기간 칭호가 센다.
  joinedAt: Date | null;
  // 광클 마감은 정원이 찬 순간에만 준다. 재계산은 이미 받은 것 가운데 근거 구인이 살아 있는 것만 남긴다.
  rush: BadgeEvent[];
  asOf: Date;
};

export type EarnedBadge = {
  badgeKey: string;
  tier: number;
  earnedAt: Date;
  sourceGameId: string | null;
};
