import { describe, expect, it } from "vitest";

import { isAllQuestsCleared, isQuestUnlocked, ONBOARDING_QUEST } from "./quests";

describe("퀘스트 해금", () => {
  it("처음에는 첫 신청만 열려 있다", () => {
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstApply, [])).toBe(true);
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstReview, [])).toBe(false);
    expect(isQuestUnlocked(ONBOARDING_QUEST.rulebookCert, [])).toBe(false);
    expect(isQuestUnlocked(ONBOARDING_QUEST.firstRecruit, [])).toBe(false);
  });

  it("첫 모집은 룰북 인증 뒤에 열린다", () => {
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
