import { readFileSync } from "node:fs";

import { eq, sql } from "drizzle-orm";
import { expect, it, vi } from "vitest";

import { games, profiles, servers } from "#db/schema";

import { createGameWithRoster } from "./create-game-with-roster";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

it("기존 제약을 마이그레이션한 뒤 지정 모집의 일정 조율 구인을 저장한다", async () => {
  const serverId = "00000000-0000-4000-8000-000000000001";
  const userId = "00000000-0000-4000-8000-000000000002";
  await db
    .insert(servers)
    .values({ id: serverId, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values({ id: userId, discordId: "gm", username: "gm" });
  await db.execute(
    sql`alter table games add constraint games_private_fixed check (visibility = 'public' or schedule_mode = 'fixed')`,
  );

  const columns = {
    gmId: userId,
    title: "ITHACA",
    rule: "크툴루의 부름 7판",
    visibility: "private" as const,
    scheduleMode: "coordinate" as const,
    maxPlayers: 4,
    endDate: new Date("2026-11-23T15:00:00Z"),
    rangeStart: "2026-11-24",
    rangeEnd: "2026-11-30",
    windowStartHour: 12,
    windowEndHour: 0,
  };
  await expect(createGameWithRoster({ serverId, columns, confirmedUserIds: [] })).rejects.toThrow();

  const migration = readFileSync(
    new URL("../../../../drizzle/0134_allow_private_coordinate.sql", import.meta.url),
    "utf8",
  );
  await db.execute(sql.raw(migration));
  const id = await createGameWithRoster({ serverId, columns, confirmedUserIds: [] });
  const [saved] = await db.select().from(games).where(eq(games.id, id));
  expect(saved).toMatchObject({
    visibility: "private",
    scheduleMode: "coordinate",
    rangeStart: "2026-11-24",
    rangeEnd: "2026-11-30",
  });
});
