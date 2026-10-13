import { describe, expect, it } from "vitest";

import { forumTagChanges } from "./forum-tag-changes";

const tags = [
  { id: "t1", name: "모집중" },
  { id: "t2", name: "모집 중" },
];

describe("forumTagChanges", () => {
  it("연결·변경·해제를 칸 이름과 태그 이름으로 남긴다", () => {
    expect(
      forumTagChanges({
        before: { open: "t1", categories: { c1: "t1" } },
        after: { open: "t2", closed: "t1" },
        categories: [{ id: "c1", name: "크툴루" }],
        tags,
      }),
    ).toEqual([
      { field: "모집중", before: "모집중", after: "모집 중" },
      { field: "마감", before: undefined, after: "모집중" },
      { field: "크툴루", before: "모집중", after: undefined },
    ]);
  });

  it("포럼에서 지워진 태그는 삭제된 태그로 남긴다", () => {
    expect(
      forumTagChanges({ before: { open: "gone" }, after: null, categories: [], tags }),
    ).toEqual([{ field: "모집중", before: "삭제된 태그", after: undefined }]);
  });
});
