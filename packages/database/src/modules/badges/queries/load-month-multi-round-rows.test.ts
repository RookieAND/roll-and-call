import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { gameRounds, games, participants, profiles, roundAttendances, servers } from "#db/schema";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");
const { loadMonthMultiRoundRows } = await import("./load-month-multi-round-rows");
const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const ALICE = "00000000-0000-4000-8000-000000000003";
const BOB = "00000000-0000-4000-8000-000000000004";
const CAROL = "00000000-0000-4000-8000-000000000005";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-03-23T10:00:00Z").getTime();

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: ALICE, discordId: "alice", username: "alice" },
    { id: BOB, discordId: "bob", username: "bob" },
    { id: CAROL, discordId: "carol", username: "carol" },
  ]);
});

beforeEach(async () => {
  await db.delete(games);
  await db.update(servers).set({ rankingMode: "count" });
});

async function seedCampaign({
  starts,
  confirmed,
  attendance = {},
  bobState = {},
}: {
  starts: number[];
  confirmed: boolean;
  // userId -> 출석한 회차 번호(1부터)
  attendance?: Record<string, number[]>;
  bobState?: Partial<typeof participants.$inferInsert>;
}) {
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
      roundCount: starts.length,
      roundScheduleKind: "designated",
    })
    .returning();
  const rounds = await db
    .insert(gameRounds)
    .values(
      starts.map((start, index) => ({
        serverId: SERVER_ID,
        gameId: game!.id,
        roundNo: index + 1,
        startAt: new Date(start),
        plannedEndAt: new Date(start + 4 * HOUR),
        status: "scheduled" as const,
        attendanceConfirmedAt: confirmed ? new Date(start + 5 * HOUR) : null,
      })),
    )
    .returning();
  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId: game!.id, userId: ALICE, status: "confirmed" },
    { serverId: SERVER_ID, gameId: game!.id, userId: CAROL, status: "confirmed" },
    { serverId: SERVER_ID, gameId: game!.id, userId: BOB, status: "confirmed", ...bobState },
  ]);
  if (confirmed) {
    await db.insert(roundAttendances).values(
      [ALICE, BOB, CAROL].flatMap((userId) =>
        rounds.map((round) => ({
          serverId: SERVER_ID,
          roundId: round.id,
          gameId: game!.id,
          userId,
          attended: attendance[userId]?.includes(round.roundNo) ?? false,
        })),
      ),
    );
  }
  return game!.id;
}

const weekly = (count: number) => Array.from({ length: count }, (_, index) => BASE + index * WEEK);
const monthOf = (month: number) => ({
  serverId: SERVER_ID,
  from: new Date(`2026-${String(month).padStart(2, "0")}-01T00:00:00+09:00`),
  to: new Date(`2026-${String(month + 1).padStart(2, "0")}-01T00:00:00+09:00`),
});
const countFor = (rows: Awaited<ReturnType<typeof loadMonthMultiRoundRows>>, userId: string) =>
  rows.filter((row) => row.participants.some((participant) => participant.userId === userId))
    .length;

describe("loadMonthMultiRoundRows", () => {
  it("counts attended round-days in the month each round starts", async () => {
    // 3/23, 3/30, 4/6, 4/13, 4/20, 4/27
    await seedCampaign({
      starts: weekly(6),
      confirmed: true,
      attendance: { [ALICE]: [1, 2, 3, 4, 5, 6], [CAROL]: [1, 2, 3, 4, 5, 6], [BOB]: [1, 3, 4, 6] },
    });
    const march = await loadMonthMultiRoundRows(monthOf(3));
    const april = await loadMonthMultiRoundRows(monthOf(4));
    expect(march).toHaveLength(2);
    expect(april).toHaveLength(4);
    expect(countFor(march, BOB)).toBe(1);
    expect(countFor(april, BOB)).toBe(3);
    expect(countFor(march, ALICE)).toBe(2);
  });

  it("merges same-day rounds into one row", async () => {
    await seedCampaign({
      starts: [BASE, BASE + 4 * HOUR],
      confirmed: true,
      attendance: { [ALICE]: [1, 2], [BOB]: [1], [CAROL]: [2] },
    });
    const march = await loadMonthMultiRoundRows(monthOf(3));
    expect(march).toHaveLength(1);
    expect(countFor(march, ALICE)).toBe(1);
    expect(countFor(march, BOB)).toBe(1);
  });
});
