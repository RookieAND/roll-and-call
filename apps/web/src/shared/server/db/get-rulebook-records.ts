import "server-only";
import {
  adminSettings,
  certApplications,
  certifications,
  db,
  games,
  rulebookRequests,
  rulebooks,
} from "@roll-and-call/database";
import { and, count, desc, eq, isNotNull, isNull } from "drizzle-orm";

// 룰북 목록과 한 사람의 인증 기록을 한 번에 읽는다. userId가 없으면(비로그인) 목록과 적용일만.
export async function getRulebookRecords(userId: string | null) {
  const [catalog, [settings]] = await Promise.all([
    db
      .select({
        id: rulebooks.id,
        name: rulebooks.name,
        edition: rulebooks.edition,
        aliases: rulebooks.aliases,
        certRequired: rulebooks.certRequired,
      })
      .from(rulebooks)
      .where(eq(rulebooks.hidden, false))
      .orderBy(rulebooks.name, rulebooks.edition),
    db.select({ certEnforcementDate: adminSettings.certEnforcementDate }).from(adminSettings),
  ]);
  const enforcementDate = settings?.certEnforcementDate ?? null;
  if (!userId) {
    return {
      catalog,
      enforcementDate,
      certificationRows: [],
      applicationRows: [],
      requestRows: [],
      gameCounts: [],
    };
  }

  const [certificationRows, applicationRows, requestRows, gameCounts] = await Promise.all([
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
        createdAt: rulebookRequests.createdAt,
      })
      .from(rulebookRequests)
      .where(and(eq(rulebookRequests.userId, userId), isNull(rulebookRequests.outcome)))
      .orderBy(desc(rulebookRequests.createdAt)),
    db
      .select({ rulebookId: games.rulebookId, count: count() })
      .from(games)
      .where(and(eq(games.gmId, userId), isNotNull(games.rulebookId)))
      .groupBy(games.rulebookId),
  ]);
  return { catalog, enforcementDate, certificationRows, applicationRows, requestRows, gameCounts };
}

export type RulebookRecords = Awaited<ReturnType<typeof getRulebookRecords>>;
