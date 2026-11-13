import { and, eq, sql } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { insertReview } from "#db/modules/reviews/commands/insert-review";
import { gameRounds, games, participants, profiles, servers, sessionReviews } from "#db/schema";

import { cancelGame } from "./cancel-game";
import { confirmGameSession } from "./confirm-game-session";
import { createGameWithRoster } from "./create-game-with-roster";
import { setSessionEndedAt } from "./end-session";
import { markAttendanceConfirmed } from "./mark-attendance-confirmed";
import { updateOwnedGame } from "./update-owned-game";

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

async function createGame(columns: Record<string, unknown> = {}) {
  const gameId = await createGameWithRoster({
    serverId: SERVER_ID,
    columns: {
      gmId: GM_ID,
      title: "game",
      rule: "크툴루의 부름 7판",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(),
      confirmedAt: new Date(Date.now() + 48 * HOUR),
      playMinutes: 240,
      ...columns,
    },
    confirmedUserIds: [PLAYER_ID],
  });
  return gameId;
}

// 단발 구인에서 games의 시간·출석 값과 회차 1의 값이 같아야 한다.
async function expectMirrored(gameId: string) {
  const [game] = await db.select().from(games).where(eq(games.id, gameId));
  const rounds = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
  expect(rounds).toHaveLength(1);
  const round = rounds[0]!;
  expect(round.roundNo).toBe(1);
  expect(round.startAt).toEqual(game!.confirmedAt);
  expect(round.endedAt).toEqual(game!.endedAt);
  expect(round.attendanceConfirmedAt).toEqual(game!.attendanceConfirmedAt);
  return { game: game!, round };
}

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
});

describe("단발 구인의 회차 1 이중 쓰기", () => {
  it("구인을 만들면 회차 1이 같이 생긴다", async () => {
    const gameId = await createGame();
    const { round } = await expectMirrored(gameId);
    expect(round).toMatchObject({ status: "scheduled" });
    expect(round.plannedEndAt!.getTime() - round.startAt!.getTime()).toBe(4 * HOUR);
  });

  it("일시 없는 조율형은 coordinating 회차가 된다", async () => {
    const gameId = await createGame({
      scheduleMode: "coordinate",
      confirmedAt: null,
      rangeStart: "2026-12-01",
      rangeEnd: "2026-12-07",
    });
    const { round } = await expectMirrored(gameId);
    expect(round).toMatchObject({ status: "coordinating", startAt: null });
  });

  it("일정 확정과 수정이 회차 1에 따라온다", async () => {
    const gameId = await createGame({
      scheduleMode: "coordinate",
      confirmedAt: null,
      rangeStart: "2026-12-01",
      rangeEnd: "2026-12-07",
    });
    const confirmedAt = new Date(Date.now() + 72 * HOUR);
    expect(
      await confirmGameSession({ serverId: SERVER_ID, gameId, gmId: GM_ID, confirmedAt }),
    ).toBe(true);
    expect((await expectMirrored(gameId)).round.startAt).toEqual(confirmedAt);

    await updateOwnedGame({
      serverId: SERVER_ID,
      gameId,
      gmId: GM_ID,
      columns: { playMinutes: 120 },
    });
    const { round } = await expectMirrored(gameId);
    expect(round.plannedEndAt!.getTime() - round.startAt!.getTime()).toBe(2 * HOUR);

    await updateOwnedGame({
      serverId: SERVER_ID,
      gameId,
      gmId: GM_ID,
      columns: { confirmedAt: null },
    });
    expect((await expectMirrored(gameId)).round.status).toBe("coordinating");
  });

  it("세션 마치기와 출석 확정이 회차 1에 따라온다", async () => {
    const gameId = await createGame({ confirmedAt: new Date(Date.now() - 3 * HOUR) });
    await db.transaction(async (transaction) => {
      await setSessionEndedAt({
        transaction,
        serverId: SERVER_ID,
        gameId,
        endedAt: new Date(Date.now() - HOUR),
      });
      await markAttendanceConfirmed({ transaction, serverId: SERVER_ID, gameId, at: new Date() });
    });
    const { round } = await expectMirrored(gameId);
    expect(round.status).toBe("finished");
    expect(round.attendanceConfirmedAt).not.toBeNull();

    await db.transaction((transaction) =>
      setSessionEndedAt({ transaction, serverId: SERVER_ID, gameId, endedAt: null }),
    );
    expect((await expectMirrored(gameId)).round.endedAt).toBeNull();
  });

  it("취소하면 회차 1이 cancelling이 되고 finished_at은 비어 있다", async () => {
    const gameId = await createGame();
    const result = await cancelGame({
      serverId: SERVER_ID,
      gameId,
      kind: "gm",
      actorId: GM_ID,
      reason: null,
    });
    expect(result.ok).toBe(true);
    const { game, round } = await expectMirrored(gameId);
    expect(round.status).toBe("cancelling");
    expect(game.finishedAt).toBeNull();
  });

  it("참여자의 불참 표시와 대기 이동이 회차 1 출석에 따라온다", async () => {
    const gameId = await createGame();
    const attendance = async () =>
      (await db.execute<{ attended: boolean }>(
        // PGlite와 postgres-js의 결과 모양이 달라 값만 꺼낸다.
        sqlAttendance(gameId),
      )) as unknown as { rows: { attended: boolean }[] };
    expect((await attendance()).rows).toEqual([{ attended: true }]);
    await db
      .update(participants)
      .set({ absent: true })
      .where(and(eq(participants.gameId, gameId), eq(participants.userId, PLAYER_ID)));
    expect((await attendance()).rows).toEqual([{ attended: false }]);
    await db
      .update(participants)
      .set({ status: "waiting", absent: false })
      .where(and(eq(participants.gameId, gameId), eq(participants.userId, PLAYER_ID)));
    expect((await attendance()).rows).toEqual([]);
  });

  it("후기는 회차 1에 연결된다", async () => {
    const gameId = await createGame();
    const reviewId = await insertReview({
      serverId: SERVER_ID,
      gameId,
      authorId: PLAYER_ID,
      authorRole: "participant",
      body: "후기 본문은 스무 글자를 넘겨야 합니다 정말로요",
      spoiler: false,
      photoUrls: [],
    });
    const { round } = await expectMirrored(gameId);
    const [saved] = await db.select().from(sessionReviews).where(eq(sessionReviews.id, reviewId!));
    expect(saved!.roundId).toBe(round.id);
  });
});

function sqlAttendance(gameId: string) {
  return sql`select attended from round_attendances where game_id = ${gameId}`;
}
