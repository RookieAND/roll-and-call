import { describe, expect, it } from "vitest";

import type { BadgeDraw, BadgeFacts, BadgeSession } from "./badge-facts";
import { computeBadges } from "./compute-badges";
import { hallOfFameBadges } from "./hall-of-fame-badges";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
// 2026-03-02는 월요일이다. 세션은 KST 정오에 시작한다.
const MONDAY = Date.UTC(2026, 2, 2, 3);

function sessionAt(startsAtMs: number, gameId: string): BadgeSession {
  const startsAt = new Date(startsAtMs);
  return {
    gameId,
    title: gameId,
    startsAt,
    endsAt: new Date(startsAtMs + 2 * HOUR),
    categoryId: null,
    categoryName: null,
    attendedCount: 4,
    registeredAt: new Date(startsAtMs - 3 * DAY),
  };
}

const weekly = (weeks: number[]) =>
  weeks.map((week) => sessionAt(MONDAY + week * 7 * DAY + 2 * DAY, `w${week}`));
const run = (length: number, from = 0) => Array.from({ length }, (_, index) => from + index);

const facts = (overrides: Partial<BadgeFacts>): BadgeFacts => ({
  played: [],
  hosted: [],
  reviews: [],
  written: [],
  draws: [],
  hostedDraws: [],
  joinedAt: null,
  rush: [],
  fullCasts: [],
  absences: [],
  briefingIds: [],
  certified: [],
  asOf: new Date(Date.UTC(2027, 0, 1)),
  ...overrides,
});
const earned = (overrides: Partial<BadgeFacts>, key: string) =>
  computeBadges(facts(overrides)).some((badge) => badge.badgeKey === `sp.${key}`);

const draw = (index: number, overrides: Partial<BadgeDraw> = {}): BadgeDraw => ({
  gameId: `d${index}`,
  roll: 60,
  nearMiss: false,
  picked: false,
  applicants: 8,
  maxPlayers: 4,
  drawnAt: new Date(Date.UTC(2026, 5, 1 + index)),
  lastSeat: false,
  contested: true,
  ...overrides,
});

describe("개근 사다리(꼬박꼬박·차곡차곡·한결같이)", () => {
  it("4주 연속이면 꼬박꼬박만, 12주 연속이면 차곡차곡까지 받는다", () => {
    expect(earned({ played: weekly(run(3)) }, "weeks4")).toBe(false);
    expect(earned({ played: weekly(run(4)) }, "weeks4")).toBe(true);
    expect(earned({ played: weekly(run(4)) }, "weeks12")).toBe(false);
    expect(earned({ played: weekly(run(12)) }, "weeks12")).toBe(true);
    expect(earned({ played: weekly(run(25)) }, "weeks26")).toBe(false);
    expect(earned({ played: weekly(run(26)) }, "weeks26")).toBe(true);
  });

  it("한 주를 거르면 끊기고, 꼬박꼬박은 PL 참석만 센다", () => {
    expect(earned({ played: weekly([0, 1, 2, 4, 5]) }, "weeks4")).toBe(false);
    expect(earned({ played: weekly([0, 1]), hosted: weekly([2, 3]) }, "weeks4")).toBe(false);
    expect(earned({ hosted: weekly(run(4)) }, "weeks4")).toBe(false);
  });

  it("12·26주는 연속이 아니어도 최근 16·32주 중 12·26주면 받는다", () => {
    const withGap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
    expect(earned({ played: weekly(withGap) }, "weeks12")).toBe(true);
    expect(earned({ played: weekly(withGap.slice(0, 11)) }, "weeks12")).toBe(false);
    // 11주는 16주 창 안에 들어도 모자라고, 떨어진 20주는 창을 공유하지 못한다.
    expect(earned({ played: weekly([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]) }, "weeks12")).toBe(false);
    const halfYear = Array.from({ length: 32 }, (_, index) => index).filter((index) => index % 5 !== 4);
    expect(earned({ played: weekly(halfYear) }, "weeks26")).toBe(true);
    expect(earned({ played: weekly(halfYear.slice(0, 25)) }, "weeks26")).toBe(false);
  });

  it("한 주에 여러 세션이 있어도 1주로 센다", () => {
    const doubled = weekly(run(3)).flatMap((item, index) => [
      item,
      sessionAt(item.startsAt.getTime() + HOUR, `x${index}`),
    ]);
    expect(earned({ played: doubled }, "weeks4")).toBe(false);
  });

  it("월요일 0시(KST)를 주의 경계로 본다", () => {
    const sundayNight = Date.UTC(2026, 2, 1, 14, 30); // 일요일 23:30 KST
    const mondayMorning = Date.UTC(2026, 2, 1, 15, 30); // 월요일 00:30 KST
    const played = [
      sessionAt(sundayNight, "a"),
      sessionAt(mondayMorning, "b"),
      sessionAt(mondayMorning + 7 * DAY, "c"),
      sessionAt(mondayMorning + 14 * DAY, "d"),
    ];
    expect(earned({ played }, "weeks4")).toBe(true);
    // 일요일 밤과 월요일 아침을 같은 주로 보면 3주라 받지 못한다.
    expect(earned({ played: played.slice(0, 3) }, "weeks4")).toBe(false);
  });
});

