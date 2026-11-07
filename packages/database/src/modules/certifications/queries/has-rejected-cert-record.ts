import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import { certApplications, certifications } from "#db/schema";

// 반려 상태(deriveCertState)는 반려된 신청이나 취소된 인증이 있어야만 나온다. 없으면 룰북 목록 전체를 읽지 않아도 된다.
export async function hasRejectedCertRecord({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const rejectedApplication = db
    .select({ one: sql`1` })
    .from(certApplications)
    .where(
      and(
        eq(certApplications.serverId, serverId),
        eq(certApplications.userId, userId),
        eq(certApplications.status, "rejected"),
        isNull(certApplications.discardedAt),
      ),
    );
  const revokedCertification = db
    .select({ one: sql`1` })
    .from(certifications)
    .where(
      and(
        eq(certifications.serverId, serverId),
        eq(certifications.userId, userId),
        isNotNull(certifications.revokedAt),
        isNull(certifications.discardedAt),
      ),
    );
  const [row] = await db.execute<{ found: boolean }>(
    sql`select exists(${rejectedApplication}) or exists(${revokedCertification}) as found`,
  );
  return row?.found === true;
}
