import { and, asc, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  gameRoundSkips,
  gameRounds,
  games,
  participants,
  profiles,
  roundAttendances,
  servers,
  sessionReviews,
} from "#db/schema";

import { addRound } from "./add-round";
import { autoConfirmRoundAttendance } from "./auto-confirm-round-attendance";
import { confirmRoundAttendance } from "./confirm-round-attendance";
import { endRound } from "./end-round";
import { finishGameEarly } from "./finish-game-early";
import { setRoundCount } from "./set-round-count";
import { skipRound } from "./skip-round";

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

async function seedGame({
  kind = "designated",
  count = 4,
  dated = count,
}: {
  kind?: "designated" | "coordinated";
  count?: number;
  dated?: number;
} = {}) {
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
      roundScheduleKind: kind,
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
        : {
            serverId: SERVER_ID,
            gameId: game!.id,
            roundNo: index + 1,
            status: "unscheduled" as const,
          },
    ),
  );
  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId: game!.id, userId: ALICE, status: "confirmed" },
    { serverId: SERVER_ID, gameId: game!.id, userId: BOB, status: "confirmed" },
  ]);
  return game!.id;
}

const roundsOf = (gameId: string) =>
  db
    .select()
    .from(gameRounds)
    .where(eq(gameRounds.gameId, gameId))
    .orderBy(asc(gameRounds.roundNo));

const gameOf = async (gameId: string) =>
  (await db.select().from(games).where(eq(games.id, gameId)))[0]!;

describe("회차 출석", () => {
  it("빠진 사람만 attended = false로 쓰고 불참 기록은 남기지 않는다", async () => {
    const gameId = await seedGame();
    const result = await db.transaction((transaction) =>
      confirmRoundAttendance({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 1,
        absentUserIds: [BOB],
        at: new Date(BASE + 5 * HOUR),
      }),
    );
    expect(result).toEqual({ absentUserIds: [BOB], presentUserIds: [ALICE] });
    const rows = await db
      .select()
      .from(roundAttendances)
      .where(eq(roundAttendances.gameId, gameId));
    expect(new Map(rows.map((row) => [row.userId, row.attended]))).toEqual(
      new Map([
        [ALICE, true],
        [BOB, false],
      ]),
    );
    const bob = await db
      .select()
      .from(participants)
      .where(and(eq(participants.gameId, gameId), eq(participants.userId, BOB)));
    expect(bob[0]!.absent).toBe(false);
    expect((await roundsOf(gameId))[0]!.status).toBe("finished");
    expect((await gameOf(gameId)).finishedAt).toBeNull();
  });

  it("마지막 회차를 마치면 구인이 끝난다", async () => {
    const gameId = await seedGame({ count: 2 });
    const endedAt = new Date(BASE + WEEK + HOUR);
    await db.transaction((transaction) =>
      endRound({ transaction, serverId: SERVER_ID, gameId, roundNo: 2, endedAt }),
    );
    expect((await gameOf(gameId)).finishedAt).toEqual(endedAt);
  });

  it("종료 24시간이 지난 회차는 전원 참석으로 자동 확정하고 확정 시각을 기한으로 남긴다", async () => {
    const gameId = await seedGame({ count: 2 });
    const deadline = new Date(BASE + 28 * HOUR);
    const early = await autoConfirmRoundAttendance(new Date(deadline.getTime() - 1));
    expect(early.some((round) => round.gameId === gameId)).toBe(false);
    const confirmed = await autoConfirmRoundAttendance(deadline);
    expect(
      confirmed.filter((round) => round.gameId === gameId).map((round) => round.roundNo),
    ).toEqual([1]);
    const [first] = await roundsOf(gameId);
    expect(first!.attendanceConfirmedAt).toEqual(deadline);
    const rows = await db
      .select()
      .from(roundAttendances)
      .where(eq(roundAttendances.roundId, first!.id));
    expect(rows.every((row) => row.attended)).toBe(true);
  });
});

