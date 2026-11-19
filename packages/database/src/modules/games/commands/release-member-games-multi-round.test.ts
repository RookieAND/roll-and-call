import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  gameRounds,
  games,
  notifications,
  participants,
  profiles,
  roundAttendances,
  servers,
} from "#db/schema";

import { releaseMemberGames } from "./release-member-games";

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
const DAY = 24 * HOUR;

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

type Phase = "before" | "during" | "between";

// before: 1회차가 내일, during: 1회차 진행 중, between: 1회차 끝났고 2회차가 닷새 뒤.
async function seedGame(phase: Phase) {
  const now = Date.now();
  const start = { before: now + DAY, during: now - HOUR, between: now - 2 * DAY }[phase];
  const [game] = await db
    .insert(games)
    .values({
      serverId: SERVER_ID,
      gmId: GM_ID,
      title: "campaign",
      rule: "rule",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(now - 7 * DAY),
      confirmedAt: new Date(start),
      playMinutes: 240,
      roundCount: 3,
      roundScheduleKind: "designated",
    })
    .returning();
  const gameId = game!.id;
  const first = {
    before: { start: now + DAY, end: now + DAY + 4 * HOUR, ended: null },
    during: { start: now - HOUR, end: now + 3 * HOUR, ended: null },
    between: {
      start: now - 2 * DAY,
      end: now - 2 * DAY + 4 * HOUR,
      ended: now - 2 * DAY + 4 * HOUR,
    },
  }[phase];
  await db.insert(gameRounds).values([
    {
      serverId: SERVER_ID,
      gameId,
      roundNo: 1,
      startAt: new Date(first.start),
      plannedEndAt: new Date(first.end),
      endedAt: first.ended ? new Date(first.ended) : null,
      status: first.ended ? "finished" : "scheduled",
    },
    ...[2, 3].map((roundNo) => ({
      serverId: SERVER_ID,
      gameId,
      roundNo,
      startAt: new Date(now + (5 + roundNo) * DAY),
      plannedEndAt: new Date(now + (5 + roundNo) * DAY + 4 * HOUR),
      status: "scheduled" as const,
    })),
  ]);
  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId, userId: ALICE, status: "confirmed" },
    { serverId: SERVER_ID, gameId, userId: BOB, status: "confirmed" },
  ]);
  return gameId;
}

const release = (userId: string) =>
  db.transaction((transaction) =>
    releaseMemberGames({
      transaction,
      serverId: SERVER_ID,
      userId,
      cancelKind: "auto",
      actorId: null,
    }),
  );

const participantOf = async (gameId: string, userId: string) =>
  (
    await db
      .select()
      .from(participants)
      .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)))
  )[0];

const gameOf = async (gameId: string) =>
  (await db.select().from(games).where(eq(games.id, gameId)))[0]!;

const attendanceOf = (gameId: string) =>
  db.select().from(roundAttendances).where(eq(roundAttendances.gameId, gameId));

const noticesOf = (gameId: string) =>
  db
    .select()
    .from(notifications)
    .where(eq(notifications.kind, "game_finished_early"))
    .then((rows) => rows.filter((row) => (row.params as { gameId: string }).gameId === gameId));

describe("다회차 참여자가 서버를 떠난다", () => {
  it("시작 전이면 단발처럼 명단에서 지운다", async () => {
    const gameId = await seedGame("before");
    await release(ALICE);
    expect(await participantOf(gameId, ALICE)).toBeUndefined();
    expect((await gameOf(gameId)).cancelledAt).toBeNull();
  });

  it("진행 중인 회차는 참석으로 남기고 server_left로 뺀다", async () => {
    const gameId = await seedGame("during");
    const result = await release(ALICE);
    expect(result.removedRoundGameIds).toEqual([gameId]);
    const alice = await participantOf(gameId, ALICE);
    expect(alice).toMatchObject({ status: "removed", leftReason: "server_left", absent: false });
    expect(alice!.absenceReason).toBeNull();
    const rows = await attendanceOf(gameId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ userId: ALICE, attended: true });
    expect((await participantOf(gameId, BOB))!.status).toBe("confirmed");
    expect((await gameOf(gameId)).finishedAt).toBeNull();
  });

  it("회차 사이에는 출석 행을 만들지 않고 server_left로 뺀다", async () => {
    const gameId = await seedGame("between");
    await release(ALICE);
    expect(await participantOf(gameId, ALICE)).toMatchObject({
      status: "removed",
      leftReason: "server_left",
      absent: false,
    });
    expect(await attendanceOf(gameId)).toHaveLength(0);
  });
});

describe("다회차 GM이 서버를 떠난다", () => {
  it("시작 전이면 구인을 취소한다", async () => {
    const gameId = await seedGame("before");
    const result = await release(GM_ID);
    expect(result.cancelledGames.map((game) => game.id)).toContain(gameId);
    expect((await gameOf(gameId)).cancelledAt).not.toBeNull();
  });

  it("진행 중인 회차를 지금 마치고 조기 종결해 알린다", async () => {
    const gameId = await seedGame("during");
    const result = await release(GM_ID);
    expect(result.finishedEarlyGames.map((game) => game.id)).toEqual([gameId]);
    const game = await gameOf(gameId);
    expect(game).toMatchObject({ incompleteReason: "manual" });
    expect(game.finishedAt).not.toBeNull();
    const rounds = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(rounds).toHaveLength(1);
    expect(rounds[0]!.endedAt).not.toBeNull();
    const notices = await noticesOf(gameId);
    expect(notices.map((row) => row.userId).toSorted()).toEqual([ALICE, BOB].toSorted());
    expect(notices[0]!.params).toMatchObject({ roundNo: 1, reason: "manual", finisher: true });
  });

  it("회차 사이에도 남은 회차를 지우고 조기 종결한다", async () => {
    const gameId = await seedGame("between");
    await release(GM_ID);
    const game = await gameOf(gameId);
    expect(game.incompleteReason).toBe("manual");
    const rounds = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    expect(rounds.map((round) => round.roundNo)).toEqual([1]);
    expect((await noticesOf(gameId)).length).toBe(2);
  });
});
