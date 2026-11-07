import { and, asc, eq, ne } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { homebrewRuleApplications, profiles } from "#db/schema";

import { hasHomebrewNameConflict } from "./has-homebrew-name-conflict";

// 어드민 자작 룰 심사 화면. 심사 중이면 이름이 지금 겹치는지와 다음으로 오래된 신청을 함께 본다.
export async function loadHomebrewReview({ serverId, id }: { serverId: string; id: string }) {
  const thisServer = eq(homebrewRuleApplications.serverId, serverId);
  const [application] = await db
    .select({
      application: homebrewRuleApplications,
      applicantNickname: memberNicknameSql(serverId),
      applicantAvatarUrl: profiles.avatarUrl,
    })
    .from(homebrewRuleApplications)
    .innerJoin(profiles, eq(profiles.id, homebrewRuleApplications.userId))
    .where(and(thisServer, eq(homebrewRuleApplications.id, id)));
  if (!application) return null;
  const pending = application.application.status === "pending";
  const [processor, nameConflict, [next]] = await Promise.all([
    application.application.processedBy
      ? db
          .select({ nickname: memberNicknameSql(serverId) })
          .from(profiles)
          .where(eq(profiles.id, application.application.processedBy))
          .then(([row]) => row?.nickname ?? null)
      : null,
    pending
      ? hasHomebrewNameConflict({
          executor: db,
          serverId,
          name: application.application.name,
          excludeApplicationId: id,
        })
      : false,
    db
      .select({ id: homebrewRuleApplications.id })
      .from(homebrewRuleApplications)
      .where(
        and(
          thisServer,
          eq(homebrewRuleApplications.status, "pending"),
          ne(homebrewRuleApplications.id, id),
        ),
      )
      .orderBy(asc(homebrewRuleApplications.createdAt))
      .limit(1),
  ]);
  return {
    ...application,
    processorNickname: processor,
    nameConflict,
    nextPendingId: next?.id ?? null,
  };
}