describe("회차 생략", () => {
  it("지정형은 회차를 지우고 뒤 번호를 당기며 출석·후기를 지우고 예정 회차 수를 줄인다", async () => {
    const gameId = await seedGame({ count: 4 });
    const [, second] = await roundsOf(gameId);
    await db.transaction((transaction) =>
      confirmRoundAttendance({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 2,
        absentUserIds: [],
        at: new Date(BASE + WEEK + 5 * HOUR),
      }),
    );
    await db
      .insert(sessionReviews)
      .values({
        serverId: SERVER_ID,
        gameId,
        roundId: second!.id,
        authorId: ALICE,
        body: "좋았다".repeat(10),
      });
    const skipped = await db.transaction((transaction) =>
      skipRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 2,
        at: new Date(BASE + WEEK + 6 * HOUR),
      }),
    );
    expect(skipped).toBe(true);
    const rounds = await roundsOf(gameId);
    expect(rounds.map((round) => round.roundNo)).toEqual([1, 2, 3]);
    expect(rounds[1]!.startAt).toEqual(new Date(BASE + 2 * WEEK));
    expect((await gameOf(gameId)).roundCount).toBe(3);
    expect(
      await db.select().from(roundAttendances).where(eq(roundAttendances.roundId, second!.id)),
    ).toEqual([]);
    expect(
      await db.select().from(sessionReviews).where(eq(sessionReviews.roundId, second!.id)),
    ).toEqual([]);
    const [skip] = await db.select().from(gameRoundSkips).where(eq(gameRoundSkips.gameId, gameId));
    expect(skip).toMatchObject({ roundNo: 2, originalStartAt: new Date(BASE + WEEK) });
  });

  it("조율형은 예정 회차 수를 그대로 두고 맨 뒤에 일시 없는 회차를 채운다", async () => {
    const gameId = await seedGame({ kind: "coordinated", count: 3, dated: 2 });
    await db.transaction((transaction) =>
      skipRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 1,
        at: new Date(BASE + HOUR),
      }),
    );
    const rounds = await roundsOf(gameId);
    expect(rounds.map((round) => [round.roundNo, round.status])).toEqual([
      [1, "scheduled"],
      [2, "unscheduled"],
      [3, "unscheduled"],
    ]);
    expect(rounds[0]!.startAt).toEqual(new Date(BASE + WEEK));
    expect((await gameOf(gameId)).roundCount).toBe(3);
  });

  it("마지막 회차를 생략하면 앞 회차가 끝났을 때 구인이 끝난다", async () => {
    const gameId = await seedGame({ count: 3 });
    await db.transaction(async (transaction) => {
      await endRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 2,
        endedAt: new Date(BASE + WEEK + 2 * HOUR),
      });
      await skipRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        roundNo: 3,
        at: new Date(BASE + 2 * WEEK + HOUR),
      });
    });
    const game = await gameOf(gameId);
    expect(game.roundCount).toBe(2);
    expect(game.finishedAt).toEqual(new Date(BASE + WEEK + 2 * HOUR));
  });
});

describe("조기 종결과 회차 수", () => {
  it("시작하지 않은 회차를 지우고 종결 시각을 구인 종료로 남긴다", async () => {
    const gameId = await seedGame({ count: 4 });
    const at = new Date(BASE + WEEK + HOUR);
    await db.transaction((transaction) =>
      finishGameEarly({ transaction, serverId: SERVER_ID, gameId, reason: "manual", at }),
    );
    expect((await roundsOf(gameId)).map((round) => round.roundNo)).toEqual([1, 2]);
    const game = await gameOf(gameId);
    expect(game).toMatchObject({
      incompleteAt: at,
      incompleteReason: "manual",
      finishedAt: at,
      roundCount: 4,
    });
  });

  it("조율형 회차 수를 늘리면 일시 없는 회차를 붙이고 줄이면 뒤에서 지운다", async () => {
    const gameId = await seedGame({ kind: "coordinated", count: 3, dated: 1 });
    await db.transaction((transaction) =>
      setRoundCount({ transaction, serverId: SERVER_ID, gameId, current: 3, next: 5 }),
    );
    expect((await roundsOf(gameId)).map((round) => round.roundNo)).toEqual([1, 2, 3, 4, 5]);
    await db.transaction((transaction) =>
      setRoundCount({ transaction, serverId: SERVER_ID, gameId, current: 5, next: 2 }),
    );
    expect((await roundsOf(gameId)).map((round) => round.roundNo)).toEqual([1, 2]);
    expect((await gameOf(gameId)).roundCount).toBe(2);
  });

  it("지정형 회차 추가는 맨 뒤 번호로 붙고 겹치면 거부한다", async () => {
    const gameId = await seedGame({ count: 2 });
    const roundNo = await db.transaction((transaction) =>
      addRound({
        transaction,
        serverId: SERVER_ID,
        gameId,
        startAt: new Date(BASE + 2 * WEEK),
        plannedEndAt: new Date(BASE + 2 * WEEK + 4 * HOUR),
      }),
    );
    expect(roundNo).toBe(3);
    expect((await gameOf(gameId)).roundCount).toBe(3);
    await expect(
      db.transaction((transaction) =>
        addRound({
          transaction,
          serverId: SERVER_ID,
          gameId,
          startAt: new Date(BASE + 2 * WEEK + HOUR),
          plannedEndAt: new Date(BASE + 2 * WEEK + 3 * HOUR),
        }),
      ),
    ).rejects.toThrow();
    expect((await gameOf(gameId)).roundCount).toBe(3);
  });
});
