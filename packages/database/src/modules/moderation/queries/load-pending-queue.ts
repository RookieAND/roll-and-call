import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { db } from "#db/client";
import {
  certApplications,
  certifications,
  homebrewRuleApplications,
  rulebookCategories,
  rulebookRequests,
  rulebooks,
} from "#db/schema";

// 어드민 사이드바·홈·⌘K의 처리 대기만 따로 읽는다. 스냅숏(표 18개)을 화면 이동마다 읽지 않으려는 것이다.
// 서플리먼트 신청이 기본 룰북 심사를 기다리는지 가리려고 룰북과 신청자의 인증만 함께 읽는다.
export async function loadPendingQueue(serverId: string) {
  // 인증 신청과 무관한 두 조회는 먼저 띄워 두고 함께 기다린다.
  const requestRowsPromise = db
    .select({ requestedAt: rulebookRequests.createdAt })
    .from(rulebookRequests)
    .where(
      and(
        eq(rulebookRequests.serverId, serverId),
        or(isNull(rulebookRequests.outcome), isNull(rulebookRequests.processedAt)),
      ),
    )
    .execute();
  const homebrewRowsPromise = db
    .select({ id: homebrewRuleApplications.id, appliedAt: homebrewRuleApplications.createdAt })
    .from(homebrewRuleApplications)
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.status, "pending"),
      ),
    )
    .execute();
  const applicationRows = await db
    .select({
      id: certApplications.id,
      userId: certApplications.userId,
      rulebookId: certApplications.rulebookId,
      groupId: certApplications.groupId,
      status: certApplications.status,
      appliedAt: certApplications.createdAt,
    })
    .from(certApplications)
    .where(and(eq(certApplications.serverId, serverId), eq(certApplications.status, "pending")));
  const applicantIds = uniq(applicationRows.map((row) => row.userId));
  const rulebookRows =
    applicationRows.length === 0
      ? []
      : await db
          .select({
            id: rulebooks.id,
            name: rulebooks.name,
            edition: rulebooks.edition,
            kind: rulebooks.kind,
            category: rulebookCategories.name,
          })
          .from(rulebooks)
          .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
          .where(eq(rulebooks.serverId, serverId));
  const certificationRows =
    applicantIds.length === 0
      ? []
      : await db
          .select({ userId: certifications.userId, rulebookId: certifications.rulebookId })
          .from(certifications)
          .where(
            and(
              eq(certifications.serverId, serverId),
              isNull(certifications.revokedAt),
              inArray(certifications.userId, applicantIds),
            ),
          );
  const [requestRows, homebrewRows] = await Promise.all([requestRowsPromise, homebrewRowsPromise]);
  return { applicationRows, rulebookRows, certificationRows, requestRows, homebrewRows };
}
