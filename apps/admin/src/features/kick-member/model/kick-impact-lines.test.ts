import { describe, expect, it } from "vitest";

import { kickImpactLines } from "./kick-impact-lines";

describe("kickImpactLines", () => {
  it("빠지는 신청·대기·확정과 취소되는 구인 수를 시안 문장에 넣는다", () => {
    expect(
      kickImpactLines({
        appliedCount: 2,
        waitingCount: 1,
        confirmedCount: 1,
        cancelledGameCount: 1,
      }),
    ).toEqual([
      "진행 중인 참가 신청 2건과 대기 1건, 확정된 참여 1건에서 빠집니다",
      "GM으로 연 구인 중 시작 전인 1건은 취소됨으로 바뀌고, 참여자에게 알림이 갑니다",
      "지난 세션 기록과 불참 기록은 그대로 보존됩니다",
    ]);
  });
});
