import { eq } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { ABSENCE_POINTS } from "#db/modules/badges/model/ranking-points";
import { gameRounds, games, participants, profiles, roundAttendances, servers } from "#db/schema";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");
const { loadMonthlyAppearances } = await import("./load-monthly-appearances");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const ALICE = "00000000-0000-4000-8000-000000000003";
const BOB = "00000000-0000-4000-8000-000000000004";
const CAROL = "00000000-0000-4000-8000-000000000005";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-03-02T10:00:00Z").getTime();
const NOW = new Date("2026-06-01T00:00:00Z");

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
const forUser = (rows: Awaited<ReturnType<typeof loadMonthlyAppearances>>, userId: string) =>
  rows.filter((row) => row.userId === userId);

describe("loadMonthlyAppearances multi-round", () => {
  it("counts only the rounds a player attended", async () => {
    await seedCampaign({
      starts: weekly(6),
      confirmed: true,
      attendance: { [ALICE]: [1, 2, 3, 4, 5, 6], [CAROL]: [1, 2, 3, 4, 5, 6], [BOB]: [1, 2, 4, 6] },
    });
    const rows = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    const bob = forUser(rows, BOB);
    expect(bob).toHaveLength(4);
    expect(bob.reduce((sum, row) => sum + row.sessions, 0)).toBe(4);
    expect(rows.every((row) => row.weight >= 0)).toBe(true);
    expect(forUser(rows, GM_ID)).toHaveLength(6);
  });

  it("merges rounds on the same KST day into one appearance", async () => {
    await seedCampaign({
      starts: [BASE, BASE + 4 * HOUR],
      confirmed: true,
      attendance: { [ALICE]: [1, 2], [BOB]: [1], [CAROL]: [2] },
    });
    const rows = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    expect(forUser(rows, ALICE)).toHaveLength(1);
    expect(forUser(rows, BOB)).toHaveLength(1);
    expect(forUser(rows, GM_ID)).toHaveLength(1);
  });

  it("counts every current participant before attendance is confirmed", async () => {
    await seedCampaign({ starts: weekly(3), confirmed: false });
    const rows = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    expect(forUser(rows, ALICE)).toHaveLength(3);
    expect(forUser(rows, BOB)).toHaveLength(3);
  });

  it("내보내지거나 하차한 사람도 출석한 회차는 그대로 센다", async () => {
    await seedCampaign({
      starts: weekly(4),
      confirmed: true,
      attendance: { [ALICE]: [1, 2, 3, 4], [CAROL]: [1, 2, 3, 4], [BOB]: [1, 2] },
      bobState: { status: "removed", leftReason: "mutual" },
    });
    const rows = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    expect(forUser(rows, BOB).filter((row) => row.sessions === 1)).toHaveLength(2);
  });

  it("penalizes a GM kick once in points mode, never a missed round", async () => {
    await db.update(servers).set({ rankingMode: "points" });
    const absenceAt = new Date(BASE + WEEK);
    const gameId = await seedCampaign({
      starts: weekly(4),
      confirmed: true,
      attendance: { [ALICE]: [1, 2, 3, 4], [CAROL]: [1, 2, 3, 4], [BOB]: [1] },
      bobState: { status: "removed", leftReason: "removed", absent: true, absenceAt },
    });
    const rows = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    const penalties = forUser(rows, BOB).filter((row) => row.weight === ABSENCE_POINTS);
    expect(penalties).toHaveLength(2);
    expect(penalties.every((row) => row.startsAt.getTime() === absenceAt.getTime())).toBe(true);
    expect(forUser(rows, ALICE).some((row) => row.weight < 0)).toBe(false);

    await db
      .update(participants)
      .set({ status: "confirmed", leftReason: null, absent: false, absenceAt: null })
      .where(eq(participants.gameId, gameId));
    const after = await loadMonthlyAppearances({ serverId: SERVER_ID, now: NOW });
    expect(after.some((row) => row.weight < 0)).toBe(false);
  });
});
