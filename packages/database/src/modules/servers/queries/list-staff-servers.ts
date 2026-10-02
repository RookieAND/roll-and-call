import { and, asc, eq, or } from "drizzle-orm";

import { db } from "../../../client";
import { servers, staff } from "../../../schema";

// 어드민 서버 선택에 보일 서버. 서버장이거나 운영진으로 지정된 서버이고, 플랫폼 관리자는 모든 서버다.
export async function listStaffServers({
  userId,
  discordId,
  all,
}: {
  userId: string;
  discordId: string;
  all: boolean;
}) {
  const rows = await db
    .select({ server: servers, staffRole: staff.role })
    .from(servers)
    .leftJoin(staff, and(eq(staff.serverId, servers.id), eq(staff.userId, userId)))
    .where(all ? undefined : or(eq(servers.ownerDiscordId, discordId), eq(staff.userId, userId)))
    .orderBy(asc(servers.name));
  return rows.map(({ server }) => server);
}
