import { describe, expect, it } from "vitest";

import { countsForRanking } from "./counts-for-ranking";
import type { RecordGame } from "./record-session";

const player = (userId: string, absent = false) => ({
  userId,
  status: "confirmed",
  absent,
  absenceCancelledAt: null,
});
const game = (participants: RecordGame["participants"]): RecordGame => ({
  id: "g",
  gmId: "gm",
  confirmedAt: null,
  playMinutes: null,
  endedAt: null,
  hiddenAt: null,
  cancelledAt: null,
  participants,
});

describe("countsForRanking", () => {
  it("참석자가 1명인 타이만은 뺀다", () => {
    expect(countsForRanking(game([player("a")]))).toBe(false);
    expect(countsForRanking(game([player("a"), player("b", true)]))).toBe(false);
  });
  it("2명 이상이면 센다", () => {
    expect(countsForRanking(game([player("a"), player("b")]))).toBe(true);
  });
});
