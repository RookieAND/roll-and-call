import { describe, expect, it } from "vitest";

import type { BadgeDraw, BadgeFacts, BadgeSession } from "./badge-facts";
import { computeBadges } from "./compute-badges";

const HOUR = 60 * 60 * 1000;

// 기본 세션은 KST 낮 2시에 시작해 3시간 뒤 끝나고, 구인은 한 달 전에 올렸다.
function session(overrides: Partial<BadgeSession> & { day?: number } = {}): BadgeSession {
  const { day = 1, ...rest } = overrides;
  const startsAt = new Date(Date.UTC(2026, 2, day, 5));
  return {
    gameId: `g${day}`,
    title: "",
    startsAt,
    endsAt: new Date(startsAt.getTime() + 3 * HOUR),
    categoryId: "coc",
    categoryName: null,
    attendedCount: 4,
    registeredAt: new Date(Date.UTC(2026, 1, 1)),
    ...rest,
  };
}

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
  asOf: new Date(Date.UTC(2027, 0, 1)),
  ...overrides,
});

const draw = (index: number, overrides: Partial<BadgeDraw> = {}): BadgeDraw => ({
  gameId: `d${index}`,
  roll: 60,
  nearMiss: false,
  picked: false,
  applicants: 8,
  maxPlayers: 4,
  drawnAt: new Date(Date.UTC(2026, 5, 1 + index)),
  lastSeat: false,
  ...overrides,
});

const has = (badges: ReturnType<typeof computeBadges>, key: string) =>
  badges.some((badge) => badge.badgeKey === key);
const earned = (input: Partial<BadgeFacts>, key: string) =>
  has(computeBadges(facts(input)), `sp.${key}`);

const sessionsOnDays = (days: number[]) => days.map((day) => session({ day }));

