import { and, eq, or } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";
import { profiles, serverMembers, servers } from "#/schema";

import { grantSpecialBadge } from "./grant-special-badge";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GRANT_LANTERN_RESULT = {
  granted: "granted",
  alreadyHeld: "already-held",
  serverNotFound: "server-not-found",
  userNotFound: "user-not-found",
  notMember: "not-member",
} as const;
export type GrantLanternResult = (typeof GRANT_LANTERN_RESULT)[keyof typeof GRANT_LANTERN_RESULT];

// 버그 제보자에게 작은 등불을 준다. userKey는 프로필 uuid 또는 디스코드 ID, serverKey는 서버 이름 또는 slug.
export async function grantLanternBadge({
  userKey,
  serverKey,
}: {
  userKey: string;
  serverKey: string;
}): Promise<{ result: GrantLanternResult; username?: string; serverName?: string }> {
  const [server] = await db
    .select()
    .from(servers)
    .where(or(eq(servers.name, serverKey), eq(servers.slug, serverKey)));
  if (!server) return { result: GRANT_LANTERN_RESULT.serverNotFound };

  const [profile] = await db
    .select()
    .from(profiles)
    .where(UUID_PATTERN.test(userKey) ? eq(profiles.id, userKey) : eq(profiles.discordId, userKey));
  if (!profile) return { result: GRANT_LANTERN_RESULT.userNotFound };

  const named = { username: profile.username, serverName: server.name };
  const [member] = await db
    .select()
    .from(serverMembers)
    .where(and(eq(serverMembers.serverId, server.id), eq(serverMembers.userId, profile.id)));
  if (!member) return { result: GRANT_LANTERN_RESULT.notMember, ...named };

  const granted = await grantSpecialBadge({
    serverId: server.id,
    userId: profile.id,
    badgeKey: BADGE_LADDER.lantern,
  });
  return {
    result: granted ? GRANT_LANTERN_RESULT.granted : GRANT_LANTERN_RESULT.alreadyHeld,
    ...named,
  };
}
