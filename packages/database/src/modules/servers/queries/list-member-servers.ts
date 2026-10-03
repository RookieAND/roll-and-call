import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { serverMembers, servers, staff } from "#/schema";

// 탈퇴하지 않은 멤버십이 있는 서버를 최근 방문 순으로. 한 번도 안 들어간 서버는 가입 순으로 뒤에 둔다.
export async function listMemberServers(userId: string) {
  return db
    .select({
      id: servers.id,
      slug: servers.slug,
      name: servers.name,
      icon: servers.icon,
      staffRole: staff.role,
    })
    .from(serverMembers)
    .innerJoin(servers, eq(servers.id, serverMembers.serverId))
    .leftJoin(staff, and(eq(staff.serverId, serverMembers.serverId), eq(staff.userId, userId)))
    .where(and(eq(serverMembers.userId, userId), isNull(serverMembers.deletedAt)))
    .orderBy(sql`${serverMembers.lastVisitedAt} desc nulls last`, asc(serverMembers.joinedAt));
}
