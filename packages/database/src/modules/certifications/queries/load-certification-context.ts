import { and, desc, eq, isNull, ne, or, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  certApplications,
  certifications,
  rulebookQuizQuestions,
  rulebooks,
  sanctions,
} from "#/schema";

// 인증 신청을 받을지 가르는 데 필요한 것을 한 번에 읽는다.
export async function loadCertificationContext({
  serverId,
  userId,
  rulebookId,
}: {
  serverId: string;
  userId: string;
  rulebookId: string;
}) {
  const [books, certified, applications, [sanction], questions] = await Promise.all([
    db
      .select({
        id: rulebooks.id,
        name: rulebooks.name,
        categoryId: rulebooks.categoryId,
        edition: rulebooks.edition,
        kind: rulebooks.kind,
        certRequired: rulebooks.certRequired,
        supersedesId: rulebooks.supersedesId,
      })
      .from(rulebooks)
      .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.hidden, false))),
    db
      .select({ rulebookId: certifications.rulebookId })
      .from(certifications)
      .where(
        and(
          eq(certifications.serverId, serverId),
          eq(certifications.userId, userId),
          isNull(certifications.revokedAt),
        ),
      ),
    db
      .select({
        rulebookId: certApplications.rulebookId,
        status: certApplications.status,
        photoUrls: certApplications.photoUrls,
      })
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
      .select({ id: sanctions.id })
      .from(sanctions)
      .where(
        and(
          eq(sanctions.serverId, serverId),
          eq(sanctions.userId, userId),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), sql`${sanctions.until} > now()`),
        ),
      ),
    db
      .select({ id: rulebookQuizQuestions.id, answers: rulebookQuizQuestions.answers })
      .from(rulebookQuizQuestions)
      .where(
        and(
          eq(rulebookQuizQuestions.serverId, serverId),
          eq(rulebookQuizQuestions.rulebookId, rulebookId),
          eq(rulebookQuizQuestions.active, true),
        ),
      ),
  ]);
  return { books, certified, applications, sanction, questions };
}
