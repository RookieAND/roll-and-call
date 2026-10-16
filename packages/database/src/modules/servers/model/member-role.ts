export const MEMBER_ROLE = { owner: "owner", staff: "staff" } as const;
export type MemberRole = (typeof MEMBER_ROLE)[keyof typeof MEMBER_ROLE];
