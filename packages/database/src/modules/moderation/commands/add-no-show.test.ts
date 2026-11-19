import { beforeAll, describe, expect, it, vi } from "vitest";

import { games, profiles, servers } from "#db/schema";

import { ABSENCE_ADDED_TAG } from "../../games/model/absence-added-tag";
import { addNoShow, MULTI_ROUND_NO_SHOW_ERROR } from "./add-no-show";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const PLAYER_ID = "00000000-0000-4000-8000-000000000003";
const GAME_ID = "00000000-0000-4000-8000-000000000004";

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
  await db.insert(games).values({
    id: GAME_ID,
    serverId: SERVER_ID,
    gmId: GM_ID,
    title: "campaign",
    rule: "크툴루의 부름 7판",
    scheduleMode: "fixed",
    maxPlayers: 4,
    endDate: new Date("2026-12-20T00:00:00Z"),
    playMinutes: 240,
    roundCount: 2,
  });
});

describe("불참 기록 추가", () => {
  it("여러 번 진행하는 구인은 막는다", async () => {
    await expect(
      addNoShow({
        serverId: SERVER_ID,
        gameId: GAME_ID,
        userId: PLAYER_ID,
        actor: { id: GM_ID, name: "gm" } as never,
        tag: ABSENCE_ADDED_TAG.other,
        reason: "사유",
      }),
    ).rejects.toThrow(MULTI_ROUND_NO_SHOW_ERROR);
  });
});
