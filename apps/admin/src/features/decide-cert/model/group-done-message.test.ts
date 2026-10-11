import { describe, expect, it } from "vitest";

import { groupDoneMessage } from "./group-done-message";

describe("groupDoneMessage", () => {
  it("승인만, 반려만, 둘 다를 구분한다", () => {
    expect(groupDoneMessage({ approveCount: 3, rejectCount: 0, nickname: "A" })).toBe(
      "3권을 승인했습니다 · A",
    );
    expect(groupDoneMessage({ approveCount: 0, rejectCount: 2, nickname: "A" })).toBe(
      "2권을 반려했습니다 · A",
    );
    expect(groupDoneMessage({ approveCount: 8, rejectCount: 2, nickname: "A" })).toBe(
      "8권 승인, 2권 반려했습니다 · A",
    );
  });
});
