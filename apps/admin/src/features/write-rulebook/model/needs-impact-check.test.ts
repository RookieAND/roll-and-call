import { describe, expect, it } from "vitest";

import { needsImpactCheck } from "./needs-impact-check";
import type { RulebookDraft } from "./rulebook-draft";

const saved: RulebookDraft = {
  name: "수호자 룰북",
  edition: "7판",
  category: "크툴루의 부름",
  kind: "core",
  supersedesId: "coc6",
  aliasesText: "",
  certRequired: false,
};

describe("needsImpactCheck", () => {
  it("구판 연결을 풀거나 인증 필요로 바꿀 때만 확인한다", () => {
    expect(needsImpactCheck({ saved, next: saved })).toBe(false);
    expect(needsImpactCheck({ saved, next: { ...saved, supersedesId: null } })).toBe(true);
    expect(needsImpactCheck({ saved, next: { ...saved, kind: "supplement" } })).toBe(true);
    expect(needsImpactCheck({ saved, next: { ...saved, certRequired: true } })).toBe(true);
    expect(
      needsImpactCheck({
        saved: { ...saved, supersedesId: null, certRequired: true },
        next: { ...saved, supersedesId: "coc6", certRequired: false },
      }),
    ).toBe(false);
  });
});
