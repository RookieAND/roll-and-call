import { and, eq, exists } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications, homebrewRules, rulebooks } from "#db/schema";

// 제작자는 승인된 자기 룰의 한 줄 소개만 고친다. 운영진이 숨긴 룰은 고칠 수 없다.
export async function updateHomebrewSummary({
  serverId,
  userId,
  applicationId,
  summary,
}: {
  serverId: string;
  userId: string;
  applicationId: string;
  summary: string;
}): Promise<boolean> {
  const rows = await db
    .update(homebrewRules)
    .set({ summary })
    .where(
      and(
        eq(homebrewRules.serverId, serverId),
        eq(homebrewRules.makerId, userId),
        exists(
          db
            .select({ id: homebrewRuleApplications.id })
            .from(homebrewRuleApplications)
            .innerJoin(rulebooks, eq(rulebooks.id, homebrewRuleApplications.rulebookId))
            .where(
              and(
                eq(homebrewRuleApplications.id, applicationId),
                eq(homebrewRuleApplications.serverId, serverId),
                eq(homebrewRuleApplications.rulebookId, homebrewRules.rulebookId),
                eq(rulebooks.hidden, false),
              ),
            ),
        ),
      ),
    )
    .returning({ rulebookId: homebrewRules.rulebookId });
  return rows.length > 0;
}
