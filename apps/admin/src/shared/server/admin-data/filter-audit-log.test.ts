import { auditActionLabel } from "@roll-and-call/database/moderation/model";
import { describe, expect, it } from "vitest";

import { filterAuditLog } from "./filter-audit-log";
import type { AuditEntry } from "./types";

const now = new Date("2026-10-05T12:00:00+09:00").getTime();
const daysAgo = (days: number) => new Date(now - days * 86_400_000);

const entry = (fields: Partial<AuditEntry> & Pick<AuditEntry, "id">): AuditEntry => ({
  at: daysAgo(1),
  actor: "달빛토끼",
  actorKind: "staff",
  action: "제재",
  target: "김코코",
  reason: "",
  ...fields,
});

const entries = [
  entry({ id: "renamed-old", target: "옛닉네임 · 7일", targetUserId: "user-1", at: daysAgo(40) }),
  entry({ id: "current", target: "김코코", targetUserId: "user-1", at: daysAgo(2) }),
  entry({ id: "lookalike", target: "김코코2", targetUserId: "user-2", at: daysAgo(3) }),
  entry({
    id: "game",
    action: "구인 숨김",
    target: "안개 낀 등대 · GM 새벽세시",
    targetGameId: "game-1",
    at: daysAgo(8),
  }),
  entry({
    id: "review",
    action: "후기 숨김",
    target: "김코코의 후기 · 안개 낀 등대",
    targetUserId: "user-1",
    targetGameId: "game-1",
    at: daysAgo(9),
  }),
  entry({
    id: "settings-old",
    action: auditActionLabel("설정 변경"),
    target: "TRPIA · 공지 채널",
    at: daysAgo(4),
  }),
  entry({
    id: "settings-new",
    action: "서버 설정 변경",
    target: "TRPIA · 초대 링크",
    at: daysAgo(5),
  }),
];

const ids = (filter: Parameters<typeof filterAuditLog>[0]["filter"]) =>
  filterAuditLog({ entries, filter, now }).rows.map((row) => row.id);

describe("filterAuditLog", () => {
  it("targetUser로 거르면 닉네임을 바꾼 사람의 옛 기록까지 나오고 비슷한 닉네임은 섞이지 않는다", () => {
    expect(ids({ targetUser: "user-1" })).toEqual(["current", "review", "renamed-old"]);
  });

  it("targetUser와 targetGame이 함께 오면 둘 다 맞는 기록만 고른다", () => {
    expect(ids({ targetUser: "user-1", targetGame: "game-1" })).toEqual(["review"]);
    expect(ids({ targetGame: "game-1" })).toEqual(["game", "review"]);
  });

  it("?target=은 「 · 」 앞 이름이 정확히 같은 기록만 고른다", () => {
    expect(ids({ target: "김코코" })).toEqual(["current"]);
    expect(ids({ target: "TRPIA" })).toEqual(["settings-old", "settings-new"]);
  });

  it("검색어는 대상 전체를 대소문자 없이 부분 일치로 찾는다", () => {
    expect(ids({ q: "trpia · 초대" })).toEqual(["settings-new"]);
  });

  it("검색어나 대상이 있으면 기본 기간이 전체, 없으면 최근 7일", () => {
    expect(filterAuditLog({ entries, filter: { q: "옛닉" }, now }).period).toBe("all");
    expect(ids({ q: "옛닉" })).toEqual(["renamed-old"]);
    expect(filterAuditLog({ entries, filter: {}, now }).period).toBe("week");
    expect(ids({})).toEqual(["current", "lookalike", "settings-old", "settings-new"]);
    expect(ids({ q: "옛닉", period: "week" })).toEqual([]);
  });

  it("일시 ↓가 기본이고 ↑로 뒤집는다", () => {
    expect(ids({ period: "all", dir: "asc" })).toEqual([
      "renamed-old",
      "review",
      "game",
      "settings-new",
      "settings-old",
      "lookalike",
      "current",
    ]);
  });

  it("「설정 변경」과 「서버 설정 변경」이 같은 필터 항목으로 걸린다", () => {
    expect(ids({ actions: ["서버 설정 변경"] })).toEqual(["settings-old", "settings-new"]);
  });
});
