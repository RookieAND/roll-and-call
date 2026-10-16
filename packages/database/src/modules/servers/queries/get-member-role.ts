import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles, servers, staff } from "#/schema";

import { MEMBER_ROLE, type MemberRole } from "../model/member-role";

// 서버장(디스코드 서버장이거나 staff 표의 owner)이면 owner, 지정된 운영진이면 staff, 아니면 null이다.
export async function getMemberRole({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<MemberRole | null> {
  const [row] = await db
    .select({
      isOwner: eq(servers.ownerDiscordId, profiles.discordId),
      staffRole: staff.role,
    })
    .from(profiles)
    .innerJoin(servers, eq(servers.id, serverId))
    .leftJoin(staff, and(eq(staff.serverId, serverId), eq(staff.userId, profiles.id)))
    .where(eq(profiles.id, userId));
  if (!row) return null;
  if (row.isOwner || row.staffRole === "owner") return MEMBER_ROLE.owner;
  return row.staffRole ? MEMBER_ROLE.staff : null;
}
