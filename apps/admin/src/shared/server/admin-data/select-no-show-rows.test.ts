import { describe, expect, it } from "vitest";

import { NO_SHOW_DEFAULT_SORT } from "./no-show-sort";
import { NO_SHOW_STATUS } from "./no-show-status";
import { selectNoShowRows } from "./select-no-show-rows";
import { toNoShowRow, type NoShowRow } from "./to-no-show-row";
import type { NoShow } from "./types";

const DAY = 86_400_000;
const NOW = new Date("2026-10-05T12:00:00+09:00").getTime();

const db = {
  users: [
    { id: "u1", nickname: "Kiwi" },
    { id: "u2", nickname: "가람" },
    { id: "u3", nickname: "나비" },
    { id: "gm", nickname: "달빛토끼" },
  ],
  sessions: [
    {
      id: "g1",
      title: "붉은 여관의 밤",
      rulebook: "더블크로스",
      gmId: "gm",
      startsAt: new Date(NOW - 2 * DAY),
    },
    {
      id: "g2",
      title: "안개 낀 등대",
      rulebook: "크툴루",
      gmId: "gm",
      startsAt: new Date(NOW - 40 * DAY),
    },
    {
      id: "g3",
      title: "13번째 방",
      rulebook: "크툴루",
      gmId: "gm",
      startsAt: new Date(NOW - 5 * DAY),
    },
  ],
} as unknown as Parameters<typeof toNoShowRow>[0]["db"];

const noShows: NoShow[] = [
  { id: "a", userId: "u1", sessionId: "g1", cancelled: false },
  { id: "b", userId: "u2", sessionId: "g2", cancelled: false },
  {
    id: "c",
    userId: "u3",
    sessionId: "g3",
    cancelled: false,
    added: { by: "새벽세시", at: new Date(NOW), reason: "GM 정정 요청" },
  },
  { id: "d", userId: "u2", sessionId: "g3", cancelled: true },
];

const rows: NoShowRow[] = noShows.map((noShow) => toNoShowRow({ db, noShow, now: NOW }));
const ids = (selected: NoShowRow[]) => selected.map((row) => row.id);

describe("toNoShowRow", () => {
  it("운영진이 추가한 기록은 처리한 사람이 「{닉네임} · 운영진」이다", () => {
    expect(rows.find((row) => row.id === "c")?.handler).toBe("새벽세시 · 운영진");
    expect(rows.find((row) => row.id === "a")?.handler).toBe("달빛토끼");
  });

  it("세션 시작 30일이 지난 유효 기록은 기간 지남이다", () => {
    expect(rows.map((row) => row.status)).toEqual([
      NO_SHOW_STATUS.valid,
      NO_SHOW_STATUS.expired,
      NO_SHOW_STATUS.valid,
      NO_SHOW_STATUS.cancelled,
    ]);
  });
});

describe("selectNoShowRows", () => {
  const select = (options: Partial<Parameters<typeof selectNoShowRows>[0]>) =>
    ids(selectNoShowRows({ rows, sort: NO_SHOW_DEFAULT_SORT, ...options }));

  it("상태 넷으로 거른다", () => {
    expect(select({})).toEqual(["a", "c", "d", "b"]);
    expect(select({ status: NO_SHOW_STATUS.valid })).toEqual(["a", "c"]);
    expect(select({ status: NO_SHOW_STATUS.expired })).toEqual(["b"]);
    expect(select({ status: NO_SHOW_STATUS.cancelled })).toEqual(["d"]);
  });

  it("닉네임·세션 제목을 대소문자 없이 찾는다", () => {
    expect(select({ query: "kIWI" })).toEqual(["a"]);
    expect(select({ query: "등대" })).toEqual(["b"]);
  });

  it("일시 ↓가 기본이고 불참 당사자 ↑로 바꿀 수 있다", () => {
    expect(select({ sort: { column: "at", dir: "asc" } })).toEqual(["b", "c", "d", "a"]);
    expect(select({ sort: { column: "nickname", dir: "asc" } })).toEqual(["d", "b", "c", "a"]);
  });

  it("방금 추가한 기록은 정렬과 상관없이 맨 위다", () => {
    expect(select({ pinId: "b" })).toEqual(["b", "a", "c", "d"]);
  });
});
