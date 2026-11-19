import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { availabilities, gameRounds, games, profiles, servers } from "#db/schema";

import { getGameAvailabilities } from "../queries/get-game-availabilities";
import { closeRoundCoordination } from "./close-round-coordination";
import { openRoundCoordination } from "./open-round-coordination";
import { purgeRoundAvailabilities } from "./purge-round-availabilities";
import { replaceAvailability } from "./replace-availability";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const DAY = 24 * 3_600_000;
const NOW = new Date("2026-12-31T00:00:00Z");
const SLOT = new Date("2026-12-05T10:00:00Z");

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values({ id: GM_ID, discordId: "gm", username: "gm" });
});

async function seedGame({
  roundCount,
  confirmedDaysAgo,
}: {
  roundCount: number;
  confirmedDaysAgo?: number;
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
      endDate: new Date(NOW.getTime() - 60 * DAY),
      confirmedAt: new Date(NOW.getTime() - 60 * DAY),
      playMinutes: 240,
      roundCount,
    })
    .returning();
  await db.insert(gameRounds).values({
    serverId: SERVER_ID,
    gameId: game!.id,
    roundNo: 1,
    attendanceConfirmedAt:
      confirmedDaysAgo === undefined ? null : new Date(NOW.getTime() - confirmedDaysAgo * DAY),
  });
  return game!.id;
}

describe("회차별 가능 시간", () => {
  it("1회차 값이 2회차에 섞이지 않음", async () => {
    const gameId = await seedGame({ roundCount: 2 });
    const owner = { serverId: SERVER_ID, gameId, userId: GM_ID };
    await replaceAvailability({ ...owner, slotStarts: [SLOT] });
    await replaceAvailability({
      ...owner,
      roundNo: 2,
      slotStarts: [new Date(SLOT.getTime() + DAY)],
    });
    await replaceAvailability({ ...owner, roundNo: 2, slotStarts: [] });
    const first = await getGameAvailabilities({ serverId: SERVER_ID, gameId, roundNo: 1 });
    const second = await getGameAvailabilities({ serverId: SERVER_ID, gameId, roundNo: 2 });
    expect(first.map((row) => row.slotStart)).toEqual([SLOT]);
    expect(second).toEqual([]);
  });

  it("조율을 열면 그 회차 응답만 비우고 일정은 유지, 닫으면 상태가 돌아온다", async () => {
    const gameId = await seedGame({ roundCount: 2 });
    const owner = { serverId: SERVER_ID, gameId, userId: GM_ID };
    await db
      .update(gameRounds)
      .set({
        startAt: SLOT,
        plannedEndAt: new Date(SLOT.getTime() + 3_600_000),
        status: "scheduled",
      })
      .where(eq(gameRounds.gameId, gameId));
    await replaceAvailability({ ...owner, slotStarts: [SLOT] });
    await replaceAvailability({ ...owner, roundNo: 2, slotStarts: [SLOT] });
    await db.transaction((transaction) =>
      openRoundCoordination({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 2,
        start: "2027-01-01",
        end: "2027-01-07",
        windowStartHour: 20,
        windowEndHour: 2,
        timezone: "Asia/Seoul",
      }),
    );
    await db.transaction((transaction) =>
      openRoundCoordination({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 1,
        start: "2027-01-01",
        end: "2027-01-07",
        windowStartHour: 20,
        windowEndHour: 2,
        timezone: "Asia/Seoul",
      }),
    );
    const rows = await db.select().from(availabilities).where(eq(availabilities.gameId, gameId));
    expect(rows).toEqual([]);
    const [round] = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(round).toMatchObject({ status: "coordinating", coordinationWindowStartHour: 20 });
    expect(round!.startAt).toEqual(SLOT);
    await db.transaction((transaction) =>
      closeRoundCoordination({ transaction, serverId: SERVER_ID, gameId, roundNo: 1 }),
    );
    const [closed] = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(closed!.status).toBe("scheduled");
  });
});

describe("purgeRoundAvailabilities", () => {
  it("다회차는 출석 확정 29일째 남기고 30일째 지운다", async () => {
    const kept = await seedGame({ roundCount: 2, confirmedDaysAgo: 29 });
    const purged = await seedGame({ roundCount: 2, confirmedDaysAgo: 30 });
    const single = await seedGame({ roundCount: 1, confirmedDaysAgo: 40 });
    for (const gameId of [kept, purged, single]) {
      await replaceAvailability({ serverId: SERVER_ID, gameId, userId: GM_ID, slotStarts: [SLOT] });
    }
    await purgeRoundAvailabilities({ now: NOW });
    const left = async (gameId: string) =>
      (
        await db
          .select()
          .from(availabilities)
          .where(and(eq(availabilities.gameId, gameId)))
      ).length;
    expect([await left(kept), await left(purged), await left(single)]).toEqual([1, 0, 1]);
  });
});
