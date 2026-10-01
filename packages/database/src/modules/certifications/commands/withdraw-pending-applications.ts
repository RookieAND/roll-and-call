import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { certApplications } from "../../../schema";

// 행은 withdrawn으로 남겨 운영진이 거둔 사실을 보게 한다.
// 예전에 여러 권을 함께 낸 신청이면 같은 묶음의 심사 중인 신청을 모두 거둔다.
export async function withdrawPendingApplications({
  serverId,
  userId,
  application,
}: {
  serverId: string;
  userId: string;
  application: { id: string; groupId: string | null };
}) {
  const scope = and(
    eq(certApplications.serverId, serverId),
    eq(certApplications.userId, userId),
    eq(certApplications.status, "pending"),
    application.groupId
      ? eq(certApplications.groupId, application.groupId)
      : eq(certApplications.id, application.id),
  );
  return db.transaction(async (transaction) => {
    const rows = await transaction
      .select({
        photoUrls: certApplications.photoUrls,
        captureUrl: certApplications.purchaseCaptureUrl,
        receiptUrl: certApplications.receiptUrl,
      })
      .from(certApplications)
      .where(scope)
      .for("update");
    await transaction
      .update(certApplications)
      .set({
        status: "withdrawn",
        processedAt: new Date(),
        photoUrls: {},
        purchaseCaptureUrl: null,
        receiptUrl: null,
      })
      .where(scope);
    return rows;
  });
}
