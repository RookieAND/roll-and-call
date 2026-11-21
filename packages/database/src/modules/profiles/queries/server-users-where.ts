import { and, eq, exists, gt, ilike, inArray, isNull, notLike, sql, type SQL } from "drizzle-orm";

import { db } from "#db/client";
import { publicGamesWhere } from "#db/modules/games/queries/public-games-where";
import { isUuid } from "#db/modules/moderation/queries/is-uuid";
import { HOSTED_RULE_RECENT_MONTHS, TEST_DISCORD_ID_PREFIX } from "#db/modules/profiles/model";
import { certifications, games, profiles, rulebooks, serverMembers } from "#db/schema";

import { certifiedRulebookWhere } from "./certified-rulebook-where";
import { recruitingCountsByGm } from "./recruiting-counts-by-gm";

export type ServerUsersFilter = {
  serverId: string;
  q?: string;
  certifiedRulebookId?: string | null;
  hostedRulebookId?: string | null;
  recruitingOnly?: boolean;
  now: Date;
};

// 부르는 쪽이 server_members와 profiles를 join한다. 잘못된 룰북 ID는 오류 대신 아무도 안 맞는 것으로 본다.
export function serverUsersWhere({
  serverId,
  q,
  certifiedRulebookId,
  hostedRulebookId,
  recruitingOnly,
  now,
}: ServerUsersFilter) {
  const conditions: SQL[] = [
    eq(serverMembers.serverId, serverId),
    isNull(serverMembers.deletedAt),
    notLike(profiles.discordId, `${TEST_DISCORD_ID_PREFIX}%`),
  ];
  const keyword = q?.trim();
  if (keyword)
    conditions.push(ilike(serverMembers.nickname, `%${keyword.replace(/[\\%_]/g, "\\$&")}%`));
  if (certifiedRulebookId) {
    conditions.push(
      isUuid(certifiedRulebookId)
        ? exists(
            db
              .select({ one: sql`1` })
              .from(certifications)
              .innerJoin(rulebooks, eq(rulebooks.id, certifications.rulebookId))
              .where(
                and(
                  eq(certifications.userId, serverMembers.userId),
                  eq(certifications.rulebookId, certifiedRulebookId),
                  certifiedRulebookWhere(serverId),
                ),
              ),
          )
        : sql`false`,
    );
  }
  if (hostedRulebookId) {
    conditions.push(
      isUuid(hostedRulebookId)
        ? exists(
            db
              .select({ one: sql`1` })
              .from(games)
              .where(
                and(
                  eq(games.gmId, serverMembers.userId),
                  eq(games.rulebookId, hostedRulebookId),
                  publicGamesWhere(serverId),
                  gt(
                    games.createdAt,
                    sql`${now.toISOString()}::timestamptz - make_interval(months => ${HOSTED_RULE_RECENT_MONTHS})`,
                  ),
                ),
              ),
          )
        : sql`false`,
    );
  }
  if (recruitingOnly) {
    const recruiting = recruitingCountsByGm({ serverId, now }).as("recruiting_filter");
    conditions.push(
      inArray(serverMembers.userId, db.select({ id: recruiting.gmId }).from(recruiting)),
    );
  }
  return and(...conditions)!;
}
