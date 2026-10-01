import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "../../../client";
import { certApplications } from "../../../schema";

export async function findLatestCertApplication({
  serverId,
  userId,
  rulebookId,
}: {
  serverId: string;
  userId: string;
  rulebookId: string;
}) {
  const [latest] = await db
    .select({
      id: certApplications.id,
      groupId: certApplications.groupId,
      status: certApplications.status,
    })
    .from(certApplications)
    .where(
      and(
        eq(certApplications.serverId, serverId),
        eq(certApplications.userId, userId),
        eq(certApplications.rulebookId, rulebookId),
        ne(certApplications.status, "withdrawn"),
      ),
    )
    .orderBy(desc(certApplications.createdAt))
    .limit(1);
  return latest;
}
