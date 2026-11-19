import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, profiles, servers } from "#db/schema";

import { firstRoundStartSql } from "./first-round-sql";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const START = new Date("2026-12-05T10:00:00Z");

beforeAll(async () => {
  await db.insert(servers).values({ id: SERVER_ID, discordGuildId: "guild", slug: "t", name: "t" });
  await db.insert(profiles).values({ id: GM_ID, discordId: "gm", username: "gm" });
});

describe("1회차 시각", () => {
  it("다른 표를 조인하지 않은 select에서도 그 구인의 회차를 읽는다", async () => {
    const [game] = await db
      .insert(games)
      .values({
        serverId: SERVER_ID,
        gmId: GM_ID,
        title: "single",
        rule: "rule",
        scheduleMode: "fixed",
        maxPlayers: 4,
        endDate: START,
        confirmedAt: START,
      })
      .returning();
    await db.insert(gameRounds).values({
      serverId: SERVER_ID,
      gameId: game!.id,
      roundNo: 1,
      startAt: START,
      plannedEndAt: new Date(START.getTime() + 3_600_000),
      status: "scheduled",
    });
    const [row] = await db
      .select({ startAt: firstRoundStartSql })
      .from(games)
      .where(eq(games.id, game!.id));
    expect(row?.startAt).toEqual(START);
  });
});
