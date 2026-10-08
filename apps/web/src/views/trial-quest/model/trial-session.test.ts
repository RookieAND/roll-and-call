import { describe, expect, it } from "vitest";

import { TRIAL_KIND } from "./trial-kind";
import { endedSessionKind } from "./trial-session";

describe("끝난 체험 세션", () => {
  it("신청한 게 없으면 선착순 세션이다", () => {
    expect(endedSessionKind({})).toBe(TRIAL_KIND.firstCome);
  });

  it("추첨만 신청했으면 추첨 세션을 잇는다", () => {
    expect(endedSessionKind({ [TRIAL_KIND.lottery]: true })).toBe(TRIAL_KIND.lottery);
    expect(endedSessionKind({ [TRIAL_KIND.lottery]: true, [TRIAL_KIND.firstCome]: true })).toBe(
      TRIAL_KIND.firstCome,
    );
  });
});
