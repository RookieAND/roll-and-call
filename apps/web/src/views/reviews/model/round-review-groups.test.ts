import type { ReviewCardRow } from "@roll-and-call/database/reviews";
import { describe, expect, it } from "vitest";

import { roundReviewGroups } from "./round-review-groups";

const row = (id: string, roundNo: number) =>
  ({ id, roundNo, roundStartAt: new Date(`2026-12-0${roundNo}T03:00:00Z`) }) as ReviewCardRow;

describe("회차별 후기 묶음", () => {
  it("최근 회차가 위이고 후기 없는 회차는 묶음이 없다", () => {
    const groups = roundReviewGroups([row("a", 1), row("b", 3), row("c", 1)]);
    expect(groups.map((group) => [group.roundNo, group.rows.length])).toEqual([
      [3, 1],
      [1, 2],
    ]);
  });
});
