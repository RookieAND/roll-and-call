import { expect, it } from "vitest";

import { formatRecruitHeadcount } from "./format-recruit-headcount";

it("최소 인원이 있으면 덧붙이고 없거나 0이면 생략한다", () => {
  expect(
    formatRecruitHeadcount({ game: { maxPlayers: 5, minPlayers: 4 }, confirmedCount: 2 }),
  ).toBe("2/5명 (최소 4명)");
  expect(
    formatRecruitHeadcount({ game: { maxPlayers: 5, minPlayers: null }, confirmedCount: 2 }),
  ).toBe("2/5명");
  expect(
    formatRecruitHeadcount({ game: { maxPlayers: 5, minPlayers: 0 }, confirmedCount: 2 }),
  ).toBe("2/5명");
});
