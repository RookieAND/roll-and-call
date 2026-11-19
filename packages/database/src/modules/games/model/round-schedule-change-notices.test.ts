import { describe, expect, it } from "vitest";

import { roundScheduleChangeNotices } from "./round-schedule-change-notices";

const WEEK = 7 * 86_400_000;
const at = (iso: string) => new Date(iso);

describe("회차 일정 변경 알림", () => {
  it("이후 회차를 함께 옮기면 받는 사람마다 묶음 알림 한 건만 더한다", () => {
    const notices = roundScheduleChangeNotices({
      game: { id: "g1", title: "campaign" },
      userIds: ["a", "b"],
      moved: {
        roundNo: 4,
        startsAt: at("2026-11-07T03:00:00Z"),
        endsAt: at("2026-11-07T07:00:00Z"),
      },
      later: {
        rounds: [5, 6].map((roundNo) => ({
          roundNo,
          startsAt: at("2026-11-14T03:00:00Z"),
          endsAt: at("2026-11-14T07:00:00Z"),
        })),
        shiftMs: WEEK,
      },
    });
    expect(notices.map((notice) => [notice.userId, notice.kind])).toEqual([
      ["a", "round_schedule_changed"],
      ["a", "later_rounds_changed"],
      ["b", "round_schedule_changed"],
      ["b", "later_rounds_changed"],
    ]);
    expect(notices[1]!.params).toMatchObject({ fromRoundNo: 5, toRoundNo: 6, shiftMs: WEEK });
  });

  it("그 회차만 옮기면 한 건이다", () => {
    const notices = roundScheduleChangeNotices({
      game: { id: "g1", title: "campaign" },
      userIds: ["a"],
      moved: {
        roundNo: 4,
        startsAt: at("2026-11-07T03:00:00Z"),
        endsAt: at("2026-11-07T07:00:00Z"),
      },
    });
    expect(notices).toHaveLength(1);
  });
});
