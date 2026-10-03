import { and, desc, eq, isNotNull, ne } from "drizzle-orm";

import { db } from "#/client";
import { certApplications, certifications } from "#/schema";

// 반려됐거나 인증이 취소된 책의 기록을 지운다. 앞선 기록이 남으면 다시 그 상태로 보이므로
// 그 책의 신청 기록과 취소된 인증을 모두 지운다. 살아 있는 인증이나 심사 중인 신청이 있으면 막는다(null).
export async function discardRulebookRecord({
  serverId,
  userId,
  rulebookId,
}: {
  serverId: string;
  userId: string;
  rulebookId: string;
}) {
  const ownApplications = and(
    eq(certApplications.serverId, serverId),
    eq(certApplications.userId, userId),
    eq(certApplications.rulebookId, rulebookId),
  );
  const ownCertification = and(
    eq(certifications.serverId, serverId),
    eq(certifications.userId, userId),
    eq(certifications.rulebookId, rulebookId),
  );

  return db.transaction(async (transaction) => {
    const [certification] = await transaction
      .select({ revokedAt: certifications.revokedAt })
      .from(certifications)
      .where(ownCertification)
      .for("update");
    const [latest] = await transaction
      .select({ status: certApplications.status })
      .from(certApplications)
      .where(and(ownApplications, ne(certApplications.status, "withdrawn")))
      .orderBy(desc(certApplications.createdAt))
      .limit(1)
      .for("update");
    const liveCertification = certification && !certification.revokedAt;
    const revoked = Boolean(certification?.revokedAt);
    if (liveCertification || latest?.status === "pending") return null;
    if (latest?.status !== "rejected" && !revoked) return null;

    await transaction
      .delete(certifications)
      .where(and(ownCertification, isNotNull(certifications.revokedAt)));
    return transaction.delete(certApplications).where(ownApplications).returning({
      photoUrls: certApplications.photoUrls,
      captureUrl: certApplications.purchaseCaptureUrl,
      receiptUrl: certApplications.receiptUrl,
    });
  });
}
