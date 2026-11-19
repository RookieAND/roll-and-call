import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, profiles, roundAttendances, servers } from "#db/schema";

import { buildNewRounds } from "../model/build-new-rounds";
import { buildRepeatRounds } from "../model/build-repeat-rounds";
import { repeatRuleOf } from "../model/repeat-rule-of";
import { createGameWithRoster } from "./create-game-with-roster";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const PLAYER_ID = "00000000-0000-4000-8000-000000000003";
const first = {
  startsAt: new Date("2026-12-26T03:00:00Z"),
  endsAt: new Date("2026-12-26T07:00:00Z"),
};

function columns(overrides: Partial<typeof games.$inferInsert> = {}) {
  return {
    gmId: GM_ID,
    title: "campaign",
    rule: "크툴루의 부름 7판",
    scheduleMode: "fixed" as const,
    maxPlayers: 4,
    endDate: new Date("2026-12-20T00:00:00Z"),
    confirmedAt: first.startsAt,
    playMinutes: 240,
    ...overrides,
  };
}

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
});

describe("여러 번 진행하는 구인 만들기", () => {
  it("지정형은 회차 행 전부를 만들고 요약 칼럼이 따라온다", async () => {
    const dated = buildRepeatRounds({ first, intervalWeeks: 1, count: 4 });
    const gameId = await createGameWithRoster({
      serverId: SERVER_ID,
      columns: columns({
        roundCount: 4,
        roundScheduleKind: "designated",
        repeatRule: repeatRuleOf({ first, intervalWeeks: 1 }),
      }),
      confirmedUserIds: [PLAYER_ID],
      rounds: buildNewRounds({ scheduleKind: "designated", roundCount: 4, dated }),
    });
    const rounds = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(rounds.map((round) => round.roundNo).toSorted()).toEqual([1, 2, 3, 4]);
    expect(rounds.every((round) => round.status === "scheduled")).toBe(true);
    const [game] = await db.select().from(games).where(eq(games.id, gameId));
    expect(game!.lastStartAt).toEqual(dated[3]!.startsAt);
    expect(game!.repeatRule).toMatchObject({ weekday: 6, startTime: "12:00" });
    // 여러 번 진행하는 구인의 출석은 회차를 직접 쓰므로 단발용 트리거가 행을 만들지 않는다.
    expect(
      await db.select().from(roundAttendances).where(eq(roundAttendances.gameId, gameId)),
    ).toEqual([]);
  });

  it("겹치는 회차는 데이터베이스가 거부하고 구인도 남지 않는다", async () => {
    const overlapping = [
      {
        roundNo: 1,
        startAt: first.startsAt,
        plannedEndAt: first.endsAt,
        status: "scheduled" as const,
      },
      {
        roundNo: 2,
        startAt: new Date(first.startsAt.getTime() + 3_600_000),
        plannedEndAt: new Date(first.endsAt.getTime() + 3_600_000),
        status: "scheduled" as const,
      },
    ];
    const before = (await db.select().from(games)).length;
    await expect(
      createGameWithRoster({
        serverId: SERVER_ID,
        columns: columns({ roundCount: 2 }),
        confirmedUserIds: [],
        rounds: overlapping,
      }),
    ).rejects.toThrow();
    expect((await db.select().from(games)).length).toBe(before);
  });

  it("조율형은 조율 중 1회차와 일정 없는 뒤 회차를 만든다", async () => {
    const gameId = await createGameWithRoster({
      serverId: SERVER_ID,
      columns: columns({
        scheduleMode: "coordinate",
        confirmedAt: null,
        rangeStart: "2026-12-01",
        rangeEnd: "2026-12-07",
        roundCount: 3,
        roundScheduleKind: "coordinated",
      }),
      confirmedUserIds: [],
      rounds: buildNewRounds({
        scheduleKind: "coordinated",
        roundCount: 3,
        dated: [],
        firstRoundCoordination: { start: "2026-12-01", end: "2026-12-07", timezone: "Asia/Seoul" },
      }),
    });
    const rounds = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(rounds.map((round) => [round.roundNo, round.status]).toSorted()).toEqual([
      [1, "coordinating"],
      [2, "unscheduled"],
      [3, "unscheduled"],
    ]);
    const [game] = await db.select().from(games).where(eq(games.id, gameId));
    expect(game!.lastStartAt).toBeNull();
  });
});