describe("숨겨진 칭호 14종", () => {
  it("올빼미는 시작이 KST 04:59까지이고 05:00부터는 아니다", () => {
    const at = (iso: string) => [session({ startsAt: new Date(iso), endsAt: new Date(iso) })];
    expect(earned({ played: at("2026-03-01T19:59:00Z") }, "owl")).toBe(true);
    expect(earned({ played: at("2026-03-01T20:00:00Z") }, "owl")).toBe(false);
  });

  it("번개는 24시간 안 시작과 참석 3명부터이고 24시간 1분이나 2명은 아니다", () => {
    const registeredAt = new Date(Date.UTC(2026, 2, 1, 5));
    const lead = (minutes: number, attendedCount = 3) => [
      session({
        registeredAt: new Date(registeredAt.getTime() - minutes * 60_000),
        attendedCount,
      }),
    ];
    expect(earned({ played: lead(24 * 60) }, "lightning")).toBe(true);
    expect(earned({ played: lead(24 * 60 + 1) }, "lightning")).toBe(false);
    expect(earned({ played: lead(60, 2) }, "lightning")).toBe(false);
  });

  it("밤샘은 종료가 다음 날 KST 05:59면 아니고 06:00이면 받는다", () => {
    const startsAt = new Date("2026-03-01T13:00:00Z");
    const ends = (iso: string) => [session({ startsAt, endsAt: new Date(iso) })];
    expect(earned({ played: ends("2026-03-01T20:59:00Z") }, "allnight")).toBe(false);
    expect(earned({ played: ends("2026-03-01T21:00:00Z") }, "allnight")).toBe(true);
  });

  it("풀 캐스트는 GM의 전원 후기 기록(fullCasts)이 있어야 받는다", () => {
    const at = new Date(Date.UTC(2026, 3, 1));
    expect(earned({ fullCasts: [{ at, gameId: "g1" }] }, "fullcast")).toBe(true);
    expect(earned({ fullCasts: [] }, "fullcast")).toBe(false);
  });

  it("요일 수집가는 여섯 요일이면 아니고 일곱 요일이 모이면 받는다", () => {
    expect(earned({ played: sessionsOnDays([1, 2, 3, 4, 5, 6]) }, "weekdays")).toBe(false);
    expect(earned({ played: sessionsOnDays([1, 2, 3, 4, 5, 6, 7]) }, "weekdays")).toBe(true);
    expect(earned({ played: sessionsOnDays([1, 8, 15, 22, 29, 6, 13]) }, "weekdays")).toBe(false);
  });

  it("동전 던지기는 값이 정확히 50일 때만이다", () => {
    expect(earned({ draws: [draw(0, { roll: 50 })] }, "coin")).toBe(true);
    expect(earned({ draws: [draw(0, { roll: 49 }), draw(1, { roll: 51 })] }, "coin")).toBe(false);
  });

  it("백일은 가입 100일이 지나고 인정 세션이 있어야 받는다", () => {
    const joinedAt = new Date(Date.UTC(2026, 0, 1));
    const asOf = (days: number) => new Date(joinedAt.getTime() + days * 24 * HOUR);
    const input = (days: number) => ({ played: [session({ day: 1 })], joinedAt, asOf: asOf(days) });
    expect(earned(input(99), "hundred")).toBe(false);
    expect(earned(input(100), "hundred")).toBe(true);
    expect(earned({ joinedAt, asOf: asOf(200) }, "hundred")).toBe(false);
  });

  it("연속 출전·특급 열차·불꽃 행진은 이어진 날 수로 받고 높은 단계는 낮은 단계도 준다", () => {
    const run = (length: number) => computeBadges(facts({ played: sessionsOnDays(range(length)) }));
    expect(has(run(2), "sp.days3")).toBe(false);
    expect(has(run(3), "sp.days3")).toBe(true);
    expect(has(run(6), "sp.days7")).toBe(false);
    expect(has(run(7), "sp.days7") && has(run(7), "sp.days3")).toBe(true);
    expect(has(run(9), "sp.days10")).toBe(false);
    const ten = run(10);
    expect(has(ten, "sp.days10") && has(ten, "sp.days7") && has(ten, "sp.days3")).toBe(true);
    const skipped = facts({ played: sessionsOnDays([1, 2, 4]) });
    expect(has(computeBadges(skipped), "sp.days3")).toBe(false);
  });

  it("하루에 세션이 둘이어도 연속은 1일로 센다", () => {
    const twoADay = [1, 2, 2, 3].map((day, index) => session({ day, gameId: `x${index}` }));
    expect(earned({ played: twoADay }, "days3")).toBe(true);
    const doubleOnly = [1, 1, 2, 2].map((day, index) => session({ day, gameId: `y${index}` }));
    expect(earned({ played: doubleOnly }, "days3")).toBe(false);
  });

  it("연승은 연속 확정 3번, 연전연승은 5번이고 대기가 끼면 끊긴다", () => {
    const picks = (pattern: boolean[]) => pattern.map((picked, index) => draw(index, { picked }));
    expect(earned({ draws: picks([true, true]) }, "wins3")).toBe(false);
    expect(earned({ draws: picks([true, true, true]) }, "wins3")).toBe(true);
    expect(earned({ draws: picks([true, true, false, true, true]) }, "wins3")).toBe(false);
    expect(earned({ draws: picks([true, true, true, true]) }, "wins5")).toBe(false);
    const five = computeBadges(facts({ draws: picks([true, true, true, true, true]) }));
    expect(has(five, "sp.wins5") && has(five, "sp.wins3")).toBe(true);
  });

  it("턱걸이는 정원 3명 이상에서 확정자 가운데 마지막 자리일 때다", () => {
    const seat = (maxPlayers: number, lastSeat = true) => [
      draw(0, { picked: true, lastSeat, maxPlayers, applicants: maxPlayers + 2 }),
    ];
    expect(earned({ draws: seat(3) }, "pullup")).toBe(true);
    expect(earned({ draws: seat(2) }, "pullup")).toBe(false);
    expect(earned({ draws: seat(4, false) }, "pullup")).toBe(false);
  });

  it("기사회생은 정원 4명 이상에서 80 이상으로 뽑힌 때다", () => {
    const pick = (roll: number, maxPlayers = 4) => [
      draw(0, { picked: true, roll, maxPlayers, applicants: maxPlayers + 2 }),
    ];
    expect(earned({ draws: pick(79) }, "revive")).toBe(false);
    expect(earned({ draws: pick(80) }, "revive")).toBe(true);
    expect(earned({ draws: pick(90, 3) }, "revive")).toBe(false);
  });

  it("같은 기록으로 다시 계산해도 결과가 같다", () => {
    const input = facts({
      played: sessionsOnDays(range(10)),
      draws: [draw(0, { roll: 50, picked: true }), draw(1, { picked: true })],
    });
    expect(computeBadges(input)).toEqual(computeBadges(input));
  });
});

function range(length: number): number[] {
  return Array.from({ length }, (_, index) => index + 1);
}
