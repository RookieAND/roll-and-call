import { describe, expect, it } from "vitest";

import { planAttendance, type AttendanceRosterRow } from "./attendance-changes";

const at = new Date("2026-09-20T00:00:00Z");
const row = (
  userId: string,
  overrides: Partial<AttendanceRosterRow> = {},
): AttendanceRosterRow => ({
  userId,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  absenceAddedAt: null,
  ...overrides,
});

describe("planAttendance", () => {
  it("확정자를 불참으로 지정하면 사유를 남기고, 공백뿐인 사유는 null이다", () => {
    const { updates, changes } = planAttendance({
      rows: [row("a"), row("b"), row("c")],
      absences: [
        { userId: "a", reason: "  연락 없음 " },
        { userId: "b", reason: "   " },
      ],
    });
    expect(updates).toEqual([
      { userId: "a", status: "confirmed", absent: true, absenceReason: "연락 없음" },
      { userId: "b", status: "confirmed", absent: true, absenceReason: null },
      { userId: "c", status: "confirmed", absent: false, absenceReason: null },
    ]);
    expect(changes).toEqual({ newlyAbsent: ["a", "b"], newlyPresent: [], restored: [] });
  });

  it("내보낸 사람을 참석으로 두면 확정으로 돌아오고 사유는 지운다", () => {
    const { updates, changes } = planAttendance({
      rows: [row("a", { status: "removed", absent: true })],
      absences: [],
    });
    expect(updates).toEqual([
      { userId: "a", status: "confirmed", absent: false, absenceReason: null },
    ]);
    expect(changes).toEqual({ newlyAbsent: [], newlyPresent: ["a"], restored: ["a"] });
  });

  it("내보낸 사람을 불참 그대로 두면 removed로 남고 사유를 쓴다", () => {
    const kept = planAttendance({
      rows: [row("a", { status: "removed", absent: true })],
      absences: [{ userId: "a", reason: "노쇼" }],
    });
    expect(kept.updates).toEqual([
      { userId: "a", status: "removed", absent: true, absenceReason: "노쇼" },
    ]);
    expect(kept.changes).toEqual({ newlyAbsent: [], newlyPresent: [], restored: [] });

    const changed = planAttendance({
      rows: [row("a", { status: "removed", absent: true })],
      absences: [{ userId: "a", reason: "바꾼 사유" }],
    });
    expect(changed.updates[0]?.absenceReason).toBe("바꾼 사유");
  });

  it("운영진이 추가한 불참은 입력과 상관없이 그대로 둔다", () => {
    const added = row("a", { absent: true, absenceAddedAt: at });
    expect(planAttendance({ rows: [added], absences: [] })).toEqual({
      updates: [],
      changes: { newlyAbsent: [], newlyPresent: [], restored: [] },
    });
    expect(
      planAttendance({ rows: [added], absences: [{ userId: "a", reason: "x" }] }).updates,
    ).toEqual([]);
  });

  it("운영진이 취소한 불참은 absent만 바뀐다(취소 흔적은 쓰지 않는다)", () => {
    const { updates, changes } = planAttendance({
      rows: [row("a", { absenceCancelledAt: at })],
      absences: [{ userId: "a", reason: null }],
    });
    expect(updates).toEqual([
      { userId: "a", status: "confirmed", absent: true, absenceReason: null },
    ]);
    expect(updates[0]).not.toHaveProperty("absenceCancelledAt");
    expect(changes.newlyAbsent).toEqual(["a"]);
  });

  it("이미 불참이던 사람은 newlyAbsent에, 참석이던 사람은 newlyPresent에 들지 않는다", () => {
    const { changes } = planAttendance({
      rows: [row("a", { absent: true }), row("b"), row("c", { absent: true })],
      absences: [{ userId: "a", reason: null }],
    });
    expect(changes).toEqual({ newlyAbsent: [], newlyPresent: ["c"], restored: [] });
  });
});
