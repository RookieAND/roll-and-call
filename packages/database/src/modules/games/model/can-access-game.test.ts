import { describe, expect, it } from "vitest";

import { canAccessGame } from "./can-access-game";

const now = new Date("2026-11-01T00:00:00Z");
const base = {
  visibility: "private" as const,
  gmId: "gm",
  confirmedAt: new Date("2026-11-02T00:00:00Z"),
  playMinutes: 120,
  endedAt: null,
  participants: [
    { userId: "in", status: "confirmed" },
    { userId: "wait", status: "waiting" },
  ],
};

describe("canAccessGame", () => {
  it("공개 구인은 누구나 연다", () => {
    expect(canAccessGame({ game: { ...base, visibility: "public" }, viewerId: null, now })).toBe(
      true,
    );
  });

  it("끝나기 전 비공개 구인은 GM·확정 참여자·운영진만 연다", () => {
    expect(canAccessGame({ game: base, viewerId: "gm", now })).toBe(true);
    expect(canAccessGame({ game: base, viewerId: "in", now })).toBe(true);
    expect(canAccessGame({ game: base, viewerId: "x", isStaff: true, now })).toBe(true);
    expect(canAccessGame({ game: base, viewerId: "wait", now })).toBe(false);
    expect(canAccessGame({ game: base, viewerId: "x", now })).toBe(false);
    expect(canAccessGame({ game: base, viewerId: null, now })).toBe(false);
  });

  it("끝난 뒤에는 이 함수가 막지 않는다", () => {
    const ended = { ...base, confirmedAt: new Date("2026-10-30T00:00:00Z") };
    expect(canAccessGame({ game: ended, viewerId: null, now })).toBe(true);
  });
});
