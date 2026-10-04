// 서버 멤버십 상태. 나감은 디스코드 서버를 스스로 나간 사람, 차단됨은 운영진이 추방한 사람이다.
export const MEMBERSHIP_STATUS = { active: "active", left: "left", banned: "banned" } as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

export const MEMBERSHIP_LABEL: Record<MembershipStatus, string> = {
  active: "활동 중",
  left: "나감",
  banned: "차단됨",
};
