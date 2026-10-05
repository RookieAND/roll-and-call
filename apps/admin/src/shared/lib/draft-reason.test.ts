import { describe, expect, it } from "vitest";

import { draftReason } from "./draft-reason";

describe("draftReason", () => {
  it("코드를 쓰고, 기타면 입력한 글을 붙인다", () => {
    expect(draftReason({ code: null, otherText: "무시" })).toBeNull();
    expect(draftReason({ code: "abuse", otherText: "무시" })).toEqual({
      code: "abuse",
      text: null,
    });
    expect(draftReason({ code: "other", otherText: "  " })).toBeNull();
    expect(draftReason({ code: "other", otherText: " 사과함 " })).toEqual({
      code: "other",
      text: "사과함",
    });
  });
});
