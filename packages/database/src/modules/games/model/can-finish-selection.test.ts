import { describe, expect, it } from "vitest";

import { finishSelectionBlock } from "./can-finish-selection";

describe("finishSelectionBlock", () => {
  it("확정자가 0명이면 막는다", () => {
    expect(finishSelectionBlock({ minPlayers: null, confirmedCount: 0, applicantCount: 5 })).toBe(
      "no_confirmed",
    );
  });

  it("확정자가 1명 이상이면 통과한다", () => {
    expect(
      finishSelectionBlock({ minPlayers: null, confirmedCount: 1, applicantCount: 0 }),
    ).toBeNull();
  });

  it("신청자 수(확정 + 신청)가 최소 인원보다 적으면 막고 같으면 통과한다", () => {
    expect(finishSelectionBlock({ minPlayers: 3, confirmedCount: 1, applicantCount: 1 })).toBe(
      "min_players_unmet",
    );
    expect(
      finishSelectionBlock({ minPlayers: 3, confirmedCount: 1, applicantCount: 2 }),
    ).toBeNull();
  });

  it("둘이 겹치면 최소 인원 미달을 먼저 보인다", () => {
    expect(finishSelectionBlock({ minPlayers: 3, confirmedCount: 0, applicantCount: 1 })).toBe(
      "min_players_unmet",
    );
  });
});
