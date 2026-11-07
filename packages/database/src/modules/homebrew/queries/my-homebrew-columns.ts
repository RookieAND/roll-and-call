import { sql } from "drizzle-orm";

import { homebrewRuleApplications, homebrewRules, rulebooks } from "#db/schema";

// 내 룰북·자작 룰 상세가 함께 쓰는 칸. 승인된 룰의 소개는 제작자가 고친 값(homebrew_rules)을 쓴다.
export const myHomebrewColumns = {
  id: homebrewRuleApplications.id,
  name: homebrewRuleApplications.name,
  edition: homebrewRuleApplications.edition,
  summary: sql<string>`coalesce(${homebrewRules.summary}, ${homebrewRuleApplications.summary})`,
  status: homebrewRuleApplications.status,
  hidden: sql<boolean>`coalesce(${rulebooks.hidden}, false)`,
  createdAt: homebrewRuleApplications.createdAt,
  processedAt: homebrewRuleApplications.processedAt,
  rejectTag: homebrewRuleApplications.rejectTag,
  rejectReason: homebrewRuleApplications.rejectReason,
  // 이 반려 신청을 이어받아 다시 낸 신청이 있다. 내 룰북에서는 빼고, 상세에서는 [고쳐서 다시 신청]을 숨긴다.
  reapplied: sql<boolean>`exists (select 1 from ${homebrewRuleApplications} as "next" where "next"."previous_id" = ${homebrewRuleApplications.id})`,
};
