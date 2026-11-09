import { and, eq, sql } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profiles, rulebookRequests, servers } from "#db/schema";

import { createRulebookRequests } from "./create-rulebook-requests";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");
const USER = "00000000-0000-4000-8000-000000000001";
const SERVER_A = "00000000-0000-4000-8000-0000000000a1";
const SERVER_B = "00000000-0000-4000-8000-0000000000b1";

beforeEach(async () => {
  await db.insert(servers).values([
    { id: SERVER_A, discordGuildId: "guild-a", slug: "server-a", name: "A" },
    { id: SERVER_B, discordGuildId: "guild-b", slug: "server-b", name: "B" },
  ]);
  await db.insert(profiles).values({ id: USER, discordId: "discord-1", username: "rookie" });
});
afterEach(async () => {
  await db.execute(sql`truncate ${profiles}, ${servers} cascade`);
});

const submit = (names: string[], serverId = SERVER_A) =>
  createRulebookRequests({
    serverId,
    userId: USER,
    requests: names.map((name) => ({ name, edition: "7판", kind: "supplement" })),
  });

describe("일괄 추가 요청 저장", () => {
  it("같은 그룹의 개별 요청을 만들고 한 권만 처리해도 나머지는 대기한다", async () => {
    const result = await submit(["책 A", "책 B"]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const rows = await db.select().from(rulebookRequests);
    expect(rows).toHaveLength(2);
    expect(new Set(rows.map((row) => row.groupId))).toEqual(new Set([result.groupId]));
    expect(rows.every((row) => row.source === "user" && row.userId === USER)).toBe(true);
    await db
      .update(rulebookRequests)
      .set({ outcome: "rejected" })
      .where(eq(rulebookRequests.id, result.requests[0]!.id));
    const [other] = await db
      .select()
      .from(rulebookRequests)
      .where(eq(rulebookRequests.id, result.requests[1]!.id));
    expect(other?.outcome).toBeNull();
  });

  it("기존 대기와 한 권이라도 겹치면 나머지도 만들지 않는다", async () => {
    await submit(["Book"]);
    expect(await submit([" book ", "새 책"])).toMatchObject({
      ok: false,
      duplicateKeys: ["book 7판"],
    });
    expect(await db.$count(rulebookRequests)).toBe(1);
  });

  it("구인 자동 요청도 중복 검사에 포함하고 서버가 다르면 허용한다", async () => {
    await db.insert(rulebookRequests).values({
      serverId: SERVER_A,
      userId: USER,
      name: "자동 요청",
      edition: "7판",
      source: "game",
    });
    expect(await submit(["자동 요청"])).toMatchObject({ ok: false });
    expect(await submit(["자동 요청"], SERVER_B)).toMatchObject({ ok: true });
  });

  it("처리된 요청은 다시 신청할 수 있고 그룹은 새로 만든다", async () => {
    const first = await submit(["반려된 책"]);
    await db
      .update(rulebookRequests)
      .set({ outcome: "rejected" })
      .where(and(eq(rulebookRequests.serverId, SERVER_A), eq(rulebookRequests.name, "반려된 책")));
    const second = await submit(["반려된 책"]);
    expect(first.ok && second.ok && first.groupId !== second.groupId).toBe(true);
  });

  it("DB 제약 위반 시 다른 책도 남기지 않는다", async () => {
    await expect(
      createRulebookRequests({
        serverId: SERVER_A,
        userId: USER,
        requests: [
          { name: "유효한 책" },
          { name: "잘못된 분류", categoryId: "00000000-0000-4000-8000-000000000099" },
        ],
      }),
    ).rejects.toThrow();
    expect(await db.$count(rulebookRequests)).toBe(0);
  });
});
