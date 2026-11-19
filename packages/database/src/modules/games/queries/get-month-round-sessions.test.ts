import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { gameRounds, profiles, servers } from "#db/schema";

import { createGameWithRoster } from "../commands/create-game-with-roster";
import { buildNewRounds } from "../model/build-new-rounds";
import { buildRepeatRounds } from "../model/build-repeat-rounds";
import { repeatRuleOf } from "../model/repeat-rule-of";
import { getMonthRoundSessions } from "./get-month-round-sessions";

vi.mock("server-only", () => ({}));
vi.mock("#db/client", async () => {
  const { createTestDb } = await import("#db/test-support/create-test-db");
  return { db: await createTestDb() };
});

const { db } = await import("#db/client");

const SERVER_ID = "00000000-0000-4000-8000-000000000001";
const GM_ID = "00000000-0000-4000-8000-000000000002";
const first = {
  startsAt: new Date("2026-12-12T03:00:00Z"),
  endsAt: new Date("2026-12-12T07:00:00Z"),
};
const base = {
  gmId: GM_ID,
  title: "game",
  rule: "크툴루의 부름 7판",
  scheduleMode: "fixed" as const,
  maxPlayers: 4,
  endDate: new Date("2026-12-20T00:00:00Z"),
  playMinutes: 240,
};

let multiId = "";
let singleId = "";

beforeAll(async () => {
  await db
    .insert(servers)
    .values({ id: SERVER_ID, discordGuildId: "guild", slug: "test", name: "test" });
  await db.insert(profiles).values({ id: GM_ID, discordId: "gm", username: "gm" });
  const dated = buildRepeatRounds({ first, intervalWeeks: 1, count: 4 });
  multiId = await createGameWithRoster({
    serverId: SERVER_ID,
    columns: {
      ...base,
      confirmedAt: first.startsAt,
      roundCount: 4,
      roundScheduleKind: "designated",
      repeatRule: repeatRuleOf({ first, intervalWeeks: 1 }),
    },
    confirmedUserIds: [],
    rounds: buildNewRounds({ scheduleKind: "designated", roundCount: 4, dated }),
  });
  singleId = await createGameWithRoster({
    serverId: SERVER_ID,
    columns: { ...base, title: "single", confirmedAt: new Date("2026-12-30T03:00:00Z") },
    confirmedUserIds: [],
  });
});

describe("getMonthRoundSessions", () => {
  const range = {
    serverId: SERVER_ID,
    from: new Date("2026-12-01T00:00:00Z"),
    to: new Date("2027-01-01T00:00:00Z"),
  };

  it("회차마다 한 행, 단발은 한 행이며 달 밖 회차는 뺀다", async () => {
    const rows = await getMonthRoundSessions(range);
    expect(rows.map((row) => [row.id === multiId ? "multi" : "single", row.roundNo])).toEqual([
      ["multi", 1],
      ["multi", 2],
      ["multi", 3],
      ["single", 1],
    ]);
    expect(rows[0]!.roundCount).toBe(4);
    expect(rows[3]!.roundCount).toBe(1);
  });

  it("다른 달에 시작한 회차 하나만 있어도 그 달에 나온다", async () => {
    const rows = await getMonthRoundSessions({
      ...range,
      from: new Date("2027-01-01T00:00:00Z"),
      to: new Date("2027-02-01T00:00:00Z"),
    });
    expect(rows.map((row) => row.roundNo)).toEqual([4]);
  });

  it("취소된 회차는 뺀다", async () => {
    await db
      .update(gameRounds)
      .set({ status: "cancelling" })
      .where(and(eq(gameRounds.gameId, multiId), eq(gameRounds.roundNo, 2)));
    const rows = await getMonthRoundSessions(range);
    expect(rows.filter((row) => row.id === multiId).map((row) => row.roundNo)).toEqual([1, 3]);
    expect(singleId).toBeTruthy();
  });
});
