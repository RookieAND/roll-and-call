// 서버 멤버십 상태. 나감은 디스코드 서버를 스스로 나간 사람, 차단됨은 운영진이 추방한 사람이다.
export const MEMBERSHIP_STATUS = { active: "active", left: "left", banned: "banned" } as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

export function membershipOf({
  leftAt,
  bannedAt,
}: {
  leftAt: Date | null;
  bannedAt: Date | null;
}): MembershipStatus {
  if (bannedAt) return MEMBERSHIP_STATUS.banned;
  if (leftAt) return MEMBERSHIP_STATUS.left;
  return MEMBERSHIP_STATUS.active;
}
