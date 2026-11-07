import { describe, expect, it } from "vitest";

import { responseStatuses } from "./response-statuses";

describe("responseStatuses", () => {
  it("한 칸이라도 낸 사람만 냄으로 본다", () => {
    const members = [
      { name: "한랑아", isGm: true },
      { name: "오세진", isGm: false },
      { name: "이한울", isGm: false },
    ];
    const names = { a: ["한랑아", "오세진"], b: ["오세진"] };
    expect(responseStatuses({ members, names }).map((member) => member.responded)).toEqual([
      true,
      true,
      false,
    ]);
  });
});
