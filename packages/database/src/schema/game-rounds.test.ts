import { and, eq, sql } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, profiles, servers } from "#db/schema";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const HOUR = 3_600_000;
const BASE = Date.parse("2026-12-05T03:00:00Z");

let sequence = 0;

async function createGame(roundCount = 3) {
  sequence += 1;
  const [game] = await db
    .insert(games)
    .values({
      serverId: SERVER_ID,
      gmId: GM_ID,
      title: `game ${sequence}`,
      rule: "크툴루의 부름 7판",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(BASE),
      roundCount,
    })
    .returning();
  return game!;
}

function round(gameId: string, roundNo: number, startHour: number, hours = 4) {
  const start = new Date(BASE + startHour * HOUR);
  return {
    serverId: SERVER_ID,
    gameId,
    roundNo,
    startAt: start,
    plannedEndAt: new Date(start.getTime() + hours * HOUR),
    status: "scheduled" as const,
  };
}

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values({ id: GM_ID, discordId: "gm", username: "gm" });
});

describe("game_rounds 제약", () => {
  it("같은 구인의 회차가 겹치면 거부하고 맞닿으면 허용한다", async () => {
    const game = await createGame();
    await db.insert(gameRounds).values(round(game.id, 1, 0));
    await expect(db.insert(gameRounds).values(round(game.id, 2, 3))).rejects.toThrow();
    await db.insert(gameRounds).values(round(game.id, 2, 4));
  });

  it("다른 구인의 회차끼리는 겹쳐도 된다", async () => {
    const first = await createGame();
    const second = await createGame();
    await db.insert(gameRounds).values(round(first.id, 1, 0));
    await db.insert(gameRounds).values(round(second.id, 1, 0));
  });

  it("길이 24시간 초과와 종료가 시작보다 빠른 회차를 거부한다", async () => {
    const game = await createGame();
    await db.insert(gameRounds).values(round(game.id, 1, 0, 24));
    await expect(db.insert(gameRounds).values(round(game.id, 2, 100, 25))).rejects.toThrow();
    await expect(db.insert(gameRounds).values(round(game.id, 3, 200, 0))).rejects.toThrow();
  });

  it("같은 round_no를 거부한다", async () => {
    const game = await createGame();
    await db.insert(gameRounds).values(round(game.id, 1, 0));
    await expect(db.insert(gameRounds).values(round(game.id, 1, 10))).rejects.toThrow();
  });

  it("일시 없는 회차는 겹침 비교에서 빠진다", async () => {
    const game = await createGame();
    const empty = { serverId: SERVER_ID, gameId: game.id, status: "unscheduled" as const };
    await db.insert(gameRounds).values([
      { ...empty, roundNo: 1 },
      { ...empty, roundNo: 2 },
    ]);
  });

  it("회차를 지운 뒤 뒤 번호를 한 문장으로 당길 수 있다", async () => {
    const game = await createGame(4);
    await db
      .insert(gameRounds)
      .values([round(game.id, 1, 0), round(game.id, 2, 10), round(game.id, 3, 20)]);
    await db
      .delete(gameRounds)
      .where(and(eq(gameRounds.gameId, game.id), eq(gameRounds.roundNo, 2)));
    await db.execute(
      sql`update game_rounds set round_no = round_no - 1 where game_id = ${game.id} and round_no > 2`,
    );
    const rows = await db.select().from(gameRounds).where(eq(gameRounds.gameId, game.id));
    expect(rows.map((row) => row.roundNo).toSorted()).toEqual([1, 2]);
  });
});

describe("games 요약 칼럼 트리거", () => {
  it("last_start_at이 회차의 마지막 시작 시각을 따라간다", async () => {
    const game = await createGame();
    await db.insert(gameRounds).values([round(game.id, 1, 0), round(game.id, 2, 10)]);
    const read = async () =>
      (await db.select().from(games).where(eq(games.id, game.id)))[0]!.lastStartAt;
    expect(await read()).toEqual(new Date(BASE + 10 * HOUR));
    await db
      .delete(gameRounds)
      .where(and(eq(gameRounds.gameId, game.id), eq(gameRounds.roundNo, 2)));
    expect(await read()).toEqual(new Date(BASE));
  });

  it("마지막 회차가 끝나면 finished_at이 채워지고 회차를 늘리면 비워진다", async () => {
    const game = await createGame(2);
    const [first, second] = await db
      .insert(gameRounds)
      .values([round(game.id, 1, 0), round(game.id, 2, 10)])
      .returning();
    const read = async () =>
      (await db.select().from(games).where(eq(games.id, game.id)))[0]!.finishedAt;
    await db.update(gameRounds).set({ status: "finished" }).where(eq(gameRounds.id, first!.id));
    expect(await read()).toBeNull();
    const endedAt = new Date(BASE + 13 * HOUR);
    await db
      .update(gameRounds)
      .set({ status: "finished", endedAt })
      .where(eq(gameRounds.id, second!.id));
    expect(await read()).toEqual(endedAt);
    await db.update(games).set({ roundCount: 3 }).where(eq(games.id, game.id));
    expect(await read()).toBeNull();
  });

  it("조기 종결하면 그 시각이 finished_at이 된다", async () => {
    const game = await createGame(5);
    await db.insert(gameRounds).values(round(game.id, 1, 0));
    const incompleteAt = new Date(BASE + 6 * HOUR);
    await db
      .update(games)
      .set({ incompleteAt, incompleteReason: "manual" })
      .where(eq(games.id, game.id));
    const [saved] = await db.select().from(games).where(eq(games.id, game.id));
    expect(saved!.finishedAt).toEqual(incompleteAt);
  });
});
