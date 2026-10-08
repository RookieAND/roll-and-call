import { ONBOARDING_QUEST } from "@roll-and-call/database/onboarding/model";
import { describe, expect, it } from "vitest";

import { QUEST_STATE, toQuestCards } from "./quest-card";

const states = (cleared: Parameters<typeof toQuestCards>[0]) =>
  toQuestCards(cleared).map((card) => card.state);

describe("퀘스트 카드 상태", () => {
  it("연결 직후에는 첫 신청만 열려 있다", () => {
    expect(states([])).toEqual([
      QUEST_STATE.open,
      QUEST_STATE.locked,
      QUEST_STATE.locked,
      QUEST_STATE.locked,
    ]);
  });

  it("첫 신청을 깨면 첫 후기와 룰북 인증이 열린다", () => {
    expect(states([ONBOARDING_QUEST.firstApply])).toEqual([
      QUEST_STATE.cleared,
      QUEST_STATE.open,
      QUEST_STATE.open,
      QUEST_STATE.locked,
    ]);
  });

  it("룰북 인증을 깨면 첫 모집이 열린다", () => {
    expect(states([ONBOARDING_QUEST.firstApply, ONBOARDING_QUEST.rulebookCert])).toEqual([
      QUEST_STATE.cleared,
      QUEST_STATE.open,
      QUEST_STATE.cleared,
      QUEST_STATE.open,
    ]);
  });
});
