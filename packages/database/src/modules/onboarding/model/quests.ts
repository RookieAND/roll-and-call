export const ONBOARDING_QUEST = {
  firstApply: "first_apply",
  firstReview: "first_review",
  rulebookCert: "rulebook_cert",
  firstRecruit: "first_recruit",
} as const;
export type OnboardingQuest = (typeof ONBOARDING_QUEST)[keyof typeof ONBOARDING_QUEST];

export const ONBOARDING_QUESTS: readonly OnboardingQuest[] = Object.values(ONBOARDING_QUEST);

// 해금 순서: 첫 신청 → (첫 후기, 룰북 인증) → 첫 모집.
const REQUIRED_QUEST = {
  [ONBOARDING_QUEST.firstApply]: null,
  [ONBOARDING_QUEST.firstReview]: ONBOARDING_QUEST.firstApply,
  [ONBOARDING_QUEST.rulebookCert]: ONBOARDING_QUEST.firstApply,
  [ONBOARDING_QUEST.firstRecruit]: ONBOARDING_QUEST.rulebookCert,
} as const;

export function isOnboardingQuest(value: string): value is OnboardingQuest {
  return (ONBOARDING_QUESTS as readonly string[]).includes(value);
}

export function isQuestUnlocked(quest: OnboardingQuest, cleared: readonly OnboardingQuest[]) {
  const required = REQUIRED_QUEST[quest];
  return required === null || cleared.includes(required);
}

export function isAllQuestsCleared(cleared: readonly OnboardingQuest[]) {
  return ONBOARDING_QUESTS.every((quest) => cleared.includes(quest));
}
