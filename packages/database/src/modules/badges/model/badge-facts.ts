export type BadgeSession = {
  gameId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  categoryId: string | null;
  categoryName: string | null;
};

export type BadgeReview = { gameId: string; createdAt: Date };

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
