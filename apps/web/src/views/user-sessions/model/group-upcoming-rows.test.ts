import { describe, expect, it } from "vitest";

import { groupUpcomingRows, UNDATED_GROUP_KEY } from "./group-upcoming-rows";
import type { UpcomingRow } from "./upcoming-row";

const row = (id: string, startsAt: string | null) =>
  ({ id, startsAt: startsAt ? new Date(startsAt) : null }) as UpcomingRow;

describe("groupUpcomingRows", () => {
  it("KST 날짜별로 묶고 일정 없는 줄은 마지막 묶음이다", () => {
    const groups = groupUpcomingRows([
      row("a", "2026-11-25T10:00:00+09:00"),
      row("b", "2026-11-25T20:00:00+09:00"),
      row("c", "2026-11-26T00:30:00+09:00"),
      row("d", null),
    ]);
    expect(groups.map((group) => [group.key, group.rows.map((item) => item.id)])).toEqual([
      ["2026-11-25", ["a", "b"]],
      ["2026-11-26", ["c"]],
      [UNDATED_GROUP_KEY, ["d"]],
    ]);
  });
});
