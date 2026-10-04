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
  it("처음 확정: 불참 1명·참석 3명이면 불참 기록 1, 후기 3", () => {
    const notices = gmAttendanceNotices({
      game,
      rows: [row("a", true), row("b"), row("c"), row("d")],
      changes: { ...noChanges, newlyAbsent: ["a"] },
      firstConfirmation: true,
    });
    expect(summary(notices)).toEqual([
      "absence_recorded:a",
      "review_available:b",
      "review_available:c",
      "review_available:d",
    ]);
    expect(notices[0]?.params).toEqual(params);
  });

  it("내보낸 사람을 되돌리면 불참 기록 취소 1 + 후기 1(처음 확정)", () => {
    const notices = gmAttendanceNotices({
      game,
      rows: [row("a")],
      changes: { newlyAbsent: [], newlyPresent: ["a"], restored: ["a"] },
      firstConfirmation: true,
    });
    expect(summary(notices)).toEqual(["absence_cancelled:a", "review_available:a"]);
  });

  it("다시 확정: 참석→불참은 불참 기록만, 불참→참석은 취소와 후기", () => {
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a", true), row("b")],
          changes: { ...noChanges, newlyAbsent: ["a"] },
          firstConfirmation: false,
        }),
      ),
    ).toEqual(["absence_recorded:a"]);
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a"), row("b")],
          changes: { ...noChanges, newlyPresent: ["a"] },
          firstConfirmation: false,
        }),
      ),
    ).toEqual(["absence_cancelled:a", "review_available:a"]);
  });

  it("운영진이 취소한 행은 불참 기록·취소 알림이 없고, 참석으로 보아 후기를 받는다", () => {
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a", true, at)],
          changes: { ...noChanges, newlyAbsent: ["a"] },
          firstConfirmation: true,
        }),
      ),
    ).toEqual(["review_available:a"]);
    expect(
      summary(
        gmAttendanceNotices({
          game,
          rows: [row("a", false, at)],
          changes: { ...noChanges, newlyPresent: ["a"] },
          firstConfirmation: false,
        }),
      ),
    ).toEqual(["review_available:a"]);
  });

  it("GM은 명단에 없으므로 후기 알림을 받지 않는다", () => {
    const notices = gmAttendanceNotices({
      game,
      rows: [row("a")],
      changes: noChanges,
      firstConfirmation: true,
    });
    expect(notices.some((notice) => notice.userId === game.gmId)).toBe(false);
  });
});

describe("autoConfirmNotices", () => {
  const rows = [
    { ...row("a"), status: "confirmed" as const },
    { ...row("b", true, at), status: "confirmed" as const },
    { ...row("c", true), status: "confirmed" as const },
    { ...row("d", true), status: "removed" as const },
  ];

  it("GM에게 자동 확정 1, 참석인 확정 참여자에게 후기. 내보낸 사람은 받지 않는다", () => {
    expect(summary(autoConfirmNotices({ game, rows, notifyGm: true }))).toEqual([
      "attendance_auto_confirmed:gm",
      "review_available:a",
      "review_available:b",
    ]);
  });

  it("notifyGm이 false면 GM 알림이 없다", () => {
    expect(summary(autoConfirmNotices({ game, rows, notifyGm: false }))).toEqual([
      "review_available:a",
      "review_available:b",
    ]);
  });
});
