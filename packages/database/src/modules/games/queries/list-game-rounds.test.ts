import { beforeAll, describe, expect, it, vi } from "vitest";

import { profiles, servers } from "#db/schema";

import { createGameWithRoster } from "../commands/create-game-with-roster";
import { listGameRounds } from "./list-game-rounds";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const OTHER_SERVER_ID = "00000000-0000-4000-8000-000000000002";
const GM = "00000000-0000-4000-8000-000000000010";
const START = new Date("2026-12-05T03:00:00Z");

beforeAll(async () => {
  const { db } = await import("#db/client");
  await db.insert(servers).values([
    { id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" },
    { id: OTHER_SERVER_ID, discordGuildId: "guild2", slug: "other", name: "other" },
  ]);
  await db.insert(profiles).values({ id: GM, discordId: "gm", username: "gm" });
});

describe("listGameRounds", () => {
  it("일시가 없는 회차까지 번호 순서로 돌려주고 다른 서버에서는 비어 있다", async () => {
    const gameId = await createGameWithRoster({
      serverId: SERVER_ID,
      columns: {
        gmId: GM,
        title: "campaign",
        rule: "크툴루의 부름 7판",
        scheduleMode: "fixed",
        maxPlayers: 4,
        endDate: START,
        playMinutes: 240,
        roundCount: 3,
        roundScheduleKind: "coordinated",
      },
      confirmedUserIds: [],
      rounds: [
        {
          roundNo: 1,
          status: "coordinating",
          coordinationStart: "2026-12-05",
          coordinationEnd: "2026-12-18",
          coordinationTimezone: "Asia/Seoul",
        },
        { roundNo: 3, status: "unscheduled" },
        { roundNo: 2, status: "unscheduled" },
      ],
    });
    const rounds = await listGameRounds({ serverId: SERVER_ID, gameId });
    expect(rounds.map((round) => round.roundNo)).toEqual([1, 2, 3]);
    expect(rounds[0]).toMatchObject({
      status: "coordinating",
      startAt: null,
      coordinationStart: "2026-12-05",
      coordinationEnd: "2026-12-18",
    });
    expect(rounds[2]).toMatchObject({ status: "unscheduled", startAt: null });
    expect(await listGameRounds({ serverId: OTHER_SERVER_ID, gameId })).toEqual([]);
  });
});
