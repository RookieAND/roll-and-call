import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications, homebrewRules, rulebooks } from "#db/schema";

import { myHomebrewColumns } from "./my-homebrew-columns";

// 자작 룰 상세와 재신청 폼. 본인 신청만 읽는다. 거둔 신청은 없던 것으로 본다(찾을 수 없음).
export async function getMyHomebrewApplication({
  serverId,
  userId,
  id,
}: {
  serverId: string;
  userId: string;
  id: string;
}) {
  const [row] = await db
    .select({
      ...myHomebrewColumns,
      links: homebrewRuleApplications.links,
      imageUrls: homebrewRuleApplications.imageUrls,
      approvedAt: homebrewRules.createdAt,
    })
    .from(homebrewRuleApplications)
    .leftJoin(homebrewRules, eq(homebrewRules.rulebookId, homebrewRuleApplications.rulebookId))
    .leftJoin(rulebooks, eq(rulebooks.id, homebrewRuleApplications.rulebookId))
    .where(
      and(
        eq(homebrewRuleApplications.serverId, serverId),
        eq(homebrewRuleApplications.userId, userId),
        eq(homebrewRuleApplications.id, id),
      ),
    );
  if (!row || row.status === "withdrawn") return null;
  return row;
}

export type MyHomebrewApplicationDetail = NonNullable<
  Awaited<ReturnType<typeof getMyHomebrewApplication>>
>;
