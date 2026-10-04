import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { APPLICATION_CLOSED_MESSAGE } from "@/shared/api";

import { availabilityBlockReason } from "./availability-block-reason";

const GM = "gm";
const game = {
  scheduleMode: SCHEDULE_MODE.coordinate,
  confirmedAt: null,
  cancelledAt: null,
  recruitMethod: RECRUIT_METHOD.lottery,
  drawnAt: new Date("2026-09-10T00:00:00Z"),
  gmId: GM,
};
const participants = [
  { userId: "confirmed", status: PARTICIPANT_STATUS.confirmed },
  { userId: "waiting", status: PARTICIPANT_STATUS.waiting },
  { userId: "removed", status: PARTICIPANT_STATUS.removed },
];
const PARTICIPANTS_ONLY = "참여자만 가능 시간을 등록할 수 있습니다.";

describe("availabilityBlockReason", () => {
  it("추첨 전이면 GM도 막는다", () => {
    expect(
      availabilityBlockReason({ game: { ...game, drawnAt: null }, participants, userId: GM }),
    ).toBe("추첨 뒤에 가능 시간을 낼 수 있습니다.");
  });

  it("추첨 뒤 확정자와 GM은 통과한다", () => {
    expect(availabilityBlockReason({ game, participants, userId: "confirmed" })).toBeNull();
    expect(availabilityBlockReason({ game, participants, userId: GM })).toBeNull();
  });

  it("대기자·내보낸 사람·모르는 사람은 막는다", () => {
    for (const userId of ["waiting", "removed", "stranger"]) {
      expect(availabilityBlockReason({ game, participants, userId })).toBe(PARTICIPANTS_ONLY);
    }
  });

  it("시각이 정해지면 신청 닫힘 문구다", () => {
    expect(
      availabilityBlockReason({
        game: { ...game, confirmedAt: new Date() },
        participants,
        userId: "confirmed",
      }),
    ).toBe(APPLICATION_CLOSED_MESSAGE);
  });

  it("일시 지정형은 조율 대상이 아니다", () => {
    expect(
      availabilityBlockReason({
        game: { ...game, scheduleMode: SCHEDULE_MODE.fixed },
        participants,
        userId: GM,
      }),
    ).toBe("일시가 지정된 구인은 조율 대상이 아닙니다.");
  });
});
