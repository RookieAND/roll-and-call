import {
  isQuestUnlocked,
  ONBOARDING_QUEST,
  ONBOARDING_TRACK,
  questsByTrack,
  type OnboardingQuest,
  type OnboardingTrack,
} from "@roll-and-call/database/onboarding/model";

import { QUEST_PATH } from "@/shared/lib";

export const QUEST_STATE = { open: "open", cleared: "cleared", locked: "locked" } as const;
export type QuestState = (typeof QUEST_STATE)[keyof typeof QUEST_STATE];

// 카드 문구는 시안 21 v2(U17-14)를 따른다. 설명은 「배우는 것」 한 줄이다.
const QUEST_META = {
  [ONBOARDING_QUEST.firstApply]: {
    title: "첫 신청",
    learn: "구인에 신청하면 결과를 어떻게 받는지 알아봅니다.",
    duration: "약 1분",
    lockedReason: null,
  },
  [ONBOARDING_QUEST.firstReview]: {
    title: "첫 후기",
    learn: "세션이 끝난 뒤 후기를 남기는 법을 알아봅니다.",
    duration: "약 1분",
    lockedReason: "첫 신청을 깨면 열립니다. 신청한 구인으로 후기를 써 봅니다.",
  },
  [ONBOARDING_QUEST.rulebookCert]: {
    title: "룰북 인증",
    learn: "룰북을 인증하면 구인을 열 수 있는 이유를 알아봅니다.",
    duration: "약 2분",
    lockedReason: null,
  },
  [ONBOARDING_QUEST.firstRecruit]: {
    title: "첫 모집",
    learn: "내 구인을 열고 운영하는 순서를 알아봅니다.",
    duration: "약 2분",
    lockedReason: "룰북 인증을 깨면 열립니다. 체험용 룰북으로 구인을 엽니다.",
  },
} as const satisfies Record<OnboardingQuest, unknown>;

export const QUEST_TRACK_LABEL = {
  [ONBOARDING_TRACK.join]: "참여하기",
  [ONBOARDING_TRACK.recruit]: "모집하기",
} as const satisfies Record<OnboardingTrack, string>;

export interface QuestCardData {
  quest: OnboardingQuest;
  title: string;
  learn: string;
  duration: string;
  path: string;
  state: QuestState;
  lockedReason: string | null;
  lockedHint: string | null;
}

export interface QuestTrackCards {
  track: OnboardingTrack;
  cards: QuestCardData[];
}

// 목록 줄에는 잠긴 이유의 첫 문장만 보인다.
function toLockedHint(lockedReason: string | null) {
  return lockedReason?.match(/^[^.]*\./)?.[0] ?? null;
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

// 해금과 클리어 판정은 클리어 기록 한 곳에서 파생하고, 갈래별로 묶어 돌려준다.
export function toQuestTracks(cleared: readonly OnboardingQuest[]): QuestTrackCards[] {
  return questsByTrack().map(({ track, quests }) => ({
    track,
    cards: quests.map((quest) => ({
      quest,
      ...QUEST_META[quest],
      lockedHint: toLockedHint(QUEST_META[quest].lockedReason),
      path: QUEST_PATH[quest],
      state: questState({ quest, cleared }),
    })),
  }));
}
