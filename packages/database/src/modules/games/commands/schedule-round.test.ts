import { asc, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, profiles, servers } from "#db/schema";

import { moveRounds } from "./move-rounds";
import { scheduleRound } from "./schedule-round";
import { setRepeatRule } from "./set-repeat-rule";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-12-05T10:00:00Z").getTime();

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values({ id: GM_ID, discordId: "gm", username: "gm" });
});

async function seedGame({ count, dated }: { count: number; dated: number }) {
  const [game] = await db
    .insert(games)
    .values({
      serverId: SERVER_ID,
      gmId: GM_ID,
      title: "campaign",
      rule: "rule",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(BASE - WEEK),
      confirmedAt: new Date(BASE),
      playMinutes: 240,
      roundCount: count,
    })
    .returning();
  await db.insert(gameRounds).values(
    Array.from({ length: count }, (_, index) =>
      index < dated
        ? {
            serverId: SERVER_ID,
            gameId: game!.id,
            roundNo: index + 1,
            startAt: new Date(BASE + index * WEEK),
            plannedEndAt: new Date(BASE + index * WEEK + 4 * HOUR),
            status: "scheduled" as const,
          }
        : { serverId: SERVER_ID, gameId: game!.id, roundNo: index + 1 },
    ),
  );
  return game!.id;
}

const roundsOf = (gameId: string) =>
  db
    .select()
    .from(gameRounds)
    .where(eq(gameRounds.gameId, gameId))
    .orderBy(asc(gameRounds.roundNo));

describe("회차 일정 명령", () => {
  it("일정 없는 회차에 일시를 정하면 scheduled가 된다", async () => {
    const gameId = await seedGame({ count: 3, dated: 1 });
    await db.transaction((transaction) =>
      scheduleRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 2,
        startAt: new Date(BASE + WEEK),
        plannedEndAt: new Date(BASE + WEEK + 3 * HOUR),
      }),
    );
    const round = (await roundsOf(gameId))[1]!;
    expect(round.status).toBe("scheduled");
    expect(round.startAt?.getTime()).toBe(BASE + WEEK);
  });

  it("4~6회차를 한 주 미루고 앞당겨도 겹침 제약에 걸리지 않는다", async () => {
    const gameId = await seedGame({ count: 6, dated: 6 });
    const shift = (delta: number) =>
      db.transaction((transaction) =>
        moveRounds({
          transaction,
          serverId: SERVER_ID,
          gameId,
          moves: [4, 5, 6].map((roundNo) => ({
            roundNo,
            startAt: new Date(BASE + (roundNo - 1) * WEEK + delta),
            plannedEndAt: new Date(BASE + (roundNo - 1) * WEEK + delta + 4 * HOUR),
          })),
        }),
      );
    const previous = await shift(WEEK);
    expect(previous.map((row) => row.startAt.getTime())).toEqual(
      [3, 4, 5].map((index) => BASE + index * WEEK),
    );
    expect((await roundsOf(gameId))[3]!.startAt?.getTime()).toBe(BASE + 4 * WEEK);
    await shift(0);
    expect((await roundsOf(gameId))[3]!.startAt?.getTime()).toBe(BASE + 3 * WEEK);
  });

  it("반복 규칙을 바꾸고 비울 수 있다", async () => {
    const gameId = await seedGame({ count: 2, dated: 2 });
    const rule = { weekday: 3, startTime: "20:00", endTime: "23:00", intervalWeeks: 1 };
    await db.transaction((transaction) =>
      setRepeatRule({ transaction, serverId: SERVER_ID, gameId, repeatRule: rule }),
    );
    expect((await db.select().from(games).where(eq(games.id, gameId)))[0]!.repeatRule).toEqual(
      rule,
    );
  });
});
