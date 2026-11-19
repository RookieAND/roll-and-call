import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, notifications, participants, profiles, servers } from "#db/schema";

import { notifyPrivateSessions } from "./notify-private-sessions";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const PLAYER_ID = "00000000-0000-4000-8000-000000000003";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-12-05T10:00:00Z").getTime();

beforeAll(async () => {
  await db.insert(servers).values({ id: SERVER_ID, discordGuildId: "guild", slug: "t", name: "t" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
  const [game] = await db
    .insert(games)
    .values({
      serverId: SERVER_ID,
      gmId: GM_ID,
      title: "campaign",
      rule: "rule",
      scheduleMode: "fixed",
      visibility: "private",
      maxPlayers: 4,
      endDate: new Date(BASE - WEEK),
      confirmedAt: new Date(BASE),
      playMinutes: 240,
      roundCount: 2,
    })
    .returning();
  await db.insert(gameRounds).values(
    [0, 1].map((index) => ({
      serverId: SERVER_ID,
      gameId: game!.id,
      roundNo: index + 1,
      startAt: new Date(BASE + index * WEEK),
      plannedEndAt: new Date(BASE + index * WEEK + 4 * HOUR),
      status: "scheduled" as const,
    })),
  );
  await db
    .insert(participants)
    .values({ serverId: SERVER_ID, gameId: game!.id, userId: PLAYER_ID, status: "confirmed" });
});

describe("비공개 다회차 회차 알림", () => {
  it("회차마다 1시간 전 알림을 회차 번호와 함께 한 번만 보낸다", async () => {
    const now = new Date(BASE + WEEK - HOUR / 2);
    await notifyPrivateSessions({ now });
    await notifyPrivateSessions({ now });
    const rows = await db.select().from(notifications).where(eq(notifications.userId, PLAYER_ID));
    expect(rows.map((row) => [row.kind, row.params.roundNo])).toEqual([["session_reminder", 2]]);
  });
});
