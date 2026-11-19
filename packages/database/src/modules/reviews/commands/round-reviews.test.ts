import { asc, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, games, participants, profiles, servers, sessionReviews } from "#db/schema";

import { getReviewDraftTarget } from "../queries/get-review-draft-target";
import { insertReview } from "./insert-review";

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
const WEEK = 7 * 24 * HOUR;
const BASE = new Date("2026-12-05T10:00:00Z").getTime();
const BODY = "회차마다 남기는 후기입니다. 즐거웠습니다!";

let gameId = "";

beforeAll(async () => {
  await db.insert(servers).values({ id: SERVER_ID, discordGuildId: "guild", slug: "t", name: "t" });
  await db.insert(profiles).values([
    { id: GM_ID, discordId: "gm", username: "gm" },
    { id: PLAYER_ID, discordId: "player", username: "player" },
  ]);
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
      roundCount: 3,
    })
    .returning();
  gameId = game!.id;
  await db.insert(gameRounds).values(
    [0, 1, 2].map((index) => ({
      serverId: SERVER_ID,
      gameId,
      roundNo: index + 1,
      startAt: new Date(BASE + index * WEEK),
      plannedEndAt: new Date(BASE + index * WEEK + 4 * HOUR),
      status: "scheduled" as const,
    })),
  );
  await db
    .insert(participants)
    .values({ serverId: SERVER_ID, gameId, userId: PLAYER_ID, status: "confirmed", absent: true });
});

describe("회차 후기", () => {
  it("이미 시작한 가장 뒤 회차를 고르고 그 회차의 시각과 내 후기를 돌려준다", async () => {
    const target = await getReviewDraftTarget({
      serverId: SERVER_ID,
      gameId,
      userId: PLAYER_ID,
      now: new Date(BASE + WEEK + HOUR),
    });
    expect(target?.round?.roundNo).toBe(2);
    expect(target?.game.confirmedAt).toEqual(new Date(BASE + WEEK));
    expect(target?.game.playMinutes).toBe(240);
    expect(target?.participant?.absent).toBe(false);
    expect(target?.review).toBeNull();
  });

  it("같은 사람이 회차마다 하나씩 쓰고 같은 회차에는 하나만 쓴다", async () => {
    const rounds = await db
      .select()
      .from(gameRounds)
      .where(eq(gameRounds.gameId, gameId))
      .orderBy(asc(gameRounds.roundNo));
    const write = (roundId: string) =>
      insertReview({
        serverId: SERVER_ID,
        gameId,
        authorId: PLAYER_ID,
        authorRole: "participant",
        body: BODY,
        spoiler: false,
        photoUrls: [],
        roundId,
      });
    await write(rounds[0]!.id);
    await write(rounds[1]!.id);
    await expect(write(rounds[1]!.id)).rejects.toThrow();
    expect(
      await db.select().from(sessionReviews).where(eq(sessionReviews.gameId, gameId)),
    ).toHaveLength(2);
    const target = await getReviewDraftTarget({
      serverId: SERVER_ID,
      gameId,
      userId: PLAYER_ID,
      roundNo: 1,
    });
    expect(target?.review?.roundId).toBe(rounds[0]!.id);
  });
});
