import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";

import { createGameWithRoster } from "#db/modules/games/commands/create-game-with-roster";
import {
  certifications,
  gameRounds,
  games,
  participants,
  profiles,
  roundAttendances,
  rulebookCategories,
  rulebooks,
  servers,
  serverMembers,
} from "#db/schema";

import { SERVER_USER_SORT, SERVER_USERS_PAGE_SIZE, TEST_DISCORD_ID_PREFIX } from "../model";
import { countServerUsers } from "./count-server-users";
import { getServerUsersPage } from "./get-server-users-page";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const HOUR = 3_600_000;
const NOW = Date.now();
let sequence = 0;

async function setup() {
  sequence += 1;
  const [server] = await db
    .insert(servers)
    .values({
      discordGuildId: `guild-${sequence}`,
      slug: `server-${sequence}`,
      name: `server-${sequence}`,
    })
    .returning({ id: servers.id });
  const serverId = server!.id;
  const [category] = await db
    .insert(rulebookCategories)
    .values({ serverId, name: "크툴루" })
    .returning({ id: rulebookCategories.id });
  let memberCount = 0;

  async function addMember(
    nickname: string,
    options: {
      joinedAt?: Date;
      deletedAt?: Date;
      discordId?: string;
    } = {},
  ) {
    memberCount += 1;
    const [profile] = await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        discordId: options.discordId ?? `d-${sequence}-${memberCount}`,
        username: nickname,
      })
      .returning({ id: profiles.id });
    await db.insert(serverMembers).values({
      serverId,
      userId: profile!.id,
      nickname,
      joinedAt: options.joinedAt,
      deletedAt: options.deletedAt,
    });
    return profile!.id;
  }

  async function addRulebook(name: string) {
    const [rulebook] = await db
      .insert(rulebooks)
      .values({ serverId, categoryId: category!.id, name })
      .returning({ id: rulebooks.id });
    return rulebook!.id;
  }

  async function addGame(
    gmId: string,
    columns: Partial<typeof games.$inferInsert> = {},
    confirmed: string[] = [],
    waiting: string[] = [],
  ) {
    return createGameWithRoster({
      serverId,
      columns: {
        gmId,
        title: "game",
        rule: "크툴루",
        scheduleMode: "fixed",
        maxPlayers: 4,
        endDate: new Date(NOW + 100 * HOUR),
        playMinutes: 240,
        ...columns,
      },
      confirmedUserIds: confirmed,
      waitingUserIds: waiting,
    });
  }

  const page = (input: Partial<Parameters<typeof getServerUsersPage>[0]> = {}) =>
    getServerUsersPage({ serverId, page: 1, sort: SERVER_USER_SORT.name, ...input });
  const names = async (input: Partial<Parameters<typeof getServerUsersPage>[0]> = {}) =>
    (await page(input)).rows.map((row) => row.username);

  return { serverId, addMember, addRulebook, addGame, page, names };
}

const upcoming = { confirmedAt: new Date(NOW + 48 * HOUR) };
const finished = { confirmedAt: new Date(NOW - 48 * HOUR) };

