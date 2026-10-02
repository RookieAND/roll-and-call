import { and, asc, eq, isNotNull, isNull, or, sql } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers, servers } from "../../../schema";

// 아직 가입하지 않은 사람이 들어갈 수 있는 서버 후보. 예전에 나갔던 서버를 먼저 두고, 추방된(차단 중인) 서버는 뺀다.
// ponytail: 등록된 서버를 모두 읽는다. 서버가 수백 개로 늘면 디스코드 길드 목록과 맞춰 좁힌다.
export async function listJoinCandidateServers(userId: string) {
  return db
    .select({
      slug: servers.slug,
      name: servers.name,
      icon: servers.icon,
      discordGuildId: servers.discordGuildId,
      returning: sql<boolean>`${serverMembers.deletedAt} is not null`,
    })
    .from(servers)
    .leftJoin(
      serverMembers,
      and(eq(serverMembers.serverId, servers.id), eq(serverMembers.userId, userId)),
    )
    .where(
      and(
        or(isNull(serverMembers.userId), isNotNull(serverMembers.deletedAt)),
        isNull(serverMembers.bannedAt),
      ),
    )
    .orderBy(sql`${serverMembers.deletedAt} desc nulls last`, asc(servers.name));
}
