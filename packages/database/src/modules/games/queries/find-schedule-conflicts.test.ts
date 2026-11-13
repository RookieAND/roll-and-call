import { beforeAll, describe, expect, it, vi } from "vitest";

import { games, participants, profiles, servers } from "#db/schema";

import { cancelGame } from "../commands/cancel-game";
import { createGameWithRoster } from "../commands/create-game-with-roster";
import { findScheduleConflicts } from "./find-schedule-conflicts";
import { listDatedRounds } from "./list-dated-rounds";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM = "00000000-0000-4000-8000-000000000010";
const CONFIRMED = "00000000-0000-4000-8000-000000000011";
const WAITING = "00000000-0000-4000-8000-000000000012";
const REMOVED = "00000000-0000-4000-8000-000000000013";
const OUTSIDER = "00000000-0000-4000-8000-000000000014";
const HOUR = 3_600_000;
const NOW = new Date("2026-12-01T00:00:00Z");
const at = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

async function createGame(
  startHours: number,
  roster: { confirmed?: string[]; waiting?: string[] } = {},
  gmId = GM,
) {
  return createGameWithRoster({
    serverId: SERVER_ID,
    columns: {
      gmId,
      title: "game",
      rule: "크툴루의 부름 7판",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: at(-10),
      confirmedAt: at(startHours),
      playMinutes: 240,
    },
    confirmedUserIds: roster.confirmed ?? [],
    waitingUserIds: roster.waiting ?? [],
  });
}

const target = (startHours: number, roundNo = 1) => [
  { roundNo, startsAt: at(startHours), endsAt: at(startHours + 4) },
];

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values(
    [GM, CONFIRMED, WAITING, REMOVED, OUTSIDER].map((id, index) => ({
      id,
      discordId: `user-${index}`,
      username: `user-${index}`,
    })),
  );
});

describe("findScheduleConflicts", () => {
  it("GM·확정·대기 각자의 다른 세션과 겹치면 사람과 회차를 돌려준다", async () => {
    // 목표 구인은 아직 없는 새 구인(등록)이다. 다른 세션 셋이 12/10 12:00~16:00에 있다.
    await createGame(24 * 9 + 12, { confirmed: [CONFIRMED] }, OUTSIDER);
    await createGame(24 * 9 + 12, { waiting: [WAITING] }, OUTSIDER);
    await createGame(24 * 9 + 12, {}, GM);
    const conflicts = await findScheduleConflicts({
      serverId: SERVER_ID,
      gameId: null,
      people: [
        { userId: GM, role: "gm" },
        { userId: CONFIRMED, role: "confirmed" },
        { userId: WAITING, role: "waiting" },
        { userId: REMOVED, role: "confirmed" },
      ],
      target: [...target(24 * 9 + 13), ...target(24 * 16 + 13, 2)],
      now: NOW,
    });
    expect(conflicts.map(({ userId, role, roundNos }) => ({ userId, role, roundNos }))).toEqual([
      { userId: GM, role: "gm", roundNos: [1] },
      { userId: CONFIRMED, role: "confirmed", roundNos: [1] },
      { userId: WAITING, role: "waiting", roundNos: [1] },
    ]);
    expect(conflicts[0]!.overlaps).toMatchObject([
      { targetRoundNo: 1, gameTitle: "game", roundNo: 1, startsAt: at(24 * 9 + 12) },
    ]);
  });

  it("뒤 회차만 겹쳐도 잡고 맞닿는 시간은 겹침이 아니다", async () => {
    await createGame(24 * 30 + 12, {}, OUTSIDER);
    const people = [{ userId: OUTSIDER, role: "gm" as const }];
    const second = await findScheduleConflicts({
      serverId: SERVER_ID,
      gameId: null,
      people,
      target: [...target(24 * 20), ...target(24 * 30 + 13, 2)],
      now: NOW,
    });
    expect(second).toMatchObject([{ userId: OUTSIDER, role: "gm", roundNos: [2] }]);
    const touching = await findScheduleConflicts({
      serverId: SERVER_ID,
      gameId: null,
      people,
      target: target(24 * 30 + 16),
      now: NOW,
    });
    expect(touching).toEqual([]);
  });

  it("내보낸 사람·취소한 구인·이미 끝난 세션·목표 구인 자신은 보지 않는다", async () => {
    const removedGame = await createGame(24 * 40, {}, OUTSIDER);
    await db.insert(participants).values({
      serverId: SERVER_ID,
      gameId: removedGame,
      userId: REMOVED,
      status: "removed",
      absent: true,
    });
    const cancelled = await createGame(24 * 41, {}, REMOVED);
    await cancelGame({
      serverId: SERVER_ID,
      gameId: cancelled,
      kind: "gm",
      actorId: REMOVED,
      reason: null,
      allowStarted: true,
      now: NOW,
    });
    await createGame(-48, {}, REMOVED);
    const own = await createGame(24 * 42, {}, REMOVED);
    const people = [{ userId: REMOVED, role: "confirmed" as const }];
    for (const hours of [24 * 40, 24 * 41, -48]) {
      expect(
        await findScheduleConflicts({
          serverId: SERVER_ID,
          gameId: null,
          people,
          target: target(hours),
          now: NOW,
        }),
      ).toEqual([]);
    }
    expect(
      await findScheduleConflicts({
        serverId: SERVER_ID,
        gameId: own,
        people,
        target: target(24 * 42),
        now: NOW,
      }),
    ).toEqual([]);
    expect(await listDatedRounds({ gameId: own })).toHaveLength(1);
    expect((await db.select().from(games)).length).toBeGreaterThan(0);
  });
});
