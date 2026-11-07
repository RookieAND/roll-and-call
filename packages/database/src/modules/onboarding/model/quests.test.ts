import { describe, expect, it } from "vitest";

import {
  isAllQuestsCleared,
  isQuestUnlocked,
  nextQuestInTrack,
  ONBOARDING_QUEST,
  ONBOARDING_TRACK,
  questsByTrack,
} from "./quests";

describe("퀘스트 해금", () => {
  it("처음에는 첫 신청과 룰북 인증이 열려 있다", () => {
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstApply, [])).toBe(true);
    expect(isQuestUnlocked(ONBOARDING_QUEST.rulebookCert, [])).toBe(true);
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstReview, [])).toBe(false);
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstRecruit, [])).toBe(false);
  });

  it("첫 후기는 첫 신청 뒤, 첫 모집은 룰북 인증 뒤에 열린다", () => {
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstReview, [ONBOARDING_QUEST.firstApply])).toBe(true);
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstRecruit, [ONBOARDING_QUEST.firstApply])).toBe(
      false,
    );
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstRecruit, [ONBOARDING_QUEST.rulebookCert])).toBe(
      true,
    );
  });

  it("네 개가 모두 있어야 모두 깬 것이다", () => {
    const three = [
      ONBOARDING_QUEST.firstApply,
      ONBOARDING_QUEST.firstReview,
      ONBOARDING_QUEST.rulebookCert,
    ];
    expect(isAllQuestsCleared(three)).toBe(false);
    expect(isAllQuestsCleared([...three, ONBOARDING_QUEST.firstRecruit])).toBe(true);
  });
});

describe("퀘스트 갈래", () => {
  it("참여하기와 모집하기로 순서대로 묶는다", () => {
    expect(questsByTrack()).toEqual([
      {
        track: ONBOARDING_TRACK.join,
        quests: [ONBOARDING_QUEST.firstApply, ONBOARDING_QUEST.firstReview],
      },
      {
        track: ONBOARDING_TRACK.recruit,
        quests: [ONBOARDING_QUEST.rulebookCert, ONBOARDING_QUEST.firstRecruit],
      },
    ]);
  });
});

describe("같은 갈래의 다음 퀘스트", () => {
  it("갈래 안에서만 다음으로 가고, 마지막이면 없다", () => {
    expect(nextQuestInTrack(ONBOARDING_QUEST.firstApply)).toBe(ONBOARDING_QUEST.firstReview);
    expect(nextQuestInTrack(ONBOARDING_QUEST.firstReview)).toBeNull();
    expect(nextQuestInTrack(ONBOARDING_QUEST.rulebookCert)).toBe(ONBOARDING_QUEST.firstRecruit);
    expect(nextQuestInTrack(ONBOARDING_QUEST.firstRecruit)).toBeNull();
  });
});
