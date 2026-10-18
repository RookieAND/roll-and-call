import type { MembershipStatus } from "@roll-and-call/database/moderation/model";

export { MEMBERSHIP_STATUS, type MembershipStatus } from "@roll-and-call/database/moderation/model";

export const MEMBERSHIP_LABEL: Record<MembershipStatus, string> = {
  active: "활동 중",
  left: "나감",
  banned: "차단됨",
};
