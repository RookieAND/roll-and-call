import {
  isQuestUnlocked,
  ONBOARDING_QUEST,
  ONBOARDING_QUESTS,
  type OnboardingQuest,
} from "@roll-and-call/database/onboarding/model";

export const QUEST_STATE = { open: "open", cleared: "cleared", locked: "locked" } as const;
export type QuestState = (typeof QUEST_STATE)[keyof typeof QUEST_STATE];

// 카드 문구는 시안 44의 제안 문구다. 기획 확인 전이라 임의로 바꾸지 않는다.
const QUEST_META = {
  [ONBOARDING_QUEST.firstApply]: {
    title: "첫 신청",
    description: "체험용 구인에 신청해 봅니다.",
    required: true,
    path: "/onboarding/first-apply",
    lockedReason: null,
  },
  [ONBOARDING_QUEST.firstReview]: {
    title: "첫 후기",
    description: "끝난 세션에 후기를 남겨 봅니다.",
    required: false,
    path: "/onboarding/first-review",
    lockedReason: "첫 신청 퀘스트를 먼저 깨 주세요",
  },
  [ONBOARDING_QUEST.rulebookCert]: {
    title: "룰북 인증",
    description: "체험용 룰북으로 인증을 신청해 봅니다.",
    required: false,
    path: "/onboarding/rulebook-cert",
    lockedReason: "첫 신청 퀘스트를 먼저 깨 주세요",
  },
  [ONBOARDING_QUEST.firstRecruit]: {
    title: "첫 모집",
    description: "내 구인을 열어 봅니다.",
    required: false,
    path: "/onboarding/first-recruit",
    lockedReason: "룰북 인증 퀘스트를 먼저 깨 주세요",
  },
} as const satisfies Record<OnboardingQuest, unknown>;

export interface QuestCardData {
  quest: OnboardingQuest;
  title: string;
  description: string;
  required: boolean;
  path: string;
  state: QuestState;
  lockedReason: string | null;
}

function questState({
  quest,
  cleared,
}: {
  quest: OnboardingQuest;
  cleared: readonly OnboardingQuest[];
}): QuestState {
  if (cleared.includes(quest)) return QUEST_STATE.cleared;
  return isQuestUnlocked(quest, cleared) ? QUEST_STATE.open : QUEST_STATE.locked;
}

// 해금과 클리어 판정은 클리어 기록 한 곳에서 파생한다.
export function toQuestCards(cleared: readonly OnboardingQuest[]): QuestCardData[] {
  return ONBOARDING_QUESTS.map((quest) => {
    return { quest, ...QUEST_META[quest], state: questState({ quest, cleared }) };
  });
}
