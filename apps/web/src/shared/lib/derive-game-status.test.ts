import { describe, expect, it } from "vitest";

import { deriveGameStatus } from "./derive-game-status";
import { GAME_STATUS } from "./game-status";

const DAY = 86_400_000;
const future = new Date(Date.now() + DAY);
const past = new Date(Date.now() - DAY);

describe("deriveGameStatus", () => {
  it("기한이 지나면 정원이 남아 있어도 마감이다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: past,
        participantCount: 4,
        waitlistEnabled: true,
        scheduleMode: "coordinate",
        confirmedAt: null,
      }),
    ).toBe(GAME_STATUS.closed);
  });

  it("정원이 찼지만 대기를 받으면 대기 접수 중이다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: future,
        participantCount: 4,
        waitlistEnabled: true,
        scheduleMode: "coordinate",
        confirmedAt: null,
      }),
    ).toBe(GAME_STATUS.confirmed);
  });

  it("자리가 남아 있으면 모집 중이다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: future,
        participantCount: 1,
        waitlistEnabled: true,
        scheduleMode: "coordinate",
        confirmedAt: null,
      }),
    ).toBe(GAME_STATUS.recruiting);
  });

  it("대기를 받지 않는데 정원이 차면 신청이 막힌다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: future,
        participantCount: 4,
        waitlistEnabled: false,
        scheduleMode: "coordinate",
        confirmedAt: null,
      }),
    ).toBe(GAME_STATUS.full);
  });

  it("기한 경과가 대기 설정보다 앞선다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: past,
        participantCount: 4,
        waitlistEnabled: false,
        scheduleMode: "coordinate",
        confirmedAt: null,
      }),
    ).toBe(GAME_STATUS.closed);
  });

  it("조율형은 일정을 확정하면 정원이 덜 차도 일정 확정이다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: future,
        participantCount: 2,
        waitlistEnabled: true,
        scheduleMode: "coordinate",
        confirmedAt: future,
      }),
    ).toBe(GAME_STATUS.scheduled);
  });

  it("조율형의 일정 확정이 기한 경과보다 앞선다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: past,
        participantCount: 4,
        waitlistEnabled: true,
        scheduleMode: "coordinate",
        confirmedAt: future,
      }),
    ).toBe(GAME_STATUS.scheduled);
  });

  it("일시 지정형은 정원이 차도 대기를 받는다", () => {
    expect(
      deriveGameStatus({
        maxPlayers: 4,
        endDate: future,
        participantCount: 4,
        waitlistEnabled: true,
        scheduleMode: "fixed",
        confirmedAt: future,
      }),
    ).toBe(GAME_STATUS.confirmed);
  });
});
