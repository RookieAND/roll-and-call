export const ONBOARDING_QUEST = {
  firstApply: "first_apply",
  firstReview: "first_review",
  rulebookCert: "rulebook_cert",
  firstRecruit: "first_recruit",
} as const;
export type OnboardingQuest = (typeof ONBOARDING_QUEST)[keyof typeof ONBOARDING_QUEST];

export const ONBOARDING_TRACK = { join: "join", recruit: "recruit" } as const;
export type OnboardingTrack = (typeof ONBOARDING_TRACK)[keyof typeof ONBOARDING_TRACK];

interface QuestDefinition {
  quest: OnboardingQuest;
  prerequisite: OnboardingQuest | null;
  track: OnboardingTrack;
}

// 두 갈래: 참여하기(첫 신청 → 첫 후기), 모집하기(룰북 인증 → 첫 모집). 배열 순서가 화면 순서다.
// 선행은 화면에서만 잠근다. 서버는 검사하지 않는다(업적은 순위·점수와 무관하다).
export const QUEST_DEFINITIONS: readonly QuestDefinition[] = [
  { quest: ONBOARDING_QUEST.firstApply, prerequisite: null, track: ONBOARDING_TRACK.join },
  {
    quest: ONBOARDING_QUEST.firstReview,
    prerequisite: ONBOARDING_QUEST.firstApply,
    track: ONBOARDING_TRACK.join,
  },
  { quest: ONBOARDING_QUEST.rulebookCert, prerequisite: null, track: ONBOARDING_TRACK.recruit },
  {
    quest: ONBOARDING_QUEST.firstRecruit,
    prerequisite: ONBOARDING_QUEST.rulebookCert,
    track: ONBOARDING_TRACK.recruit,
  },
];

export const ONBOARDING_QUESTS: readonly OnboardingQuest[] = QUEST_DEFINITIONS.map(
  ({ quest }) => quest,
);

export function isOnboardingQuest(value: string): value is OnboardingQuest {
  return (ONBOARDING_QUESTS as readonly string[]).includes(value);
}

export function isQuestUnlocked(quest: OnboardingQuest, cleared: readonly OnboardingQuest[]) {
  const prerequisite = QUEST_DEFINITIONS.find(
    (definition) => definition.quest === quest,
  )?.prerequisite;
  return !prerequisite || cleared.includes(prerequisite);
}

export function isAllQuestsCleared(cleared: readonly OnboardingQuest[]) {
  return ONBOARDING_QUESTS.every((quest) => cleared.includes(quest));
}

export function questsByTrack() {
  return Object.values(ONBOARDING_TRACK).map((track) => ({
    track,
    quests: QUEST_DEFINITIONS.filter((definition) => definition.track === track).map(
      ({ quest }) => quest,
    ),
  }));
}

// 같은 갈래에서 바로 다음 퀘스트. 갈래의 마지막이면 null이다.
export function nextQuestInTrack(quest: OnboardingQuest): OnboardingQuest | null {
  const index = QUEST_DEFINITIONS.findIndex((definition) => definition.quest === quest);
  const current = QUEST_DEFINITIONS[index];
  const next = QUEST_DEFINITIONS[index + 1];
  return current && next && next.track === current.track ? next.quest : null;
}
