import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, participants, profiles, roundAttendances, servers } from "#db/schema";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");
const { loadBadgeFacts } = await import("./load-badge-facts");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const ALICE = "00000000-0000-4000-8000-000000000003";
const BOB = "00000000-0000-4000-8000-000000000004";
const CAROL = "00000000-0000-4000-8000-000000000005";
const DAVE = "00000000-0000-4000-8000-000000000006";
const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-01-03T10:00:00Z").getTime();

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: ALICE, discordId: "alice", username: "alice" },
    { id: BOB, discordId: "bob", username: "bob" },
    { id: CAROL, discordId: "carol", username: "carol" },
    { id: DAVE, discordId: "dave", username: "dave" },
  ]);
});

async function seedCampaign({
  finished,
  confirmedRounds = 6,
  attendedByAlice = [1, 2, 3, 4, 5, 6],
}: {
  finished: boolean;
  confirmedRounds?: number;
  attendedByAlice?: number[];
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
      playMinutes: 240,
      roundCount: 6,
      roundScheduleKind: "designated",
      finishedAt: finished ? new Date(BASE + 5 * WEEK + 4 * HOUR) : null,
    })
    .returning();
  const gameId = game!.id;
  const rounds = await db
    .insert(gameRounds)
    .values(
      Array.from({ length: 6 }, (_, index) => ({
        serverId: SERVER_ID,
        gameId,
        roundNo: index + 1,
        startAt: new Date(BASE + index * WEEK),
        plannedEndAt: new Date(BASE + index * WEEK + 4 * HOUR),
        attendanceConfirmedAt:
          index < confirmedRounds ? new Date(BASE + index * WEEK + 5 * HOUR) : null,
        // 마지막 회차가 끝나면 트리거가 finished_at을 채우므로 안 끝난 캠페인은 예정으로 둔다.
        status: finished ? ("finished" as const) : ("scheduled" as const),
      })),
    )
    .returning();
  await db.insert(participants).values([
    { serverId: SERVER_ID, gameId, userId: ALICE, status: "confirmed" as const },
    { serverId: SERVER_ID, gameId, userId: BOB, status: "confirmed" as const },
    { serverId: SERVER_ID, gameId, userId: CAROL, status: "confirmed" as const, lateJoined: true },
    {
      serverId: SERVER_ID,
      gameId,
      userId: DAVE,
      status: "confirmed" as const,
      leftReason: "mutual" as const,
    },
  ]);
  await db.insert(roundAttendances).values(
    rounds
      .filter((round) => round.roundNo <= confirmedRounds)
      .flatMap((round) =>
        [ALICE, BOB, CAROL, DAVE].map((userId) => ({
          serverId: SERVER_ID,
          roundId: round.id,
          gameId,
          userId,
          attended: userId === ALICE ? attendedByAlice.includes(round.roundNo) : true,
        })),
      ),
  );
  return gameId;
}

const forGame = <Row extends { gameId: string | null }>(rows: Row[], gameId: string) =>
  rows.filter((row) => row.gameId === gameId);

describe("다회차 뱃지 근거", () => {
  it("끝난 캠페인은 구인 한 건으로 세고 회차별로는 참석한 회차만 센다", async () => {
    const gameId = await seedCampaign({ finished: true, attendedByAlice: [1, 2, 3, 4] });
    const facts = await loadBadgeFacts({ serverId: SERVER_ID, userId: ALICE });
    expect(forGame(facts.played, gameId)).toHaveLength(1);
    expect(forGame(facts.played, gameId)[0]!.endsAt).toEqual(new Date(BASE + 5 * WEEK + 4 * HOUR));
    expect(forGame(facts.playedRounds, gameId)).toHaveLength(4);
    expect(forGame(facts.absences, gameId)).toHaveLength(0);
    const gm = await loadBadgeFacts({ serverId: SERVER_ID, userId: GM_ID });
    expect(forGame(gm.hosted, gameId)).toHaveLength(1);
    expect(forGame(gm.hostedRounds, gameId)).toHaveLength(6);
  });

  it("끝나지 않은 캠페인은 구인으로 세지 않고 출석을 확정하고 끝난 회차만 센다", async () => {
    const gameId = await seedCampaign({ finished: false, confirmedRounds: 3 });
    const facts = await loadBadgeFacts({ serverId: SERVER_ID, userId: ALICE });
    expect(forGame(facts.played, gameId)).toHaveLength(0);
    expect(forGame(facts.playedRounds, gameId)).toHaveLength(3);
  });

  it("중도 합류자와 합의 하차자는 완주로 세지 않는다", async () => {
    const gameId = await seedCampaign({ finished: true });
    for (const userId of [CAROL, DAVE]) {
      const facts = await loadBadgeFacts({ serverId: SERVER_ID, userId });
      expect(forGame(facts.played, gameId)).toHaveLength(0);
    }
  });

  it("GM이 불참으로 내보낸 사람만 불참 기록이 되고 시각은 absence_at이다", async () => {
    const gameId = await seedCampaign({ finished: true });
    const absenceAt = new Date(BASE + 2 * WEEK);
    await db.insert(participants).values({
      serverId: SERVER_ID,
      gameId,
      userId: GM_ID,
      status: "removed",
      leftReason: "removed",
      absent: true,
      absenceAt,
    });
    const facts = await loadBadgeFacts({ serverId: SERVER_ID, userId: GM_ID });
    expect(forGame(facts.absences, gameId)).toEqual([{ at: absenceAt, gameId }]);
  });

  it("단발은 첫 회차 기준 그대로 played·hosted·absences로 읽는다", async () => {
    const [game] = await db
      .insert(games)
      .values({
        serverId: SERVER_ID,
        gmId: GM_ID,
        title: "single",
        rule: "rule",
        scheduleMode: "fixed",
        maxPlayers: 4,
        endDate: new Date(BASE - WEEK),
        confirmedAt: new Date(BASE),
        playMinutes: 240,
      })
      .returning();
    const gameId = game!.id;
    await db.insert(gameRounds).values({
      serverId: SERVER_ID,
      gameId,
      roundNo: 1,
      startAt: new Date(BASE),
      plannedEndAt: new Date(BASE + 4 * HOUR),
      attendanceConfirmedAt: new Date(BASE + 5 * HOUR),
      status: "finished",
    });
    await db.insert(participants).values([
      { serverId: SERVER_ID, gameId, userId: ALICE, status: "confirmed" },
      { serverId: SERVER_ID, gameId, userId: CAROL, status: "confirmed" },
      { serverId: SERVER_ID, gameId, userId: BOB, status: "confirmed", absent: true },
    ]);
    const alice = await loadBadgeFacts({ serverId: SERVER_ID, userId: ALICE });
    expect(forGame(alice.played, gameId)).toHaveLength(1);
    expect(forGame(alice.playedRounds, gameId)).toHaveLength(1);
    const bob = await loadBadgeFacts({ serverId: SERVER_ID, userId: BOB });
    expect(forGame(bob.played, gameId)).toHaveLength(0);
    expect(forGame(bob.absences, gameId)).toEqual([{ at: new Date(BASE), gameId }]);
    const gm = await loadBadgeFacts({ serverId: SERVER_ID, userId: GM_ID });
    expect(forGame(gm.hosted, gameId)).toHaveLength(1);
  });
});
