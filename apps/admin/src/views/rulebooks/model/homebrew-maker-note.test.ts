import { HOMEBREW_RULE_SCOPE } from "@roll-and-call/database/homebrew/model";
import { describe, expect, it } from "vitest";

import { homebrewMakerNote } from "./homebrew-maker-note";

const approvedAt = new Date("2026-11-06T01:24:00Z");

describe("homebrewMakerNote", () => {
  it("제작자 닉네임과 사용 범위를 잇는다", () => {
    expect(
      homebrewMakerNote({
        makerId: "u1",
        maker: "달빛토끼",
        scope: HOMEBREW_RULE_SCOPE.makerOnly,
        approvedAt,
      }),
    ).toBe("제작자 달빛토끼 · 제작자만 사용");
  });

  it("제작자가 없으면 알 수 없음으로 적는다", () => {
    expect(
      homebrewMakerNote({
        makerId: null,
        maker: null,
        scope: HOMEBREW_RULE_SCOPE.everyone,
        approvedAt,
      }),
    ).toBe("제작자 알 수 없음 · 전체 사용");
  });
});
