import { ONBOARDING_QUEST, ONBOARDING_TRACK } from "@roll-and-call/database/onboarding/model";
import { describe, expect, it } from "vitest";

import { QUEST_STATE, toQuestTracks } from "./quest-card";

const states = (cleared: Parameters<typeof toQuestTracks>[0]) =>
  toQuestTracks(cleared).map(({ track, cards }) => [track, cards.map((card) => card.state)]);

describe("퀘스트 카드 상태", () => {
  it("연결 직후에는 갈래마다 첫 퀘스트만 열려 있다", () => {
    expect(states([])).toEqual([
      [ONBOARDING_TRACK.join, [QUEST_STATE.open, QUEST_STATE.locked]],
      [ONBOARDING_TRACK.recruit, [QUEST_STATE.open, QUEST_STATE.locked]],
    ]);
  });

  it("첫 신청을 깨면 첫 후기가 열린다", () => {
    expect(states([ONBOARDING_QUEST.firstApply])).toEqual([
      [ONBOARDING_TRACK.join, [QUEST_STATE.cleared, QUEST_STATE.open]],
      [ONBOARDING_TRACK.recruit, [QUEST_STATE.open, QUEST_STATE.locked]],
    ]);
  });

  it("룰북 인증을 깨면 첫 모집이 열린다", () => {
    expect(states([ONBOARDING_QUEST.rulebookCert])).toEqual([
      [ONBOARDING_TRACK.join, [QUEST_STATE.open, QUEST_STATE.locked]],
      [ONBOARDING_TRACK.recruit, [QUEST_STATE.cleared, QUEST_STATE.open]],
    ]);
  });
});
