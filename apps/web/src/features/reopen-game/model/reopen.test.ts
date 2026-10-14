import { describe, expect, it } from "vitest";

import { CERT_STATE, editionSets, type MyRulebook, type MyRulebooks } from "@/entities/rulebook";

import { canReopenGame } from "./can-reopen-game";
import { RULE_NOTICE, reopenDefaults } from "./reopen-defaults";

const NOW = new Date("2026-10-20T00:00:00+09:00");
const HOUR = 3_600_000;

const source = {
  gmId: "me",
  serverId: "s1",
  confirmedAt: new Date(NOW.getTime() - 5 * HOUR),
  playMinutes: 120,
  endedAt: null,
  cancelledAt: null,
  hiddenAt: null,
};
const can = (overrides = {}, userId = "me", serverId = "s1") =>
  canReopenGame({ game: { ...source, ...overrides }, userId, serverId, now: NOW });

describe("canReopenGame", () => {
  it("끝난 내 구인은 다시 열 수 있다", () => {
    expect(can()).toBe(true);
  });
  it("취소된 구인도 다시 열 수 있다", () => {
    expect(can({ confirmedAt: null, cancelledAt: NOW })).toBe(true);
  });
  it("진행 중이거나 모집 중이면 열 수 없다", () => {
    expect(can({ confirmedAt: new Date(NOW.getTime() - HOUR) })).toBe(false);
    expect(can({ confirmedAt: null })).toBe(false);
  });
  it("남의 구인과 다른 서버의 구인은 열 수 없다", () => {
    expect(can({}, "other")).toBe(false);
    expect(can({}, "me", "s2")).toBe(false);
  });
  it("숨기거나 제거된 구인은 열 수 없다", () => {
    expect(can({ hiddenAt: NOW })).toBe(false);
  });
});

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    shortName: id,
    categoryId: "coc",
    categoryName: "크툴루의 부름",
    edition: "7판",
    kind: "core",
    certRequired: true,
    state: CERT_STATE.certified,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;
const data = (rulebooks: MyRulebook[], enforcementDate: Date | null = null) =>
  ({ rulebooks, sets: editionSets(rulebooks), enforcementDate }) as MyRulebooks;

const original = {
  kind: "session",
  playType: "voice",
  title: "안개 속의 저택",
  synopsis: "{}",
  genres: ["호러"],
  triggers: [],
  platforms: ["디스코드"],
  notice: null,
  aiImage: false,
  playMinutesMin: 180,
  playMinutes: 300,
  maxPlayers: 4,
  minPlayers: 2,
  recruitMethod: "first_come",
  scheduleMode: "fixed",
  waitlistEnabled: true,
  applicationNoteEnabled: false,
  thumbnailUrl: null,
  thumbnailSpoiler: false,
  images: [],
  rulebookId: "7판",
  supplements: [],
} as unknown as Parameters<typeof reopenDefaults>[0]["game"];

describe("reopenDefaults", () => {
  it("내용은 가져오고 최소 인원은 원래 값 그대로 두며 일정은 넣지 않는다", () => {
    const { defaults, ruleNotice } = reopenDefaults({
      game: original,
      rulebooks: data([book("7판")]),
      now: NOW,
    });
    expect(defaults).toMatchObject({ title: "안개 속의 저택", minPlayers: 2, playMinutes: 300 });
    expect(defaults).toMatchObject({ rule: "크툴루의 부름 7판", rulebookId: "7판" });
    expect(defaults).not.toHaveProperty("confirmedAt");
    expect(defaults).not.toHaveProperty("endDate");
    expect(defaults).not.toHaveProperty("preConfirmed");
    expect(ruleNotice).toBeNull();
  });

  it("룰북을 찾지 못하면 룰을 비운다", () => {
    const { defaults, ruleNotice } = reopenDefaults({
      game: { ...original, rulebookId: "없음" },
      rulebooks: data([book("7판")]),
      now: NOW,
    });
    expect(defaults).toMatchObject({ rule: "", rulebookId: "" });
    expect(ruleNotice).toEqual({ kind: RULE_NOTICE.notFound });
  });

  it("인증이 막히면 룰을 비우고 판본 이름을 알려 준다", () => {
    const { defaults, ruleNotice } = reopenDefaults({
      game: original,
      rulebooks: data([book("7판", { state: null })], new Date("2026-10-08T00:00:00+09:00")),
      now: NOW,
    });
    expect(defaults).toMatchObject({ rule: "", rulebookId: "" });
    expect(ruleNotice).toEqual({ kind: RULE_NOTICE.blocked, label: "크툴루의 부름 7판" });
  });

  it("유예 기간에는 막지 않고 채운다", () => {
    const { defaults, ruleNotice } = reopenDefaults({
      game: original,
      rulebooks: data([book("7판", { state: null })], new Date("2026-10-28T00:00:00+09:00")),
      now: NOW,
    });
    expect(defaults).toMatchObject({ rule: "크툴루의 부름 7판" });
    expect(ruleNotice).toBeNull();
  });

  it("서플리먼트는 지금 고를 수 있는 등록된 책과 직접 입력한 책만 가져온다", () => {
    const { defaults } = reopenDefaults({
      game: {
        ...original,
        supplements: [
          { name: "펄프 크툴루", rulebookId: "펄프" },
          { name: "인증 안 한 책", rulebookId: "잠김" },
          { name: "새 책", rulebookId: null },
        ],
      },
      rulebooks: data([
        book("7판"),
        book("펄프", { kind: "supplement" }),
        book("잠김", { kind: "supplement", state: null }),
      ]),
      now: NOW,
    });
    expect(defaults.supplements).toEqual([
      { name: "펄프 크툴루", rulebookId: "펄프" },
      { name: "새 책", rulebookId: null },
    ]);
  });
});
