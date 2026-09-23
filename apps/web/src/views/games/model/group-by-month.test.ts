import { describe, expect, it } from "vitest";

import { groupByMonth } from "./group-by-month";

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

  it("달 경계는 KST로 가른다", () => {
    const groups = groupByMonth({
      items: [at("2026-08-31T16:00:00Z")],
      finishedAt: (item) => item.at,
      now,
    });
    expect(groups[0]!.label).toBe("9월");
  });
});
