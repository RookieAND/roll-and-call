import { and, count, eq } from "drizzle-orm";

import { db } from "#db/client";
import { certApplications } from "#db/schema";

// 판매처 이름별 승인된 전자책 신청 수.
export function countCertifiedBySeller({ serverId }: { serverId: string }) {
  return db
    .select({ seller: certApplications.seller, count: count() })
    .from(certApplications)
    .where(
      and(
        eq(certApplications.serverId, serverId),
        eq(certApplications.status, "approved"),
        eq(certApplications.format, "ebook"),
      ),
    )
    .groupBy(certApplications.seller);
}
