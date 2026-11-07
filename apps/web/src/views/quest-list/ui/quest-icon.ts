import { ONBOARDING_QUEST, type OnboardingQuest } from "@roll-and-call/database/onboarding/model";
import { BookCheck, FileCheck2, Flag, MessageCircle, type LucideIcon } from "lucide-react";

export const QUEST_ICON = {
  [ONBOARDING_QUEST.firstApply]: FileCheck2,
  [ONBOARDING_QUEST.firstReview]: MessageCircle,
  [ONBOARDING_QUEST.rulebookCert]: BookCheck,
  [ONBOARDING_QUEST.firstRecruit]: Flag,
} as const satisfies Record<OnboardingQuest, LucideIcon>;
