"use server";

import { ONBOARDING_QUEST, type OnboardingQuest } from "@roll-and-call/database/onboarding/model";
import { z } from "zod";

import { parseActionInput, type ActionResult } from "@/shared/api";
import { clearQuest, getActingMember, notMemberError } from "@/shared/server";

const SAVE_FAILED = "진행 상황을 저장하지 못했습니다.";

const questSchema = z.enum(Object.values(ONBOARDING_QUEST));

// 클리어 기록 한 줄만 남긴다. 체험에서 한 일은 서버에 만들지 않는다(R20).
export async function clearQuestAction(
  input: OnboardingQuest,
): Promise<ActionResult & { allCleared?: boolean; badgeGranted?: boolean }> {
  const parsed = parseActionInput(questSchema, input);
  if (!parsed.ok) return parsed.result;
  const quest = parsed.data;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  try {
    const result = await clearQuest({ serverId: member.server.id, userId: member.user.id, quest });
    return { allCleared: result.allCleared, badgeGranted: result.badgeGranted };
  } catch (error) {
    console.error("clearQuest failed:", error);
    return { error: SAVE_FAILED };
  }
}
