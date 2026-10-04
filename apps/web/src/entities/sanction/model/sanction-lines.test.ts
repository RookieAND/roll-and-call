import { describe, expect, it } from "vitest";

import { sanctionLines } from "./sanction-lines";

describe("sanctionLines", () => {
  it("기간이 있으면 KST 날짜까지로 쓴다", () => {
    expect(
      sanctionLines({ reason: "반복된 불참", until: new Date("2026-10-09T15:00:00Z") }),
    ).toEqual(["사유: 반복된 불참", "기간: 10월 10일까지"]);
    expect(
      sanctionLines({ reason: "반복된 불참", until: new Date("2026-10-09T14:59:00Z") }),
    ).toEqual(["사유: 반복된 불참", "기간: 10월 9일까지"]);
  });

  it("기간이 없으면 해제될 때까지로 쓴다", () => {
    expect(sanctionLines({ reason: "반복된 불참", until: null })).toEqual([
      "사유: 반복된 불참",
      "기간: 해제될 때까지",
    ]);
  });
});
