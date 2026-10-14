import { describe, expect, it } from "vitest";

import { isSecondTeamRangeValid } from "./is-second-team-range-valid";
import { isSecondTeamStartValid } from "./is-second-team-start-valid";
import { secondTeamBaseDate } from "./second-team-base-date";
import { secondTeamColumns } from "./second-team-columns";
import { secondTeamDeadline } from "./second-team-deadline";
import { splitSecondTeamRoster } from "./split-second-team-roster";

const now = new Date("2026-09-10T03:00:00Z");

describe("secondTeamBaseDate", () => {
  it("1회차 세션이 9월 20일이면 9월 21일부터 고른다", () => {
    expect(
      secondTeamBaseDate({ confirmedAt: new Date("2026-09-20T11:00:00Z"), rangeEnd: null, now }),
    ).toBe("2026-09-21");
  });

  it("KST로 날짜를 센다", () => {
    expect(
      secondTeamBaseDate({ confirmedAt: new Date("2026-09-20T16:00:00Z"), rangeEnd: null, now }),
    ).toBe("2026-09-22");
  });

  it("세션 시각이 없는 조율형은 조율 종료일 다음 날이다", () => {
    expect(secondTeamBaseDate({ confirmedAt: null, rangeEnd: "2026-09-25", now })).toBe(
      "2026-09-26",
    );
  });

  it("기준일이 지났으면 내일로 올린다", () => {
    expect(secondTeamBaseDate({ confirmedAt: null, rangeEnd: "2026-09-01", now })).toBe(
      "2026-09-11",
    );
  });
});

describe("isSecondTeamRangeValid", () => {
  const baseDate = "2026-09-21";

  it("시작일 포함 14일은 허용하고 15일은 거부한다", () => {
    expect(
      isSecondTeamRangeValid({ baseDate, rangeStart: "2026-09-21", rangeEnd: "2026-10-04" }),
    ).toBe(true);
    expect(
      isSecondTeamRangeValid({ baseDate, rangeStart: "2026-09-21", rangeEnd: "2026-10-05" }),
    ).toBe(false);
  });

  it("종료일이 시작일보다 앞이면 거부한다", () => {
    expect(
      isSecondTeamRangeValid({ baseDate, rangeStart: "2026-09-25", rangeEnd: "2026-09-24" }),
    ).toBe(false);
  });

  it("기준일보다 앞에서 시작하면 거부한다", () => {
    expect(
      isSecondTeamRangeValid({ baseDate, rangeStart: "2026-09-20", rangeEnd: "2026-09-24" }),
    ).toBe(false);
  });
});

describe("isSecondTeamStartValid", () => {
  it("세션 일시의 KST 날짜가 기준일부터면 허용한다", () => {
    expect(
      isSecondTeamStartValid({
        baseDate: "2026-09-21",
        startsAt: new Date("2026-09-20T15:00:00Z"),
      }),
    ).toBe(true);
    expect(
      isSecondTeamStartValid({
        baseDate: "2026-09-21",
        startsAt: new Date("2026-09-20T14:59:00Z"),
      }),
    ).toBe(false);
  });
});

describe("secondTeamDeadline", () => {
  it("일시 지정형은 세션 1시간 전이다", () => {
    expect(secondTeamDeadline({ startsAt: new Date("2026-09-21T11:00:00Z") })).toEqual(
      new Date("2026-09-21T10:00:00Z"),
    );
  });

  it("조율형은 조율 시작일 0시(KST) 1시간 전이다", () => {
    expect(secondTeamDeadline({ rangeStart: "2026-09-21" })).toEqual(
      new Date("2026-09-20T14:00:00Z"),
    );
  });
});

describe("splitSecondTeamRoster", () => {
  it("대기 5명·정원 3명·정지 1명이면 확정 3명·대기 1명", () => {
    expect(
      splitSecondTeamRoster({
        orderedIds: ["a", "b", "c", "d", "e"],
        excludedIds: ["b"],
        maxPlayers: 3,
      }),
    ).toEqual({ confirmed: ["a", "c", "d"], waiting: ["e"] });
  });
});

describe("secondTeamColumns", () => {
  it("최소 인원과 판정 표시를 이어받지 않는다", () => {
    const game = { id: "g", serverId: "s", createdAt: now, minPlayers: 3, minPlayersJudgedAt: now };
    const columns = secondTeamColumns({
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
