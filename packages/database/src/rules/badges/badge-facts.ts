export type BadgeSession = {
  gameId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  categoryId: string | null;
  categoryName: string | null;
};

export type BadgeReview = { gameId: string; createdAt: Date };

// 한 사람의 인정 세션(참석·운영)과 받은 후기·쓴 후기. 모든 뱃지 판정이 이것만 본다.
export type BadgeFacts = {
  played: BadgeSession[];
  hosted: BadgeSession[];
  reviews: BadgeReview[];
  written: BadgeReview[];
};

export type EarnedBadge = {
  badgeKey: string;
  tier: number;
  earnedAt: Date;
  sourceGameId: string | null;
};
