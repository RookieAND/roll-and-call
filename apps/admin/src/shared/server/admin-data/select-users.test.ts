import { describe, expect, it } from "vitest";

import { selectUsers } from "./select-users";
import type { AdminUser, NoShow, Session } from "./types";
import { USER_SORT_FALLBACK, type UserSortColumn } from "./user-sort";

const now = new Date("2026-10-05T12:00:00Z");
const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(now.getTime() - days * DAY);

const user = (id: string, overrides: Partial<AdminUser> = {}): AdminUser => ({
  id,
  nickname: id,
  discordId: `d-${id}`,
  discordHandle: `handle_${id}`,
  joinedAt: daysAgo(400),
  memberJoinedAt: daysAgo(100),
  hostedCount: 0,
  playedCount: 0,
  recentHostedCount: 0,
  membership: "active",
  ...overrides,
});

const session = (id: string, overrides: Partial<Session> = {}): Session => ({
  id,
  title: id,
  rulebook: "",
  rulebookId: null,
  gmId: "gm",
  startsAt: daysAgo(10),
  memberIds: [],
  capacity: 4,
  closed: true,
  endsAt: daysAgo(10),
  ...overrides,
});

const noShow = (sessionId: string, userId: string, cancelled = false): NoShow => ({
  id: `${sessionId}:${userId}`,
  userId,
  sessionId,
  cancelled,
});

const emptyDb = { sessions: [], noShows: [], certifications: [], auditLog: [] };

describe("selectUsers", () => {
  it("참여 세션은 끝난 인정 세션만 세고 유효 불참·숨김·취소·진행 전은 뺀다", () => {
    const db = {
      ...emptyDb,
      users: [user("a")],
      sessions: [
        session("done", { memberIds: ["a"] }),
        session("absent", { memberIds: ["a"] }),
        session("absentCancelled", { memberIds: ["a"] }),
        session("hidden", { memberIds: ["a"], hidden: { reason: "", by: "", at: now } }),
        session("cancelled", { memberIds: ["a"], cancelled: true }),
        session("future", { memberIds: ["a"], endsAt: new Date(now.getTime() + DAY) }),
        session("undecided", { memberIds: ["a"], endsAt: null }),
      ],
      noShows: [noShow("absent", "a"), noShow("absentCancelled", "a", true)],
    };
    const { rows } = selectUsers({ db, now, sort: USER_SORT_FALLBACK });
    expect(rows[0]?.playedCount).toBe(2);
    expect(rows[0]?.recentNoShowCount).toBe(1);
  });

  it("칩 넷은 각자 조건으로 거르고 멤버십 건수는 칩과 상관없다", () => {
    const db = {
      ...emptyDb,
      users: [
        user("gm"),
        user("absent"),
        user("sanctioned", { sanction: { until: null, by: "s", at: daysAgo(1), reason: "r" } }),
        user("fresh", { memberJoinedAt: daysAgo(3) }),
        user("gone", { membership: "banned" }),
      ],
      certifications: [
        { userId: "gm", rulebookId: "r", rulebook: "", approvedAt: now, approvedBy: "" },
      ],
      sessions: [session("one"), session("two")],
      noShows: [noShow("one", "absent"), noShow("two", "absent")],
    };
    const pick = (filter: "gm" | "noshow" | "sanctioned" | "recent") =>
      selectUsers({ db, now, filter, sort: USER_SORT_FALLBACK }).rows.map((row) => row.id);
    expect(pick("gm")).toEqual(["gm"]);
    expect(pick("noshow")).toEqual(["absent"]);
    expect(pick("sanctioned")).toEqual(["sanctioned"]);
    expect(pick("recent")).toEqual(["fresh"]);
    expect(
      selectUsers({ db, now, filter: "gm", sort: USER_SORT_FALLBACK }).membershipCounts,
    ).toEqual({ active: 4, left: 0, banned: 1 });
  });

  it("기본은 그 서버 가입일 ↓이고 여섯 열로 정렬하며 같은 값은 기본 순서를 지킨다", () => {
    const db = {
      ...emptyDb,
      users: [
        user("다", { memberJoinedAt: daysAgo(30), hostedCount: 2 }),
        user("가", { memberJoinedAt: daysAgo(10), hostedCount: 5 }),
        user("나", { memberJoinedAt: daysAgo(20), hostedCount: 2 }),
      ],
    };
    const order = (column: UserSortColumn, dir: "asc" | "desc") =>
      selectUsers({ db, now, sort: { column, dir } }).rows.map((row) => row.id);
    expect(order(USER_SORT_FALLBACK.column, USER_SORT_FALLBACK.dir)).toEqual(["가", "나", "다"]);
    expect(order("nickname", "asc")).toEqual(["가", "나", "다"]);
    expect(order("hosted", "desc")).toEqual(["가", "다", "나"]);
    for (const column of ["played", "noshow", "certs"] as const) {
      expect(selectUsers({ db, now, sort: { column, dir: "desc" } }).rows).toHaveLength(3);
    }
  });

  it("검색은 닉네임·이전 닉네임·디스코드 ID를 대소문자 없이 찾는다", () => {
    const db = {
      ...emptyDb,
      users: [user("Moon", { discordHandle: "Lunar_77" }), user("sun")],
      auditLog: [
        {
          id: "1",
          at: now,
          actor: "s",
          actorKind: "staff" as const,
          action: "닉네임 수정" as const,
          target: "옛이름",
          targetUserId: "sun",
          reason: "",
          before: { label: "옛이름" },
        },
      ],
    };
    const find = (query: string) =>
      selectUsers({ db, now, query, sort: USER_SORT_FALLBACK }).rows.map((row) => row.id);
    expect(find("moon")).toEqual(["Moon"]);
    expect(find("LUNAR")).toEqual(["Moon"]);
    expect(find("d-sun")).toEqual(["sun"]);
    expect(find("옛")).toEqual(["sun"]);
  });
});
