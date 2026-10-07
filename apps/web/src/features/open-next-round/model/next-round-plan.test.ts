import { describe, expect, it } from "vitest";

import { isNextRoundStartValid } from "./is-next-round-start-valid";
import { nextRoundBaseDate } from "./next-round-base-date";
import { nextRoundColumns } from "./next-round-columns";
import { nextRoundDeadline } from "./next-round-deadline";
import { splitNextRoundRoster } from "./split-next-round-roster";

const now = new Date("2026-09-10T03:00:00Z");

describe("nextRoundBaseDate", () => {
  it("1회차 세션이 9월 20일이면 9월 21일부터 고른다", () => {
    expect(
      nextRoundBaseDate({ confirmedAt: new Date("2026-09-20T11:00:00Z"), rangeEnd: null, now }),
    ).toBe("2026-09-21");
  });

  it("KST로 날짜를 센다", () => {
    expect(
      nextRoundBaseDate({ confirmedAt: new Date("2026-09-20T16:00:00Z"), rangeEnd: null, now }),
    ).toBe("2026-09-22");
  });

  it("세션 시각이 없는 조율형은 조율 종료일 다음 날이다", () => {
    expect(nextRoundBaseDate({ confirmedAt: null, rangeEnd: "2026-09-25", now })).toBe(
      "2026-09-26",
    );
  });

  it("기준일이 지났으면 내일로 올린다", () => {
    expect(nextRoundBaseDate({ confirmedAt: null, rangeEnd: "2026-09-01", now })).toBe(
      "2026-09-11",
    );
  });
});

describe("isNextRoundStartValid", () => {
  it("세션 일시의 KST 날짜가 기준일부터면 허용한다", () => {
    expect(
      isNextRoundStartValid({
        baseDate: "2026-09-21",
        startsAt: new Date("2026-09-20T15:00:00Z"),
      }),
    ).toBe(true);
    expect(
      isNextRoundStartValid({
        baseDate: "2026-09-21",
        startsAt: new Date("2026-09-20T14:59:00Z"),
      }),
    ).toBe(false);
  });
});

describe("nextRoundDeadline", () => {
  it("일시 지정형은 세션 1시간 전이다", () => {
    expect(nextRoundDeadline({ startsAt: new Date("2026-09-21T11:00:00Z") })).toEqual(
      new Date("2026-09-21T10:00:00Z"),
    );
  });

  it("조율형은 조율 종료일 0시(KST) 1시간 전이다", () => {
    expect(nextRoundDeadline({ rangeEnd: "2026-09-21" })).toEqual(new Date("2026-09-20T14:00:00Z"));
  });
});

describe("splitNextRoundRoster", () => {
  it("대기 5명·정원 3명·정지 1명이면 확정 3명·대기 1명", () => {
    expect(
      splitNextRoundRoster({
        orderedIds: ["a", "b", "c", "d", "e"],
        excludedIds: ["b"],
        maxPlayers: 3,
      }),
    ).toEqual({ confirmed: ["a", "c", "d"], waiting: ["e"] });
  });
});

describe("nextRoundColumns", () => {
  it("최소 인원과 판정 표시를 이어받지 않는다", () => {
    const game = { id: "g", serverId: "s", createdAt: now, minPlayers: 3, minPlayersJudgedAt: now };
    const columns = nextRoundColumns({
      game: game as never,
      endDate: now,
      rangeStart: null,
      rangeEnd: null,
      confirmedAt: null,
    });
    expect(columns.minPlayers).toBeNull();
    expect(columns.minPlayersJudgedAt).toBeNull();
  });
});