describe("문지방·불씨지기·등대지기 (GM 사다리)", () => {
  it("GM으로 4·12·26주 연속 세션을 열어야 하고 PL 참석은 세지 않는다", () => {
    expect(earned({ hosted: weekly(run(4)) }, "opendoor")).toBe(true);
    expect(earned({ hosted: weekly(run(3)) }, "opendoor")).toBe(false);
    expect(earned({ played: weekly(run(4)) }, "opendoor")).toBe(false);
    expect(earned({ hosted: weekly(run(12)) }, "opendoor12")).toBe(true);
    expect(earned({ hosted: weekly(run(11)) }, "opendoor12")).toBe(false);
    expect(earned({ hosted: weekly([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]) }, "opendoor12")).toBe(true);
    expect(earned({ hosted: weekly(run(26)) }, "opendoor26")).toBe(true);
    expect(earned({ hosted: weekly(run(25)) }, "opendoor26")).toBe(false);
    expect(earned({ played: weekly(run(26)) }, "opendoor26")).toBe(false);
  });
});

describe("따끈따끈", () => {
  const played = [sessionAt(MONDAY, "g1")];
  const endsAt = played[0]!.endsAt;
  it("세션이 끝나고 1시간 안에 쓴 후기가 있으면 받는다", () => {
    const written = [{ gameId: "g1", createdAt: new Date(endsAt.getTime() + HOUR) }];
    expect(earned({ played, written }, "fresh")).toBe(true);
  });

  it("1시간이 지나서 쓰면 받지 못한다", () => {
    const written = [{ gameId: "g1", createdAt: new Date(endsAt.getTime() + HOUR + 1) }];
    expect(earned({ played, written }, "fresh")).toBe(false);
  });

  it("참석하지 않은 세션의 후기는 세지 않는다", () => {
    const written = [{ gameId: "other", createdAt: endsAt }];
    expect(earned({ played, written }, "fresh")).toBe(false);
  });
});

describe("열 번 찍어", () => {
  const inMonth = (count: number, month: number) =>
    Array.from({ length: count }, (_, index) =>
      draw(index + month * 100, { drawnAt: new Date(Date.UTC(2026, month, 1 + index, 3)) }),
    );
  it("한 달에 추첨 10곳에 신청하면 받는다", () => {
    expect(earned({ draws: inMonth(9, 4) }, "tentries")).toBe(false);
    expect(earned({ draws: inMonth(10, 4) }, "tentries")).toBe(true);
  });

  it("달이 나뉘면 합쳐 세지 않는다", () => {
    expect(earned({ draws: [...inMonth(5, 4), ...inMonth(5, 5)] }, "tentries")).toBe(false);
  });
});

describe("줄타기", () => {
  const alternating = (picks: boolean[]) => picks.map((picked, index) => draw(index, { picked }));
  it("확정과 대기가 번갈아 5번 이어지면 받는다", () => {
    expect(earned({ draws: alternating([true, false, true, false, true]) }, "tightrope")).toBe(
      true,
    );
    expect(earned({ draws: alternating([true, false, true, false]) }, "tightrope")).toBe(false);
  });

  it("같은 결과가 두 번 이어지면 끊긴다", () => {
    expect(earned({ draws: alternating([true, false, false, true, false]) }, "tightrope")).toBe(
      false,
    );
  });
});

describe("천국과 지옥", () => {
  it("1과 100을 모두 굴려야 받는다", () => {
    expect(earned({ draws: [draw(1, { roll: 1 })] }, "heavenhell")).toBe(false);
    expect(earned({ draws: [draw(1, { roll: 1 }), draw(2, { roll: 100 })] }, "heavenhell")).toBe(
      true,
    );
  });
});

describe("hallOfFameBadges", () => {
  const win = (userId: string, ladder: string, month: string, day: number) => ({
    userId,
    badgeKey: `${ladder}.${month}`,
    tier: 1,
    earnedAt: new Date(Date.UTC(2026, Number(month.slice(5)), day)),
    sourceGameId: null,
  });
  it("이달의 GM·PL을 통틀어 세 번 받으면 세 번째 달을 근거로 준다", () => {
    const result = hallOfFameBadges([
      win("a", "pl.monthly", "2026-05", 1),
      win("a", "gm.monthly", "2026-06", 1),
      win("a", "pl.monthly", "2026-07", 1),
      win("b", "pl.monthly", "2026-05", 1),
      win("b", "pl.monthly", "2026-06", 1),
    ]);
    expect(result).toEqual([
      {
        userId: "a",
        badgeKey: "sp.hall",
        tier: 1,
        earnedAt: new Date(Date.UTC(2026, 7, 1)),
        sourceGameId: null,
      },
    ]);
  });
});
