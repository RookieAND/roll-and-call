import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { grantApprenticeBadge } from "#/modules/badges/commands/grant-apprentice-badge";
import {
  isAllQuestsCleared,
  ONBOARDING_QUEST,
  type OnboardingQuest,
} from "#/modules/onboarding/model/quests";
import { getQuestClears } from "#/modules/onboarding/queries/get-quest-clears";
import { onboardingQuestClears, serverMembers } from "#/schema";

export type ClearQuestResult = { recorded: boolean; allCleared: boolean; badgeGranted: boolean };

// 처음 깬 퀘스트만 기록한다. 선행 퀘스트는 검사하지 않는다(업적은 순위·점수와 무관하다).
// 호출한 사용자가 이 서버의 활동 멤버가 아니면 아무것도 쓰지 않는다.
export async function clearQuest({
  serverId,
  userId,
  quest,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  quest: OnboardingQuest;
  now?: Date;
}): Promise<ClearQuestResult> {
  const recorded = await db.transaction(async (transaction) => {
    const [member] = await transaction
      .select({ userId: serverMembers.userId })
      .from(serverMembers)
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          eq(serverMembers.userId, userId),
          isNull(serverMembers.deletedAt),
        ),
      );
    if (!member) return false;
    const inserted = await transaction
      .insert(onboardingQuestClears)
      .values({ serverId, userId, quest, clearedAt: now })
      .onConflictDoNothing()
      .returning({ quest: onboardingQuestClears.quest });
    if (inserted.length === 0) return false;
    if (quest === ONBOARDING_QUEST.firstApply) {
      await transaction
        .update(serverMembers)
        .set({ onboardedAt: now })
        .where(
          and(
            eq(serverMembers.serverId, serverId),
            eq(serverMembers.userId, userId),
            isNull(serverMembers.onboardedAt),
          ),
        );
    }
    return true;
  });
  const cleared = await getQuestClears({ serverId, userId });
  const allCleared = isAllQuestsCleared(cleared);
  // 지급이 실패해도 클리어 기록은 남는다. 매일 크론(syncApprenticeBadges)이 채운다.
  const badgeGranted =
    recorded && allCleared
      ? await grantApprenticeBadge({ serverId, userId, earnedAt: now }).catch(() => false)
      : false;
  return { recorded, allCleared, badgeGranted };
}
