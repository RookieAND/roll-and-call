import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications, homebrewRules, rulebooks } from "#db/schema";

import { myHomebrewColumns } from "./my-homebrew-columns";

// 내 룰북 「내가 만든 룰」. 거둔 신청과, 다시 신청해 이어진 반려 신청은 뺀다. 최근 신청이 위다.
export async function listMyHomebrewApplications({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const rows = await db
    .select(myHomebrewColumns)
    .from(homebrewRuleApplications)
    .leftJoin(homebrewRules, eq(homebrewRules.rulebookId, homebrewRuleApplications.rulebookId))
    .leftJoin(rulebooks, eq(rulebooks.id, homebrewRuleApplications.rulebookId))
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.userId, userId),
        ne(homebrewRuleApplications.status, "withdrawn"),
      ),
    )
    .orderBy(desc(homebrewRuleApplications.createdAt));
  return rows.filter((row) => !row.reapplied);
}

export type MyHomebrewApplication = Awaited<
  ReturnType<typeof listMyHomebrewApplications>
>[number];
