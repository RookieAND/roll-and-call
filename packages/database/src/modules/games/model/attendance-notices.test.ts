import { describe, expect, it } from "vitest";

import { autoConfirmNotices } from "./auto-confirm-notices";
import { gmAttendanceNotices } from "./gm-attendance-notices";

const at = new Date("2026-09-20T00:00:00Z");
const game = { id: "g", title: "물벼락", gmId: "gm" };
const params = { gameId: "g", gameTitle: "물벼락" };
const row = (userId: string, absent = false, absenceCancelledAt: Date | null = null) => ({
  userId,
  absent,
  absenceCancelledAt,
});
const noChanges = { newlyAbsent: [], newlyPresent: [], restored: [] };
const summary = (notices: { userId: string; kind: string }[]) =>
  notices.map((notice) => `${notice.kind}:${notice.userId}`);

describe("gmAttendanceNotices", () => {
  it("불참 기록만 알리고 후기 알림은 넣지 않는다", () => {
    const notices = gmAttendanceNotices({
      game,
      rows: [row("a", true), row("b"), row("c")],
      changes: { ...noChanges, newlyAbsent: ["a"] },
    });
    expect(summary(notices)).toEqual(["absence_recorded:a"]);
    expect(notices[0]?.params).toEqual(params);
  });

  it("불참→참석 정정은 불참 기록 취소만 알린다", () => {
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a"), row("b")],
          changes: { ...noChanges, newlyPresent: ["a"] },
        }),
      ),
    ).toEqual(["absence_cancelled:a"]);
  });

  it("운영진이 취소한 행은 불참 기록·취소 알림이 없다", () => {
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a", true, at), row("b", false, at)],
          changes: { ...noChanges, newlyAbsent: ["a"], newlyPresent: ["b"] },
        }),
      ),
    ).toEqual([]);
  });
});

describe("autoConfirmNotices", () => {
  it("GM에게만 자동 확정을 알린다", () => {
    expect(summary(autoConfirmNotices({ game, notifyGm: true }))).toEqual([
      "attendance_auto_confirmed:gm",
    ]);
  });

  it("notifyGm이 false면 알림이 없다", () => {
    expect(autoConfirmNotices({ game, notifyGm: false })).toEqual([]);
  });
});
