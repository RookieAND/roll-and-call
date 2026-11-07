import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { db } from "#db/client";
import { certApplications, certifications, rulebookCategories, rulebooks } from "#db/schema";

import { listAdminMemberNicknames } from "./list-admin-member-nicknames";

// 인증 심사 처리가 막히는지(서플리먼트 대기)와 함께 반려할 서플리먼트를 가릴 기록. 그 신청들의 신청자 것만 읽는다.
// certApplications는 고른 신청과 그 신청자의 심사 대기 신청이다.
export async function loadCertDecisionRecords({
  serverId,
  applicationIds,
}: {
  serverId: string;
  applicationIds: readonly string[];
}) {
  const applicantRows = await db
    .select({ userId: certApplications.userId })
    .from(certApplications)
    .where(
      and(eq(certApplications.serverId, serverId), inArray(certApplications.id, applicationIds)),
    );
  const userIds = uniq(applicantRows.map((row) => row.userId));
  if (userIds.length === 0) {
    return { certApplications: [], rulebooks: [], certifications: [], users: [] };
  }
  const applicationRows = await db
    .select({
      id: certApplications.id,
      userId: certApplications.userId,
      rulebookId: certApplications.rulebookId,
      groupId: certApplications.groupId,
      status: certApplications.status,
    })
    .from(certApplications)
    .where(
      and(
        eq(certApplications.serverId, serverId),
        inArray(certApplications.userId, userIds),
        or(inArray(certApplications.id, applicationIds), eq(certApplications.status, "pending")),
      ),
    );
  const rulebookRows = await db
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
  const certificationRows = await db
    .select({ userId: certifications.userId, rulebookId: certifications.rulebookId })
    .from(certifications)
    .where(
      and(
        eq(certifications.serverId, serverId),
        isNull(certifications.revokedAt),
        inArray(certifications.userId, userIds),
      ),
    );
  const memberRows = await listAdminMemberNicknames({ serverId, userIds });
  return {
    certApplications: applicationRows,
    rulebooks: rulebookRows,
    certifications: certificationRows,
    users: memberRows,
  };
}
