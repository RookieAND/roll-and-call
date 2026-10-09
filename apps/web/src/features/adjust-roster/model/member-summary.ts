export type MemberSummary = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  // 확정이면 null, 대기면 1부터의 순번.
  waitlistRank: number | null;
  hasAvailability: boolean;
  joinedAt: Date;
  // 신청글 받기 구인에서 신청자가 쓴 글. GM이 직접 넣은 사람이거나 받지 않는 구인이면 null.
  applicationNote: string | null;
};
