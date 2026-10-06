import { expect, it } from "vitest";

import { toForumTagMap } from "./to-forum-tag-map";

it("연결하지 않은 칸은 저장하지 않는다", () => {
  expect(
    toForumTagMap({ open: "1", closed: "", cancelled: "", categories: { a: "2", b: "" } }),
  ).toEqual({
    open: "1",
    categories: { a: "2" },
  });
  expect(toForumTagMap({ open: "", closed: "", cancelled: "", categories: { a: "" } })).toBeNull();
});
