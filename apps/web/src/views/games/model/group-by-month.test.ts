import { describe, expect, it } from "vitest";

import { groupByMonth } from "./group-by-month";
import { pastFinishedAt } from "./past-finished-at";

const now = new Date("2026-09-24T00:00:00+09:00");
const at = (iso: string) => ({ at: new Date(iso) });

describe("groupByMonth", () => {
  it("이어진 같은 달을 한 묶음으로, 올해가 아니면 연도를 붙인다", () => {
    const groups = groupByMonth({
      items: [
        at("2026-09-12T12:00:00+09:00"),
        at("2026-08-17T12:00:00+09:00"),
        at("2026-08-03T12:00:00+09:00"),
        at("2025-12-20T12:00:00+09:00"),
      ],
      finishedAt: (item) => item.at,
      now,
    });
    expect(groups.map((group) => [group.label, group.items.length])).toEqual([
      ["9월", 1],
      ["8월", 2],
      ["2025년 12월", 1],
    ]);
  });

  it("취소된 구인은 세션 예정일이 아니라 취소한 달로 묶인다", () => {
    const pastGame = (fields: Partial<Parameters<typeof pastFinishedAt>[0]>) => ({
      confirmedAt: null,
      playMinutes: null,
      endedAt: null,
      cancelledAt: null,
      endDate: new Date("2026-08-10T12:00:00+09:00"),
      ...fields,
    });
    const groups = groupByMonth({
      items: [
        pastGame({
          confirmedAt: new Date("2026-11-01T20:00:00+09:00"),
          cancelledAt: new Date("2026-09-20T12:00:00+09:00"),
        }),
        pastGame({ confirmedAt: new Date("2026-08-03T20:00:00+09:00") }),
        pastGame({}),
      ],
      finishedAt: pastFinishedAt,
      now,
    });
    expect(groups.map((group) => [group.label, group.items.length])).toEqual([
      ["9월", 1],
      ["8월", 2],
    ]);
  });

  it("달 경계는 KST로 가른다", () => {
    const groups = groupByMonth({
      items: [at("2026-08-31T16:00:00Z")],
      finishedAt: (item) => item.at,
      now,
    });
    expect(groups[0]!.label).toBe("9월");
  });
});
