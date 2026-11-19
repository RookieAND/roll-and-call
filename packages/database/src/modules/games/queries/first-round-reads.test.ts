import { eq, sql } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { recognizedGamesWhere } from "#db/modules/badges/queries/recognized-games-where";
import { games, profiles, servers } from "#db/schema";

import { autoConfirmAttendance } from "../commands/auto-confirm-attendance";
import { createGameWithRoster } from "../commands/create-game-with-roster";
import { markAttendanceConfirmed } from "../commands/mark-attendance-confirmed";
import { notifyReviewAvailable } from "../commands/notify-review-available";
import { gameBucketSql } from "./game-bucket-sql";
import { gameFiltersWhere } from "./game-filters-where";
import { getMonthSessions } from "./get-month-sessions";
import { getUserConfirmedSlots } from "./get-user-confirmed-slots";
import { hasSessionsBetween } from "./has-sessions-between";
import { listDueLotteries } from "./list-due-lotteries";
import { notStartedGamesWhere } from "./not-started-games-where";

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
const NOW = Date.now();

const ids: Record<
  "upcoming" | "running" | "ended" | "attended" | "coordinating" | "lottery",
  string
> = {} as never;

async function createGame(
  title: string,
  columns: Partial<typeof games.$inferInsert>,
  confirmed: string[] = [PLAYER_ID],
) {
  return createGameWithRoster({
    serverId: SERVER_ID,
    columns: {
      gmId: GM_ID,
      title,
      rule: "크툴루의 부름 7판",
      scheduleMode: "fixed",
      maxPlayers: 4,
      endDate: new Date(NOW - 100 * HOUR),
      playMinutes: 240,
      ...columns,
    },
    confirmedUserIds: confirmed,
  });
}

async function idsWhere(where: ReturnType<typeof sql>) {
  const rows = await db.select({ id: games.id }).from(games).where(where);
  return rows.map((row) => row.id);
}

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
  ids.upcoming = await createGame("upcoming", { confirmedAt: new Date(NOW + 48 * HOUR) });
  ids.running = await createGame("running", { confirmedAt: new Date(NOW - HOUR) });
  ids.ended = await createGame("ended", { confirmedAt: new Date(NOW - 48 * HOUR) });
  ids.attended = await createGame("attended", { confirmedAt: new Date(NOW - 72 * HOUR) });
  await db.transaction((transaction) =>
    markAttendanceConfirmed({
      transaction,
      serverId: SERVER_ID,
      gameId: ids.attended,
      at: new Date(NOW - 60 * HOUR),
    }),
  );
  ids.coordinating = await createGame("coordinating", {
    scheduleMode: "coordinate",
    confirmedAt: null,
    rangeStart: "2026-12-01",
    rangeEnd: "2026-12-07",
  });
  ids.lottery = await createGame("lottery", {
    recruitMethod: "lottery",
    confirmedAt: new Date(NOW + 24 * HOUR),
  });
});

describe("회차 1에서 읽는 쿼리", () => {
  it("월간 세션과 존재 여부", async () => {
    const from = new Date(NOW + 47 * HOUR);
    const to = new Date(NOW + 49 * HOUR);
    const rows = await getMonthSessions({ serverId: SERVER_ID, from, to });
    expect(rows.map((row) => row.id)).toEqual([ids.upcoming]);
    expect(await hasSessionsBetween({ serverId: SERVER_ID, from, to })).toBe(true);
    const empty = new Date(NOW + 400 * HOUR);
    expect(
      await hasSessionsBetween({
        serverId: SERVER_ID,
        from: empty,
        to: new Date(NOW + 500 * HOUR),
      }),
    ).toBe(false);
  });

  it("목록 버킷: 끝난 구인과 아직 시작하지 않은 구인", async () => {
    const { ended } = gameBucketSql({ now: new Date(NOW) });
    expect((await idsWhere(ended)).toSorted()).toEqual([ids.ended, ids.attended].toSorted());
    expect((await idsWhere(notStartedGamesWhere(SERVER_ID)! as never)).toSorted()).toEqual(
      [ids.upcoming, ids.coordinating, ids.lottery].toSorted(),
    );
  });

  it("요일·시간대 필터는 회차 1의 시작 시각을 본다", async () => {
    const kst = new Date(NOW + 48 * HOUR + 9 * HOUR);
    const where = gameFiltersWhere({ days: [kst.getUTCDay()], includeUnscheduled: false });
    expect(await idsWhere(where!)).toContain(ids.upcoming);
    const other = gameFiltersWhere({
      days: [(kst.getUTCDay() + 3) % 7],
      includeUnscheduled: false,
    });
    expect(await idsWhere(other!)).not.toContain(ids.upcoming);
  });

  it("진행 횟수 필터는 round_count로 한 번과 여러 번을 가른다", async () => {
    await db.update(games).set({ roundCount: 3 }).where(eq(games.id, ids.upcoming));
    const multi = await idsWhere(gameFiltersWhere({ rounds: "multi" })!);
    const once = await idsWhere(gameFiltersWhere({ rounds: "once" })!);
    await db.update(games).set({ roundCount: 1 }).where(eq(games.id, ids.upcoming));
    expect(multi).toEqual([ids.upcoming]);
    expect(once).not.toContain(ids.upcoming);
    expect(once).toContain(ids.running);
  });

  it("확정 칸은 회차 1의 시각으로 막는다", async () => {
    const slots = await getUserConfirmedSlots({
      serverId: SERVER_ID,
      userId: PLAYER_ID,
      excludeGameId: ids.upcoming,
    });
    expect(slots.length).toBeGreaterThan(0);
  });

  it("인정 세션은 끝났고 출석을 확정한 구인뿐이다", async () => {
    expect(await idsWhere(recognizedGamesWhere)).toEqual([ids.attended]);
  });

  it("마감 크론: 시작 전 추첨 구인을 집는다", async () => {
    const { due } = await listDueLotteries({ now: new Date(NOW) });
    expect(due.map((row) => row.id)).toEqual([ids.lottery]);
  });

  it("출석 자동 확정과 후기 알림은 회차 1의 종료를 기준으로 돈다", async () => {
    const confirmed = await autoConfirmAttendance(new Date(NOW), 50);
    expect(confirmed.map((game) => game.gameId)).toEqual([ids.ended]);
    const { ended } = await notifyReviewAvailable({ now: new Date(NOW) });
    expect(ended.map((game) => game.gameId).toSorted()).toEqual(
      [ids.ended, ids.attended].toSorted(),
    );
    const [saved] = await db.select().from(games).where(eq(games.id, ids.running));
    expect(saved!.reviewNotifiedAt).toBeNull();
  });
});
