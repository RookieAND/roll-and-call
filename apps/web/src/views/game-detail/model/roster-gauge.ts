export const ROSTER_GAUGE = {
  // 정원 줄: 자리 남음 primary, 가득 success, 아무도 없으면 gray.
  capacity: "capacity",
  // 정원 밖 줄: 대기는 tinted, 추첨 신청은 solid로 꽉 채운다.
  waiting: "waiting",
  applicants: "applicants",
} as const;

export type RosterGauge = (typeof ROSTER_GAUGE)[keyof typeof ROSTER_GAUGE];
