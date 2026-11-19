import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  gameRoundSkips,
  gameRounds,
  games,
  participants,
  profiles,
  roundAttendances,
  servers,
} from "#db/schema";

import { getAdminGameRounds } from "./get-admin-game-rounds";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const ALICE = "00000000-0000-4000-8000-000000000003";
const BOB = "00000000-0000-4000-8000-000000000004";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-12-05T10:00:00Z").getTime();

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: ALICE, discordId: "alice", username: "alice" },
    { id: BOB, discordId: "bob", username: "bob" },
  ]);
});

async function seedGame(roundCount: number) {
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
      roundCount,
    })
    .returning();
  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId: game!.id, userId: ALICE, status: "confirmed" },
    { serverId: SERVER_ID, gameId: game!.id, userId: BOB, status: "confirmed" },
  ]);
  return game!.id;
}

describe("어드민 회차 조회", () => {
  it("한 회차짜리 구인은 값이 없다", async () => {
    const gameId = await seedGame(1);
    expect(await getAdminGameRounds({ serverId: SERVER_ID, gameId })).toBeNull();
  });

  it("회차별 출석 명단을 돌려준다", async () => {
    const gameId = await seedGame(2);
    const [first] = await db
      .insert(gameRounds)
      .values([
        {
          serverId: SERVER_ID,
          gameId,
          roundNo: 1,
          startAt: new Date(BASE),
          plannedEndAt: new Date(BASE + 4 * HOUR),
          status: "finished",
          attendanceConfirmedAt: new Date(BASE + 5 * HOUR),
        },
        { serverId: SERVER_ID, gameId, roundNo: 2, status: "unscheduled" },
      ])
      .returning();
    await db.insert(roundAttendances).values([
      { serverId: SERVER_ID, roundId: first!.id, gameId, userId: ALICE, attended: true },
      { serverId: SERVER_ID, roundId: first!.id, gameId, userId: BOB, attended: false },
    ]);
    const result = await getAdminGameRounds({ serverId: SERVER_ID, gameId });
    expect(result!.rounds.map((round) => round.attendees.length)).toEqual([2, 0]);
    expect(result!.rounds[0]!.attendees).toEqual([
      { userId: ALICE, nickname: "alice", attended: true },
      { userId: BOB, nickname: "bob", attended: false },
    ]);
  });

  it("생략 기록이 어드민 상세에 보인다", async () => {
    const gameId = await seedGame(2);
    await db.insert(gameRoundSkips).values({
      serverId: SERVER_ID,
      gameId,
      roundNo: 2,
      originalStartAt: new Date(BASE + WEEK),
      originalPlannedEndAt: new Date(BASE + WEEK + 4 * HOUR),
      skippedAt: new Date(BASE + WEEK + HOUR),
    });
    const result = await getAdminGameRounds({ serverId: SERVER_ID, gameId });
    expect(result!.skips).toEqual([
      {
        roundNo: 2,
        originalStartAt: new Date(BASE + WEEK),
        originalPlannedEndAt: new Date(BASE + WEEK + 4 * HOUR),
        skippedAt: new Date(BASE + WEEK + HOUR),
      },
    ]);
  });
});
