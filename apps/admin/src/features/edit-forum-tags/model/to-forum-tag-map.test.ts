import { expect, it } from "vitest";

import type { ForumTagForm } from "./forum-tag-form";
import { toForumTagMap } from "./to-forum-tag-map";

const empty: ForumTagForm = {
  open: "",
  closed: "",
  cancelled: "",
  categories: {},
  playTypes: { voice: "", text: "" },
  briefing: "",
  session: "",
};

it("연결하지 않은 칸은 저장하지 않는다", () => {
  expect(toForumTagMap({ ...empty, open: "1", categories: { a: "2", b: "" } })).toEqual({
    open: "1",
    categories: { a: "2" },
  });
  expect(toForumTagMap({ ...empty, categories: { a: "" } })).toBeNull();
});

it("플레이 유형과 설명회 구분 태그를 담는다", () => {
  expect(toForumTagMap({ ...empty, playTypes: { voice: "3", text: "" }, briefing: "4" })).toEqual({
    playTypes: { voice: "3" },
    briefing: "4",
  });
});
