import { ONBOARDING_QUEST, type OnboardingQuest } from "@roll-and-call/database/onboarding/model";

export const QUEST_LIST_PATH = "/onboarding";

export const QUEST_PATH = {
  [ONBOARDING_QUEST.firstApply]: "/onboarding/first-apply",
  [ONBOARDING_QUEST.firstReview]: "/onboarding/first-review",
  [ONBOARDING_QUEST.rulebookCert]: "/onboarding/rulebook-cert",
  [ONBOARDING_QUEST.firstRecruit]: "/onboarding/first-recruit",
} as const satisfies Record<OnboardingQuest, string>;
