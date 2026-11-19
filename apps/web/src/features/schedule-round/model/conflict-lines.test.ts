import { describe, expect, it } from "vitest";

import { SCHEDULE_CONFLICT_REASON, type ScheduleConflictRejection } from "@/entities/game";

import { conflictLines, hasGmOverlap } from "./conflict-lines";

const entry = (userId: string, role: "gm" | "confirmed" | "waiting") => ({
  userId,
  role,
  roundNos: [3],
});
const conflict = (conflicts: ReturnType<typeof entry>[]): ScheduleConflictRejection => ({
  error: "",
  reason: SCHEDULE_CONFLICT_REASON,
  conflicts,
  gmOverlaps: [],
});
const nicknames = { a: "가", b: "나", c: "다", d: "라", g: "지엠" };

describe("겹침 줄", () => {
  it("3명까지 보이고 나머지는 외 n명, 대기 중 표시", () => {
    const result = conflictLines({
      conflict: conflict([
        entry("a", "confirmed"),
        entry("b", "waiting"),
        entry("c", "confirmed"),
        entry("d", "confirmed"),
      ]),
      nicknames,
      showRoundNos: true,
    });
    expect(result.lines).toHaveLength(3);
    expect(result.lines[0]?.text).toBe("3회차 · 가님은 이 시간에 다른 세션이 있습니다.");
    expect(result.lines[1]?.waiting).toBe(true);
    expect(result.moreCount).toBe(1);
    expect(result.hasWaiting).toBe(true);
  });

  it("GM 겹침은 줄에서 빠지고 따로 감지한다", () => {
    const rejection = conflict([entry("g", "gm")]);
    expect(conflictLines({ conflict: rejection, nicknames, showRoundNos: false }).lines).toEqual(
      [],
    );
    expect(hasGmOverlap(rejection)).toBe(true);
  });
});
