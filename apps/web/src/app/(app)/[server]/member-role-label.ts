import type { MemberRole } from "@roll-and-call/database/servers/model";

const ROLE_LABEL = { owner: "서버장", staff: "관리자" } as const satisfies Record<
  MemberRole,
  string
>;

export function memberRoleLabel({
  isPlatformAdmin,
  role,
}: {
  isPlatformAdmin: boolean;
  role: MemberRole | null;
}) {
  if (isPlatformAdmin) return "플랫폼 관리자";
  return role ? ROLE_LABEL[role] : "유저";
}
