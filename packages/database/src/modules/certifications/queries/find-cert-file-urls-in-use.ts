import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { certApplications } from "#/schema";

export async function findCertFileUrlsInUse({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const remaining = await db
    .select({
      photoUrls: certApplications.photoUrls,
      captureUrl: certApplications.purchaseCaptureUrl,
      receiptUrl: certApplications.receiptUrl,
    })
    .from(certApplications)
    .where(and(eq(certApplications.serverId, serverId), eq(certApplications.userId, userId)));
  return new Set(
    remaining.flatMap((row) => [...Object.values(row.photoUrls), row.captureUrl, row.receiptUrl]),
  );
}