describe("getServerUsersPage", () => {
  it("한 쪽은 SERVER_USERS_PAGE_SIZE명이고 page 2는 처음부터 두 쪽 분량을 준다", async () => {
    const { addMember, page } = await setup();
    const memberCount = SERVER_USERS_PAGE_SIZE + 2;
    for (let index = 0; index < memberCount; index += 1)
      await addMember(`member${String(index).padStart(2, "0")}`);
    const first = await page();
    expect(first.rows).toHaveLength(SERVER_USERS_PAGE_SIZE);
    expect(first.total).toBe(memberCount);
    expect((await page({ page: 2 })).rows).toHaveLength(memberCount);
    expect((await page({ page: 0 })).rows).toHaveLength(SERVER_USERS_PAGE_SIZE);
  });

  it("나간 멤버와 테스트 계정은 빠진다", async () => {
    const { serverId, addMember, names } = await setup();
    await addMember("alive");
    await addMember("left", { deletedAt: new Date() });
    await addMember("tester", { discordId: `${TEST_DISCORD_ID_PREFIX}1` });
    expect(await names()).toEqual(["alive"]);
    expect(await countServerUsers({ serverId })).toBe(1);
  });

  it("닉네임 검색은 대소문자·앞뒤 공백을 무시하고 부분 일치하며 와일드카드는 글자로 본다", async () => {
    const { addMember, names } = await setup();
    await addMember("Alpha");
    await addMember("beta");
    await addMember("100%");
    expect(await names({ q: "  ALP " })).toEqual(["Alpha"]);
    expect(await names({ q: "et" })).toEqual(["beta"]);
    expect(await names({ q: "%" })).toEqual(["100%"]);
    expect(await names({ q: "   " })).toHaveLength(3);
  });

  it("인증 필터는 반려·지운 기록을 세지 않고 룰북 ID가 잘못되면 아무도 안 맞는다", async () => {
    const { serverId, addMember, addRulebook, names, page } = await setup();
    const rulebook = await addRulebook("크툴루 7판");
    const ok = await addMember("ok");
    const revoked = await addMember("revoked");
    const discarded = await addMember("discarded");
    await addMember("none");
    await db.insert(certifications).values([
      { serverId, userId: ok, rulebookId: rulebook },
      { serverId, userId: revoked, rulebookId: rulebook, revokedAt: new Date() },
      { serverId, userId: discarded, rulebookId: rulebook, discardedAt: new Date() },
    ]);
    expect(await names({ certifiedRulebookId: rulebook })).toEqual(["ok"]);
    expect(await names({ certifiedRulebookId: "not-a-uuid" })).toEqual([]);
    expect((await page()).rows.find((row) => row.username === "ok")?.certifiedRulebookCount).toBe(
      1,
    );
    expect(
      (await page()).rows.find((row) => row.username === "revoked")?.certifiedRulebookCount,
    ).toBe(0);
  });

  it("모집 룰 필터는 3개월보다 오래됐거나 숨긴 구인을 보지 않는다", async () => {
    const { addMember, addRulebook, addGame, names } = await setup();
    const rulebook = await addRulebook("크툴루 7판");
    const recent = await addMember("recent");
    const old = await addMember("old");
    const hidden = await addMember("hidden");
    await addGame(recent, { rulebookId: rulebook });
    const oldGame = await addGame(old, { rulebookId: rulebook });
    const hiddenGame = await addGame(hidden, { rulebookId: rulebook });
    await db
      .update(games)
      .set({ createdAt: new Date(NOW - 120 * 24 * HOUR) })
      .where(eq(games.id, oldGame));
    await db.update(games).set({ hiddenAt: new Date() }).where(eq(games.id, hiddenGame));
    expect(await names({ hostedRulebookId: rulebook })).toEqual(["recent"]);
    expect(await names({ hostedRulebookId: "nope" })).toEqual([]);
  });

  it("모집 중 필터와 복합 필터", async () => {
    const { addMember, addRulebook, addGame, names, page } = await setup();
    const rulebook = await addRulebook("크툴루 7판");
    const gm = await addMember("gm-a");
    const other = await addMember("gm-b");
    await addMember("nobody");
    await addGame(gm, { rulebookId: rulebook });
    await addGame(gm);
    await addGame(other, { endDate: new Date(NOW - HOUR) });
    expect(await names({ recruitingOnly: true })).toEqual(["gm-a"]);
    expect((await page()).rows.find((row) => row.username === "gm-a")?.recruitingCount).toBe(2);
    expect(await names({ recruitingOnly: true, hostedRulebookId: rulebook, q: "gm" })).toEqual([
      "gm-a",
    ]);
    expect(await names({ recruitingOnly: true, q: "gm-b" })).toEqual([]);
  });

  it("정렬: 최근 가입, 이름, 인증 룰북, 모집 중", async () => {
    const { serverId, addMember, addRulebook, addGame, names } = await setup();
    const first = await addRulebook("A");
    const second = await addRulebook("B");
    const a = await addMember("a", { joinedAt: new Date(NOW - 3 * HOUR) });
    const b = await addMember("b", { joinedAt: new Date(NOW - 1 * HOUR) });
    const c = await addMember("c", { joinedAt: new Date(NOW - 2 * HOUR) });
    await db.insert(certifications).values([
      { serverId, userId: c, rulebookId: first },
      { serverId, userId: c, rulebookId: second },
      { serverId, userId: a, rulebookId: first },
    ]);
    await addGame(b);
    await addGame(b);
    await addGame(a);
    expect(await names({ sort: SERVER_USER_SORT.recent })).toEqual(["b", "c", "a"]);
    expect(await names({ sort: SERVER_USER_SORT.name })).toEqual(["a", "b", "c"]);
    expect(await names({ sort: SERVER_USER_SORT.rulebooks })).toEqual(["c", "a", "b"]);
    expect(await names({ sort: SERVER_USER_SORT.hosted })).toEqual(["b", "a", "c"]);
  });

  it("진행 횟수: 예정과 끝난 확정 세션을 세고 취소·숨김·확정 없이 끝난 건 뺀다", async () => {
    const { addMember, addGame, page } = await setup();
    const gm = await addMember("gm");
    const player = await addMember("player");
    await addGame(gm, upcoming, [player]);
    await addGame(gm, finished, [player]);
    await addGame(gm, finished, []);
    const cancelled = await addGame(gm, upcoming, [player]);
    const hidden = await addGame(gm, upcoming, [player]);
    await db
      .update(games)
      .set({ cancelledAt: new Date(), cancelKind: "gm" })
      .where(eq(games.id, cancelled));
    await db.update(games).set({ hiddenAt: new Date() }).where(eq(games.id, hidden));
    const rows = (await page()).rows;
    expect(rows.find((row) => row.username === "gm")?.hostedCount).toBe(2);
    expect(rows.find((row) => row.username === "player")?.playedCount).toBe(2);
    expect((await page({ sort: SERVER_USER_SORT.played })).rows[0]?.username).toBe("player");
  });

  it("참여 횟수: 확정만 세고 불참은 취소됐을 때만 세며 대기는 뺀다", async () => {
    const { addMember, addGame, page } = await setup();
    const gm = await addMember("gm");
    const present = await addMember("present");
    const absent = await addMember("absent");
    const cancelled = await addMember("cancelled");
    const waiting = await addMember("waiting");
    const gameId = await addGame(gm, finished, [present, absent, cancelled], [waiting]);
    const mark = (userId: string, columns: Partial<typeof participants.$inferInsert>) =>
      db.update(participants).set(columns).where(eq(participants.userId, userId));
    await mark(absent, { absent: true });
    await mark(cancelled, { absent: true, absenceCancelledAt: new Date() });
    const counts = Object.fromEntries(
      (await page()).rows.map((row) => [row.username, row.playedCount]),
    );
    expect(counts).toMatchObject({ present: 1, absent: 0, cancelled: 1, waiting: 0, gm: 0 });
    expect(gameId).toBeTruthy();
  });

  it("다회차는 출석 확정된 끝난 회차의 참석만 센다", async () => {
    const { serverId, addMember, page } = await setup();
    const gm = await addMember("gm");
    const player = await addMember("player");
    const start = new Date(NOW - 48 * HOUR);
    const gameId = await createGameWithRoster({
      serverId,
      columns: {
        gmId: gm,
        title: "campaign",
        rule: "크툴루",
        scheduleMode: "fixed",
        maxPlayers: 4,
        endDate: new Date(NOW + 100 * HOUR),
        roundCount: 2,
        confirmedAt: start,
        playMinutes: 240,
      },
      confirmedUserIds: [player],
      rounds: [
        {
          roundNo: 1,
          startAt: start,
          plannedEndAt: new Date(start.getTime() + 4 * HOUR),
          status: "scheduled",
        },
        { roundNo: 2, status: "unscheduled" },
      ],
    });
    const [round] = await db.select().from(gameRounds).where(eq(gameRounds.gameId, gameId));
    await db.insert(roundAttendances).values({
      serverId,
      roundId: round!.id,
      gameId,
      userId: player,
      attended: true,
    });
    const playedOf = async () =>
      (await page()).rows.find((row) => row.username === "player")?.playedCount;
    expect(await playedOf()).toBe(0);
    await db
      .update(gameRounds)
      .set({ attendanceConfirmedAt: new Date(NOW - 40 * HOUR) })
      .where(eq(gameRounds.id, round!.id));
    expect(await playedOf()).toBe(1);
  });
});
