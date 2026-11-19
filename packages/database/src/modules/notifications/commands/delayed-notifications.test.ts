import { beforeAll, describe, expect, it, vi } from "vitest";

import { profiles, servers } from "#db/schema";

import { countUnreadNotifications } from "../queries/count-unread-notifications";
import { createDelayedNotifications } from "./create-delayed-notifications";
import { withdrawDelayedNotifications } from "./withdraw-delayed-notifications";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const USER_ID = "00000000-0000-4000-8000-000000000002";
const notice = {
  userId: USER_ID,
  kind: "new_game_joined",
  params: { gameId: "00000000-0000-4000-8000-000000000009", gameTitle: "campaign" },
} as const;

beforeAll(async () => {
  await db.insert(servers).values({ id: SERVER_ID, discordGuildId: "guild", slug: "t", name: "t" });
  await db.insert(profiles).values({ id: USER_ID, discordId: "user", username: "user" });
});

describe("미뤄 보이는 알림", () => {
  it("보일 시각 전에는 세지 않고 되돌리면 지운다", async () => {
    const now = new Date();
    const visibleAt = new Date(now.getTime() + 6_000);
    const ids = await db.transaction((transaction) =>
      createDelayedNotifications({
        transaction,
        serverId: SERVER_ID,
        actorId: null,
        notifications: [notice],
        visibleAt,
      }),
    );
    expect(ids).toHaveLength(1);
    expect(await countUnreadNotifications({ serverId: SERVER_ID, userId: USER_ID, now })).toBe(0);
    expect(
      await countUnreadNotifications({ serverId: SERVER_ID, userId: USER_ID, now: visibleAt }),
    ).toBe(1);
    const removed = await db.transaction((transaction) =>
      withdrawDelayedNotifications({ transaction, serverId: SERVER_ID, ids, now }),
    );
    expect(removed).toBe(1);
    expect(
      await countUnreadNotifications({ serverId: SERVER_ID, userId: USER_ID, now: visibleAt }),
    ).toBe(0);
  });

  it("이미 보이기 시작한 알림은 되돌려도 남긴다", async () => {
    const visibleAt = new Date(Date.now() + 1_000);
    const ids = await db.transaction((transaction) =>
      createDelayedNotifications({
        transaction,
        serverId: SERVER_ID,
        actorId: null,
        notifications: [notice],
        visibleAt,
      }),
    );
    const removed = await db.transaction((transaction) =>
      withdrawDelayedNotifications({
        transaction,
        serverId: SERVER_ID,
        ids,
        now: new Date(visibleAt.getTime() + 1),
      }),
    );
    expect(removed).toBe(0);
  });
});
