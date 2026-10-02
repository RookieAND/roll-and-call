import { MEMBERSHIP_STATUS, type MembershipStatus } from "@/shared/lib";

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
