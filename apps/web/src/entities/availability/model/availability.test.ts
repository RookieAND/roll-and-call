import { describe, expect, it } from "vitest";

import { aggregateAvailability } from "./aggregate-availability";
import { rankWindows } from "./rank-windows";

const EARLY = new Date("2026-09-09T11:00:00.000Z");
const LATE = new Date("2026-09-10T11:00:00.000Z");

describe("aggregateAvailability", () => {
  const { counts, names, mine } = aggregateAvailability({
    avails: [
      { slotStart: EARLY, userId: "me", user: { username: "도윤" } },
      { slotStart: EARLY, userId: "u2", user: { username: "서진" } },
      { slotStart: LATE, userId: "u2", user: null },
    ],
    userId: "me",
  });

  it("칸마다 몇 명이 낼 수 있는지 센다", () => {
    expect(counts[EARLY.toISOString()]).toBe(2);
    expect(counts[LATE.toISOString()]).toBe(1);
  });

  it("이름 없는 사용자는 ?로 둔다", () => {
    expect(names[EARLY.toISOString()]).toEqual(["도윤", "서진"]);
    expect(names[LATE.toISOString()]).toEqual(["?"]);
  });

  it("내가 낸 칸을 따로 돌려준다", () => {
    expect(mine).toEqual([EARLY.toISOString()]);
  });

  it("비로그인은 내 칸이 없다", () => {
    expect(
      aggregateAvailability({
        avails: [{ slotStart: EARLY, userId: "u2", user: null }],
        userId: null,
      }).mine,
    ).toEqual([]);
  });
});

describe("rankWindows", () => {
  const names = {
    "2026-09-09T11:00:00.000Z": ["도윤", "서진"],
    "2026-09-09T11:30:00.000Z": ["도윤", "서진"],
    "2026-09-09T12:00:00.000Z": ["도윤"],
    "2026-09-10T11:00:00.000Z": ["서진"],
    "2026-09-10T11:30:00.000Z": ["서진"],
  };

  it("시작 칸부터 연속으로 다 낸 사람만 센다", () => {
    expect(rankWindows({ names, slotCount: 2, limit: 3 })).toEqual([
      { iso: "2026-09-09T11:00:00.000Z", members: ["도윤", "서진"] },
      { iso: "2026-09-09T11:30:00.000Z", members: ["도윤"] },
      { iso: "2026-09-10T11:00:00.000Z", members: ["서진"] },
    ]);
  });

  it("뒤 칸이 끊기면 후보가 아니다", () => {
    const candidates = rankWindows({ names, slotCount: 2, limit: 3 }).map((window) => window.iso);
    expect(candidates).not.toContain("2026-09-09T12:00:00.000Z");
  });
});
