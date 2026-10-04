import { describe, expect, it } from "vitest";

import { canViewHiddenGame } from "./can-view-hidden-game";

const hidden = {
  hiddenAt: new Date("2026-09-14T00:00:00Z"),
  gmId: "gm",
  participants: [{ userId: "confirmed" }, { userId: "waiting" }, { userId: "removed" }],
};

describe("canViewHiddenGame", () => {
  it("숨기지 않은 구인은 누구나 본다", () => {
    expect(canViewHiddenGame({ game: { ...hidden, hiddenAt: null }, viewerId: null })).toBe(true);
  });

  it("GM과 참여 행이 있는 사람은 숨긴 구인도 본다", () => {
    for (const viewerId of ["gm", "confirmed", "waiting", "removed"]) {
      expect(canViewHiddenGame({ game: hidden, viewerId })).toBe(true);
    }
  });

  it("비참여자와 비로그인은 숨긴 구인을 보지 못한다", () => {
    expect(canViewHiddenGame({ game: hidden, viewerId: "outsider" })).toBe(false);
    expect(canViewHiddenGame({ game: hidden, viewerId: null })).toBe(false);
  });
});
