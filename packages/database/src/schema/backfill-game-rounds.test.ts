import { eq, sql } from "drizzle-orm";
import { beforeAll, expect, it, vi } from "vitest";

import {
  gameRounds,
  games,
  participants,
  profiles,
  roundAttendances,
  servers,
  sessionReviews,
} from "#db/schema";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const PLAYER_ID = "00000000-0000-4000-8000-000000000003";
const ABSENT_ID = "00000000-0000-4000-8000-000000000004";
const HOUR = 3_600_000;

async function createGame(values: Partial<typeof games.$inferInsert>) {
  const [game] = await db
    .insert(games)
    .values({
      serverId: SERVER_ID,
      gmId: GM_ID,
      title: "game",
      rule: "크툴루의 부름 7판",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(),
      ...values,
    })
    .returning();
  return game!;
}

async function roundOf(gameId: string) {
  const [row] = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
  return row!;
}

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
    { id: ABSENT_ID, discordId: "absent", username: "absent" },
  ]);
});

it("구인마다 회차 1개를 만들고 상태를 계산하며 출석·후기를 옮긴다", async () => {
  const now = Date.now();
  const upcoming = await createGame({ confirmedAt: new Date(now + 48 * HOUR), playMinutes: 240 });
  const running = await createGame({ confirmedAt: new Date(now - HOUR), playMinutes: 240 });
  const overdue = await createGame({ confirmedAt: new Date(now - 48 * HOUR) });
  const manuallyEnded = await createGame({
    confirmedAt: new Date(now - 3 * HOUR),
    playMinutes: 600,
    endedAt: new Date(now - HOUR),
  });
  const cancelled = await createGame({
    confirmedAt: new Date(now + 24 * HOUR),
    cancelledAt: new Date(),
    cancelKind: "gm",
  });
  const coordinating = await createGame({
    scheduleMode: "coordinate",
    rangeStart: "2026-12-01",
    rangeEnd: "2026-12-07",
  });
  const longGame = await createGame({ confirmedAt: new Date(now + 72 * HOUR), playMinutes: 3000 });

  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId: overdue.id, userId: PLAYER_ID },
    { serverId: SERVER_ID, gameId: overdue.id, userId: ABSENT_ID, absent: true },
  ]);
  await db.insert(sessionReviews).values({
    serverId: SERVER_ID,
    gameId: overdue.id,
    authorId: PLAYER_ID,
    body: "후기 본문은 스무 글자를 넘겨야 합니다 정말로요",
  });

  const [first] = (await db.execute(sql`select * from backfill_game_rounds()`)).rows as {
    rounds_created: number;
    attendances_created: number;
    reviews_linked: number;
  }[];
  expect(first).toEqual({ rounds_created: 7, attendances_created: 2, reviews_linked: 1 });

  expect((await roundOf(upcoming.id)).status).toBe("scheduled");
  expect((await roundOf(running.id)).status).toBe("in_progress");
  const overdueRound = await roundOf(overdue.id);
  expect(overdueRound.status).toBe("finished");
  expect(overdueRound.plannedEndAt!.getTime() - overdueRound.startAt!.getTime()).toBe(3 * HOUR);
  const endedRound = await roundOf(manuallyEnded.id);
  expect(endedRound).toMatchObject({ status: "finished", endedAt: manuallyEnded.endedAt });
  expect((await roundOf(cancelled.id)).status).toBe("cancelling");
  expect(await roundOf(coordinating.id)).toMatchObject({
    status: "coordinating",
    startAt: null,
    coordinationStart: "2026-12-01",
    coordinationTimezone: "Asia/Seoul",
  });
  const longRound = await roundOf(longGame.id);
  expect(longRound.plannedEndAt!.getTime() - longRound.startAt!.getTime()).toBe(24 * HOUR);

  const attendance = await db.select().from(roundAttendances);
  expect(attendance.map((row) => [row.userId, row.attended]).toSorted()).toEqual(
    [
      [PLAYER_ID, true],
      [ABSENT_ID, false],
    ].toSorted(),
  );
  const [review] = await db.select().from(sessionReviews);
  expect(review!.roundId).toBe(overdueRound.id);

  const [finished] = await db.select().from(games).where(eq(games.id, overdue.id));
  expect(finished!.finishedAt).toEqual(overdueRound.plannedEndAt);
  const [stillOpen] = await db.select().from(games).where(eq(games.id, cancelled.id));
  expect(stillOpen!.finishedAt).toBeNull();

  const [second] = (await db.execute(sql`select * from backfill_game_rounds()`)).rows;
  expect(second).toEqual({ rounds_created: 0, attendances_created: 0, reviews_linked: 0 });
  expect((await db.select().from(gameRounds)).length).toBe(7);
});
