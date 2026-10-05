import { describe, expect, it } from "vitest";

import { countOpenLotterySeats } from "./count-open-lottery-seats";
import { shouldSkipLottery } from "./should-skip-lottery";

describe("shouldSkipLottery", () => {
  it.each([
    [3, 3, true],
    [2, 3, true],
    [4, 3, false],
    [0, 3, false],
    [0, 0, false],
  ])("신청 %i명·남은 자리 %i → %s", (applicantCount, openSeats, expected) => {
    expect(shouldSkipLottery({ applicantCount, openSeats })).toBe(expected);
  });

  it("직접 확정자가 있으면 남은 자리가 줄어든다", () => {
    const openSeats = countOpenLotterySeats({ maxPlayers: 5, confirmedCount: 2 });
    expect(openSeats).toBe(3);
    expect(shouldSkipLottery({ applicantCount: 3, openSeats })).toBe(true);
    expect(shouldSkipLottery({ applicantCount: 4, openSeats })).toBe(false);
  });

  it("정원을 넘어 확정된 경우 남은 자리는 0이다", () => {
    expect(countOpenLotterySeats({ maxPlayers: 4, confirmedCount: 6 })).toBe(0);
  });
});
