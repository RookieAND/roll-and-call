import "server-only";
import {
  adminSettings,
  certApplications,
  certifications,
  db,
  games,
  rulebookCategories,
  rulebookRequests,
  rulebooks,
  sanctions,
} from "@roll-and-call/database";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

const RECENT_DAYS = 90;
const REQUEST_RESULT_DAYS = 30;

// 룰북 목록과 한 사람의 인증 기록을 한 번에 읽는다. userId가 없으면(비로그인) 목록과 적용일만.
// 최근 연 구인의 룰북은 "다음 할 일"에, 이미 대기 중인 추가 요청 이름은 중복 요청을 막는 데 쓴다.
export async function getRulebookRecords(userId: string | null) {
  const [catalog, [settings]] = await Promise.all([
    db
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
      .where(eq(rulebooks.hidden, false))
      .orderBy(rulebookCategories.name, rulebooks.name, rulebooks.edition),
    db.select({ certEnforcementDate: adminSettings.certEnforcementDate }).from(adminSettings),
  ]);
  const pendingRequestNames = await db
    .selectDistinct({ name: rulebookRequests.name, edition: rulebookRequests.edition })
    .from(rulebookRequests)
    .where(isNull(rulebookRequests.outcome));
  const enforcementDate = settings?.certEnforcementDate ?? null;
  if (!userId) {
    return {
      catalog,
      enforcementDate,
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
        .where(eq(certifications.userId, userId)),
      db
        .select()
        .from(certApplications)
        .where(eq(certApplications.userId, userId))
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
            eq(sanctions.userId, userId),
            isNull(sanctions.releasedAt),
            or(isNull(sanctions.until), gt(sanctions.until, sql`now()`)),
          ),
        ),
    ]);
  const recentRulebookIds = [
    ...new Set(recentGames.flatMap((game) => (game.rulebookId ? [game.rulebookId] : []))),
  ];
  return {
    catalog,
    enforcementDate,
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
