import { describe, expect, it } from "vitest";

import type { MonthSessionRow } from "@/shared/server";

import { buildMonthRecord } from "./build-month-record";

const START = new Date("2026-09-10T11:00:00Z");
const NOW = new Date("2026-09-20T00:00:00Z");

type Participant = MonthSessionRow["participants"][number];

const person = (id: string) => ({ id, username: id, avatarUrl: null });

const player = (id: string, overrides: Partial<Participant> = {}): Participant => ({
  userId: id,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  user: person(id),
  ...overrides,
});

const row = (overrides: Partial<MonthSessionRow> = {}) =>
  ({
    id: "game",
    gmId: "gm",
    gm: person("gm"),
    confirmedAt: START,
    playMinutes: 120,
    endedAt: null,
    hiddenAt: null,
    cancelledAt: null,
    attendanceConfirmedAt: null,
    participants: [player("p1")],
    ...overrides,
  }) as MonthSessionRow;

const ids = (people: { id: string }[]) => people.map((target) => target.id);

describe("buildMonthRecord", () => {
  it("취소·숨김·무산·아직 안 끝난 세션은 건수와 순위에서 빠진다", () => {
    const record = buildMonthRecord({
      rows: [
        row({ id: "cancelled", gmId: "a", gm: person("a"), cancelledAt: START }),
        row({ id: "hidden", gmId: "b", gm: person("b"), hiddenAt: START }),
        row({ id: "empty", gmId: "c", gm: person("c"), participants: [] }),
        row({ id: "running", gmId: "d", gm: person("d"), confirmedAt: new Date(NOW) }),
      ],
      now: NOW,
    });
    expect(record.sessionCount).toBe(0);
    expect(record.gms.leaders).toEqual([]);
    expect(record.players.leaders).toEqual([]);
  });

  it("출석 확인 전에 끝난 세션도 세고, 불참자는 빼되 운영진이 취소한 불참은 센다", () => {
    const record = buildMonthRecord({
      rows: [
        row({
          participants: [
            player("present"),
            player("absent", { absent: true }),
            player("forgiven", { absent: true, absenceCancelledAt: START }),
            player("removed", { status: "removed", absent: true }),
          ],
        }),
      ],
      now: NOW,
    });
    expect(record.sessionCount).toBe(1);
    expect(ids(record.gms.leaders)).toEqual(["gm"]);
    expect(ids(record.players.leaders)).toEqual(["present", "forgiven"]);
    expect(record.players.leaderCount).toBe(1);
  });

  it("1위 동점자는 2위 줄에 다시 나오지 않는다", () => {
    const record = buildMonthRecord({
      rows: [
        row({ id: "one", participants: [player("a"), player("b"), player("c")] }),
        row({ id: "two", participants: [player("a"), player("b")] }),
      ],
      now: NOW,
    });
    expect(ids(record.players.leaders)).toEqual(["a", "b"]);
    expect(record.players.runnersUp.map((runnerUp) => runnerUp?.person.id ?? null)).toEqual([
      "c",
      null,
    ]);
  });
});
