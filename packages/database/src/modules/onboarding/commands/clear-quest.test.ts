import { and, eq, sql } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { grantApprenticeBadge } from "#db/modules/badges";
import { BADGE_LADDER } from "#db/modules/badges/model";
import { ONBOARDING_QUEST, type OnboardingQuest } from "#db/modules/onboarding/model/quests";
import { onboardingQuestClears, profiles, serverMembers, servers, userBadges } from "#db/schema";

import { clearQuest } from "./clear-quest";
import { syncApprenticeBadges } from "./sync-apprentice-badges";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});
vi.mock("#db/modules/badges", async (importOriginal) => {
  const actual = await importOriginal<typeof import("#db/modules/badges")>();
  return { ...actual, grantApprenticeBadge: vi.fn(actual.grantApprenticeBadge) };
});

const { db } = await import("#db/client");

const USER = "00000000-0000-4000-8000-000000000001";
const SERVER_A = "00000000-0000-4000-8000-0000000000a1";
const SERVER_B = "00000000-0000-4000-8000-0000000000b1";
const {
  firstApply: FIRST,
  firstReview: SECOND,
  rulebookCert: THIRD,
  firstRecruit: FOURTH,
} = ONBOARDING_QUEST;

async function clearMany(serverId: string, quests: readonly OnboardingQuest[]) {
  const results = [];
  for (const quest of quests) results.push(await clearQuest({ serverId, userId: USER, quest }));
  return results;
}

function countClears(serverId: string) {
  return db.$count(
    onboardingQuestClears,
    and(eq(onboardingQuestClears.serverId, serverId), eq(onboardingQuestClears.userId, USER)),
  );
}

function hasApprentice(serverId: string) {
  return db
    .$count(
      userBadges,
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, USER),
        eq(userBadges.badgeKey, BADGE_LADDER.apprentice),
      ),
    )
    .then((count) => count > 0);
}

beforeEach(async () => {
  await db.insert(servers).values([
    { id: SERVER_A, discordGuildId: "guild-a", slug: "server-a", name: "A" },
    { id: SERVER_B, discordGuildId: "guild-b", slug: "server-b", name: "B" },
  ]);
  await db.insert(profiles).values({ id: USER, discordId: "discord-1", username: "rookie" });
  await db.insert(serverMembers).values([
    { serverId: SERVER_A, userId: USER, nickname: "rookie" },
    { serverId: SERVER_B, userId: USER, nickname: "rookie" },
  ]);
});

afterEach(async () => {
  vi.mocked(grantApprenticeBadge).mockClear();
  await db.execute(
    sql`truncate ${onboardingQuestClears}, ${userBadges}, ${serverMembers}, ${profiles}, ${servers} cascade`,
  );
});

describe("clearQuest", () => {
  it("처음 깬 것만 기록하고, 두 번 불러도 한 줄이다", async () => {
    const results = await clearMany(SERVER_A, [
      ONBOARDING_QUEST.firstApply,
      ONBOARDING_QUEST.firstApply,
    ]);
    expect(results.map((result) => result.recorded)).toEqual([true, false]);
    expect(await countClears(SERVER_A)).toBe(1);
  });

  it("선행을 검사하지 않는다", async () => {
    const results = await clearMany(SERVER_A, [ONBOARDING_QUEST.firstRecruit]);
    expect(results).toMatchObject([{ recorded: true }]);
  });

  it("네 번째가 기록되는 순간 견습 모험가를 준다", async () => {
    const results = await clearMany(SERVER_A, [FIRST, SECOND, THIRD, FOURTH]);
    expect(results.map((result) => result.badgeGranted)).toEqual([false, false, false, true]);
    expect(results.at(-1)?.allCleared).toBe(true);
    expect(await hasApprentice(SERVER_A)).toBe(true);
  });

  it("다른 서버의 기록은 세지 않는다", async () => {
    await clearMany(SERVER_A, [FIRST, SECOND, THIRD]);
    const results = await clearMany(SERVER_B, [FOURTH]);
    expect(results).toMatchObject([{ recorded: true, allCleared: false, badgeGranted: false }]);
    expect(await syncApprenticeBadges()).toBe(0);
    expect(await hasApprentice(SERVER_B)).toBe(false);
  });
});

describe("syncApprenticeBadges", () => {
  it("지급이 실패해도 기록은 남고, 재계산이 칭호를 채운다", async () => {
    vi.mocked(grantApprenticeBadge).mockRejectedValueOnce(new Error("down"));
    const results = await clearMany(SERVER_A, [FIRST, SECOND, THIRD, FOURTH]);
    expect(results.at(-1)).toMatchObject({ recorded: true, allCleared: true, badgeGranted: false });
    expect(await hasApprentice(SERVER_A)).toBe(false);

    expect(await syncApprenticeBadges()).toBe(1);
    expect(await hasApprentice(SERVER_A)).toBe(true);
    expect(await syncApprenticeBadges()).toBe(0);
  });
});
