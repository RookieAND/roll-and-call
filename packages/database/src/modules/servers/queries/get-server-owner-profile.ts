import { eq } from "drizzle-orm";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, servers } from "#/schema";

// 소유자는 디스코드 서버장(servers.owner_discord_id)이다. 롤앤콜에 가입하지 않았으면 undefined.
export async function getServerOwnerProfile({ serverId }: { serverId: string }) {
  const [owner] = await db
    .select({ userId: profiles.id, nickname: memberNicknameSql(serverId) })
    .from(servers)
    .innerJoin(profiles, eq(profiles.discordId, servers.ownerDiscordId))
    .where(eq(servers.id, serverId));
  return owner;
}
