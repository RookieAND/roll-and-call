import { describe, expect, it } from "vitest";

import { addRoundError } from "./add-round-error";

const HOUR = 3_600_000;
const now = new Date("2026-12-01T00:00:00Z");
const lastRound = {
  plannedEndAt: new Date("2026-12-05T14:00:00Z"),
  endedAt: null,
  attendanceConfirmedAt: null,
};
const at = (iso: string) => new Date(iso);

describe("회차 추가 입력 오류", () => {
  it("맨 뒤 회차가 끝난 뒤의 일시면 통과한다", () => {
    expect(
      addRoundError({
        lastRound,
        startsAt: at("2026-12-12T10:00:00Z"),
        endsAt: at("2026-12-12T14:00:00Z"),
        now,
      }),
    ).toBeNull();
  });

  it("시각 순서·길이·겹침·확정 뒤를 막는다", () => {
    const start = at("2026-12-12T10:00:00Z");
    expect(addRoundError({ lastRound, startsAt: start, endsAt: start, now })).toBe(
      "종료 시각은 시작 시각보다 뒤여야 합니다.",
    );
    expect(
      addRoundError({
        lastRound,
        startsAt: start,
        endsAt: new Date(start.getTime() + 25 * HOUR),
        now,
      }),
    ).toBe("한 회차는 24시간을 넘을 수 없습니다.");
    expect(
      addRoundError({
        lastRound,
        startsAt: at("2026-12-05T13:00:00Z"),
        endsAt: at("2026-12-05T16:00:00Z"),
        now,
      }),
    ).toBe("앞 회차와 시간이 겹칩니다.");
    expect(
      addRoundError({
        lastRound: { ...lastRound, attendanceConfirmedAt: at("2026-12-05T15:00:00Z") },
        startsAt: start,
        endsAt: new Date(start.getTime() + HOUR),
        now,
      }),
    ).toBe("마지막 회차 출석을 확정한 뒤에는 회차를 더할 수 없습니다.");
  });
});
