import { describe, expect, it } from "vitest";

import { SORT_DIR } from "@/shared/lib";

import type { PostRow } from "./post-row";
import { POST_DEFAULT_SORT, POST_SORT_COLUMN } from "./post-sort";
import { POST_STATUS } from "./post-status";
import { selectPostRows } from "./select-post-rows";

const DAY = 86_400_000;
const NOW = new Date("2026-10-05T12:00:00+09:00").getTime();

const row = (fields: Partial<PostRow> & { id: string }): PostRow => ({
  title: "구인",
  gmNickname: "달빛토끼",
  rulebook: "크툴루",
  sessionAt: new Date(NOW),
  memberCount: 1,
  capacity: 5,
  status: POST_STATUS.recruiting,
  staffAction: null,
  ...fields,
});

const rows = [
  row({ id: "old", sessionAt: new Date(NOW - 2 * DAY), memberCount: 3 }),
  row({ id: "undecided", sessionAt: null, memberCount: 5 }),
  row({ id: "new", sessionAt: new Date(NOW + DAY), memberCount: 3 }),
  row({ id: "mid", sessionAt: new Date(NOW), memberCount: 1, title: "Red Inn" }),
];
const ids = (selected: PostRow[]) => selected.map((selectedRow) => selectedRow.id);

describe("selectPostRows", () => {
  it("기본은 세션 일시 ↓, 미정은 맨 아래", () => {
    expect(ids(selectPostRows({ rows, sort: POST_DEFAULT_SORT }))).toEqual([
      "new",
      "mid",
      "old",
      "undecided",
    ]);
  });

  it("세션 일시 ↑에서도 미정은 맨 아래", () => {
    const sort = { column: POST_SORT_COLUMN.at, dir: SORT_DIR.asc };
    expect(ids(selectPostRows({ rows, sort }))).toEqual(["old", "mid", "new", "undecided"]);
  });

  it("참여 ↓는 확정 인원이 많은 순, 같은 인원은 세션 일시 최신순", () => {
    const sort = { column: POST_SORT_COLUMN.members, dir: SORT_DIR.desc };
    expect(ids(selectPostRows({ rows, sort }))).toEqual(["undecided", "new", "old", "mid"]);
  });

  it("제목·GM 검색은 대소문자를 가리지 않고, 상태·룰북으로 거른다", () => {
    const sort = POST_DEFAULT_SORT;
    expect(ids(selectPostRows({ rows, sort, query: " red inn " }))).toEqual(["mid"]);
    const filtered = [
      row({ id: "a", gmNickname: "Kiwi", rulebook: "인세인" }),
      row({ id: "b", status: POST_STATUS.cancelled, rulebook: "인세인" }),
    ];
    expect(ids(selectPostRows({ rows: filtered, sort, query: "KIWI" }))).toEqual(["a"]);
    expect(ids(selectPostRows({ rows: filtered, sort, status: POST_STATUS.cancelled }))).toEqual([
      "b",
    ]);
    expect(ids(selectPostRows({ rows: filtered, sort, rulebook: "인세인" }))).toEqual(["a", "b"]);
    expect(ids(selectPostRows({ rows, sort, rulebook: "인세인" }))).toEqual([]);
  });
});
