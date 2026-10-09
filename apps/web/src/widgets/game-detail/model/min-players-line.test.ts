import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD } from "@/entities/game";

import { minPlayersLine } from "./min-players-line";

const now = new Date("2026-09-20T00:00:00Z");
const firstCome = RECRUIT_METHOD.firstCome;
const future = new Date("2026-09-25T00:00:00Z");

describe("minPlayersLine", () => {
  it("최소 인원이 있고 마감 전이면 취소 조건을 알린다", () => {
    expect(minPlayersLine({ minPlayers: 3, endDate: future, now, recruitMethod: firstCome })).toBe(
      "확정 참여자가 3명 미만이면 모집이 취소됩니다.",
    );
    expect(
      minPlayersLine({
        minPlayers: 3,
        endDate: future,
        now,
        recruitMethod: RECRUIT_METHOD.lottery,
      }),
    ).toBe("추첨 전 신청자가 3명 미만이면 모집이 취소됩니다.");
  });

  it("선발은 신청자 기준 문구", () => {
    expect(
      minPlayersLine({
        minPlayers: 2,
        endDate: future,
        now,
        recruitMethod: RECRUIT_METHOD.selection,
      }),
    ).toBe("신청자가 2명 미만이면 모집이 취소됩니다.");
  });

  it("최소 인원이 없으면 줄이 없다", () => {
    expect(
      minPlayersLine({ minPlayers: null, endDate: future, now, recruitMethod: firstCome }),
    ).toBeNull();
  });

  it("마감이 지났거나 마감 시각이면 줄이 없다", () => {
    expect(
      minPlayersLine({
        minPlayers: 3,
        endDate: new Date("2026-09-19T00:00:00Z"),
        now,
        recruitMethod: firstCome,
      }),
    ).toBeNull();
    expect(
      minPlayersLine({ minPlayers: 3, endDate: now, now, recruitMethod: firstCome }),
    ).toBeNull();
  });
});
