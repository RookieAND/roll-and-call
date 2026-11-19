import { describe, expect, it } from "vitest";

import { laterRoundPreview } from "./later-round-preview";

const DAY_MS = 86_400_000;
const rounds = [5, 6, 7, 8, 9].map((roundNo, index) => ({
  roundNo,
  startsAt: new Date(Date.UTC(2026, 10, 7, 3) + index * 7 * DAY_MS).toISOString(),
}));

describe("이후 회차 미리보기", () => {
  it("같은 요일로 옮기면 요일이 바뀌지 않고 4줄 뒤는 외 n개다", () => {
    const preview = laterRoundPreview({ rounds, shiftMs: 7 * DAY_MS });
    expect(preview.lines).toHaveLength(4);
    expect(preview.lines[0]).toBe("5회차 · 11월 7일 (토) → 11월 14일 (토)");
    expect(preview.moreCount).toBe(1);
    expect(preview.weekdayChanged).toBe(false);
  });

  it("하루 옮기면 요일이 바뀐다", () => {
    expect(laterRoundPreview({ rounds, shiftMs: DAY_MS }).weekdayChanged).toBe(true);
  });
});
