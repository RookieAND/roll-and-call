import { describe, expect, it } from "vitest";

import { noShowKickHint } from "./no-show-kick-hint";

describe("noShowKickHint", () => {
  it("회차 번호가 있으면 문구를 만든다", () => {
    expect(noShowKickHint(3)).toBe("3회차에 내보냄");
    expect(noShowKickHint(null)).toBeNull();
  });
});
