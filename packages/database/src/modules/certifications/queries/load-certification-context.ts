import { and, desc, eq, isNull, ne } from "drizzle-orm";

import { db } from "#/client";
import { findActiveSanction } from "#/modules/moderation/queries/find-active-sanction";
import { findAssignedQuizQuestion } from "#/modules/rulebooks/queries/find-assigned-quiz-question";
import { certApplications, certifications, rulebooks } from "#/schema";

// 인증 신청을 받을지 가르는 데 필요한 것을 한 번에 읽는다. 사용자가 지운 기록은 없던 것으로 본다.
export async function loadCertificationContext({
  serverId,
  userId,
  rulebookId,
}: {
  serverId: string;
  userId: string;
  rulebookId: string;
}) {
  const [books, certified, applications, sanction, quizQuestion] = await Promise.all([
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
          isNull(certifications.discardedAt),
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
          isNull(certApplications.discardedAt),
        ),
      )
      .orderBy(desc(certApplications.createdAt)),
    findActiveSanction({ serverId, userId }),
    findAssignedQuizQuestion({ serverId, rulebookId, userId }),
  ]);
  return { books, certified, applications, sanction, quizQuestion };
}
