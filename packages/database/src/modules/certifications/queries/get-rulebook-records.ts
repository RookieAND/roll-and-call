import { and, desc, eq, gt, isNull, ne, or, sql } from "drizzle-orm";
import { compact, uniq } from "es-toolkit";

import { db } from "#db/client";
import { homebrewUsableSql } from "#db/modules/homebrew/queries/homebrew-usable-sql";
import { findActiveSanction } from "#db/modules/moderation";
import {
  certApplications,
  certifications,
  games,
  homebrewRules,
  rulebookCategories,
  rulebookRequests,
  rulebooks,
  servers,
} from "#db/schema";

export type HomebrewOwnership = "mine" | "shared";

const RECENT_DAYS = 90;
const REQUEST_RESULT_DAYS = 30;

// 자작 룰은 쓸 수 있는 것(homebrewUsableSql)만 목록에 든다. includeRulebookId는 이미 열린 구인을 고치거나 이어 열 때 그 구인의 룰을 사용 범위와 상관없이 넣는다.
// 사용 범위 값은 돌려주지 않고 homebrew(mine: 내가 만든 룰, shared: 다른 사람의 자작 룰)만 붙인다.
// 거둔 신청과 사용자가 지운 기록은 없던 것으로 본다. 최근 연 구인의 룰북은 신청 추천에, 이미 대기 중인 추가 요청 이름은 중복 요청을 막는 데 쓴다.
export async function getRulebookRecords({
  serverId,
  userId,
  includeRulebookId = null,
}: {
  serverId: string;
  userId: string | null;
  includeRulebookId?: string | null;
}) {
  const catalogQuery = db
    .select({
      id: rulebooks.id,
      name: rulebooks.name,
      edition: rulebooks.edition,
      aliases: rulebooks.aliases,
      certRequired: rulebooks.certRequired,
      kind: rulebooks.kind,
      supersedesId: rulebooks.supersedesId,
      includedInId: rulebooks.includedInId,
      categoryId: rulebooks.categoryId,
      categoryName: rulebookCategories.name,
      homebrew: sql<HomebrewOwnership | null>`case
        when ${homebrewRules.rulebookId} is null then null
        when ${homebrewRules.makerId} = ${userId} then 'mine'
        else 'shared' end`,
    })
    .from(rulebooks)
    .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .leftJoin(homebrewRules, eq(homebrewRules.rulebookId, rulebooks.id))
    .where(
      and(
        eq(rulebooks.serverId, serverId),
        eq(rulebooks.hidden, false),
        or(
          homebrewUsableSql({ rulebookId: rulebooks.id, userId }),
          includeRulebookId ? eq(rulebooks.id, includeRulebookId) : undefined,
        ),
      ),
    )
    .orderBy(rulebookCategories.name, rulebooks.name, rulebooks.edition);
  const [catalog, [server], pendingRequestNames] = await Promise.all([
    catalogQuery,
    db
      .select({ certEnforcementDate: servers.certEnforcementDate })
      .from(servers)
      .where(eq(servers.id, serverId)),
    db
      .selectDistinct({ name: rulebookRequests.name, edition: rulebookRequests.edition })
      .from(rulebookRequests)
      .where(and(eq(rulebookRequests.serverId, serverId), isNull(rulebookRequests.outcome))),
  ]);
  const enforcementDate = server?.certEnforcementDate ?? null;
  if (!userId) {
    return {
      catalog,
      enforcementDate,
      pendingRequestNames,
      certificationRows: [],
      applicationRows: [],
      requestRows: [],
      recentRulebookIds: [] as string[],
      sanction: null,
    };
  }

  const [certificationRows, applicationRows, requestRows, recentGames, sanction] =
    await Promise.all([
      db
        .select({
          rulebookId: certifications.rulebookId,
          approvedAt: certifications.approvedAt,
          revokedAt: certifications.revokedAt,
          revokeReason: certifications.revokeReason,
        })
        .from(certifications)
        .where(
          and(
            eq(certifications.serverId, serverId),
            eq(certifications.userId, userId),
            isNull(certifications.discardedAt),
          ),
        ),
      db
        .select()
        .from(certApplications)
        .where(
          and(
            eq(certApplications.serverId, serverId),
            eq(certApplications.userId, userId),
            ne(certApplications.status, "withdrawn"),
            isNull(certApplications.discardedAt),
          ),
        )
        .orderBy(desc(certApplications.createdAt)),
      db
        .select({
          id: rulebookRequests.id,
          name: rulebookRequests.name,
          edition: rulebookRequests.edition,
          kind: rulebookRequests.kind,
          createdAt: rulebookRequests.createdAt,
          outcome: rulebookRequests.outcome,
          processedAt: rulebookRequests.processedAt,
          rejectReason: rulebookRequests.rejectReason,
        })
        .from(rulebookRequests)
        .where(
          and(
            eq(rulebookRequests.serverId, serverId),
            eq(rulebookRequests.userId, userId),
            eq(rulebookRequests.source, "user"),
            or(
              isNull(rulebookRequests.outcome),
              gt(
                rulebookRequests.processedAt,
                sql`now() - make_interval(days => ${REQUEST_RESULT_DAYS})`,
              ),
            ),
          ),
        )
        .orderBy(desc(rulebookRequests.createdAt)),
      db
        .select({ rulebookId: games.rulebookId })
        .from(games)
        .where(
          and(
            eq(games.serverId, serverId),
            eq(games.gmId, userId),
            gt(games.createdAt, sql`now() - make_interval(days => ${RECENT_DAYS})`),
          ),
        )
        .orderBy(desc(games.createdAt)),
      findActiveSanction({ serverId, userId }),
    ]);
  const recentRulebookIds = uniq(compact(recentGames.map((game) => game.rulebookId)));
  return {
    catalog,
    enforcementDate,
    pendingRequestNames,
    certificationRows,
    applicationRows,
    requestRows,
    recentRulebookIds,
    sanction,
  };
}

export type RulebookRecords = Awaited<ReturnType<typeof getRulebookRecords>>;
