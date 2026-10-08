import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { isOnboardingQuest, type OnboardingQuest } from "#/modules/onboarding/model/quests";
import { onboardingQuestClears } from "#/schema";

export async function getQuestClears({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<OnboardingQuest[]> {
  const rows = await db
    .select({ quest: onboardingQuestClears.quest })
    .from(onboardingQuestClears)
    .where(
      and(eq(onboardingQuestClears.serverId, serverId), eq(onboardingQuestClears.userId, userId)),
    );
  return rows.map((row) => row.quest).filter(isOnboardingQuest);
}
