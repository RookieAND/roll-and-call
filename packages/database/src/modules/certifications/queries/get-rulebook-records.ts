import { and, desc, eq, gt, isNull, ne, or, sql } from "drizzle-orm";
import { compact, uniq } from "es-toolkit";

import { db } from "../../../client";
import {
  certApplications,
  certifications,
  games,
  rulebookCategories,
  rulebookRequests,
  rulebooks,
  sanctions,
} from "../../../schema";

const RECENT_DAYS = 90;
const REQUEST_RESULT_DAYS = 30;

// 거둔 신청은 없던 것으로 본다. 최근 연 구인의 룰북은 신청 추천에, 이미 대기 중인 추가 요청 이름은 중복 요청을 막는 데 쓴다.
export async function getRulebookRecords({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string | null;
}) {
  const catalog = await db
    .select({
      id: rulebooks.id,
      name: rulebooks.name,
      edition: rulebooks.edition,
      aliases: rulebooks.aliases,
      certRequired: rulebooks.certRequired,
      kind: rulebooks.kind,
      supersedesId: rulebooks.supersedesId,
      categoryId: rulebooks.categoryId,
      categoryName: rulebookCategories.name,
    })
    .from(rulebooks)
    .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.hidden, false)))
    .orderBy(rulebookCategories.name, rulebooks.name, rulebooks.edition);
  const pendingRequestNames = await db
    .selectDistinct({ name: rulebookRequests.name, edition: rulebookRequests.edition })
    .from(rulebookRequests)
    .where(and(eq(rulebookRequests.serverId, serverId), isNull(rulebookRequests.outcome)));
  if (!userId) {
    return {
      catalog,
      pendingRequestNames,
      certificationRows: [],
      applicationRows: [],
      requestRows: [],
      recentRulebookIds: [] as string[],
      suspendedUntil: null,
      suspended: false,
    };
  }

  const [certificationRows, applicationRows, requestRows, recentGames, [sanction]] =
    await Promise.all([
      db
        .select({
          rulebookId: certifications.rulebookId,
          approvedAt: certifications.approvedAt,
          revokedAt: certifications.revokedAt,
          revokeReason: certifications.revokeReason,
        })
        .from(certifications)
        .where(and(eq(certifications.serverId, serverId), eq(certifications.userId, userId))),
      db
        .select()
        .from(certApplications)
        .where(
          and(
            eq(certApplications.serverId, serverId),
            eq(certApplications.userId, userId),
            ne(certApplications.status, "withdrawn"),
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
        })
        .from(rulebookRequests)
        .where(
          and(
            eq(rulebookRequests.serverId, serverId),
            eq(rulebookRequests.userId, userId),
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
      db
        .select({ until: sanctions.until })
        .from(sanctions)
        .where(
          and(
            eq(sanctions.serverId, serverId),
            eq(sanctions.userId, userId),
            isNull(sanctions.releasedAt),
            or(isNull(sanctions.until), gt(sanctions.until, sql`now()`)),
          ),
        ),
    ]);
  const recentRulebookIds = uniq(compact(recentGames.map((game) => game.rulebookId)));
  return {
    catalog,
    pendingRequestNames,
    certificationRows,
    applicationRows,
    requestRows,
    recentRulebookIds,
    suspendedUntil: sanction?.until ?? null,
    suspended: Boolean(sanction),
  };
}

export type RulebookRecords = Awaited<ReturnType<typeof getRulebookRecords>>;
