export type MemberSummary = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  // 확정이면 null, 대기면 1부터의 순번.
  waitlistRank: number | null;
  hasAvailability: boolean;
};
