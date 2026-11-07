import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications } from "#db/schema";

// 본인의 심사 중 신청만 거둔다. 이미지는 처리 30일 뒤 정리 크론(purge-homebrew-files)이 비운다.
export async function withdrawHomebrewApplication({
  serverId,
  userId,
  id,
}: {
  serverId: string;
  userId: string;
  id: string;
}): Promise<boolean> {
  const rows = await db
    .update(homebrewRuleApplications)
    .set({ status: "withdrawn", processedAt: sql`now()` })
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.userId, userId),
        eq(homebrewRuleApplications.id, id),
        eq(homebrewRuleApplications.status, "pending"),
      ),
    )
    .returning({ id: homebrewRuleApplications.id });
  return rows.length > 0;
}
