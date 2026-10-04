// 구인 상세의 취소 셋(R4): 확정자 참여 취소(D1), 추첨 신청 취소(D2), 대기 취소(D3).
export const LEAVE_KIND = {
  confirmed: "confirmed",
  lottery: "lottery",
  waitlist: "waitlist",
} as const;
export type LeaveKind = (typeof LEAVE_KIND)[keyof typeof LEAVE_KIND];
