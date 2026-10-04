import { describe, expect, it } from "vitest";

import { chosenReason } from "./chosen-reason";

describe("chosenReason", () => {
  it("칩 이름을 쓰고, 기타면 입력한 글을 쓴다", () => {
    expect(chosenReason({ chip: null, otherText: "무시" })).toBe("");
    expect(chosenReason({ chip: "욕설·비방", otherText: "무시" })).toBe("욕설·비방");
    expect(chosenReason({ chip: "기타", otherText: "  " })).toBe("");
    expect(chosenReason({ chip: "기타", otherText: " 사과함 " })).toBe("사과함");
  });
});
