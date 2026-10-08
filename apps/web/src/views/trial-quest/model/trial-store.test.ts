import { describe, expect, it } from "vitest";

import { TRIAL_KIND } from "./trial-kind";
import { EMPTY_TRIAL_STORE, trialReducer } from "./trial-store";

describe("체험 저장소", () => {
  it("신청하고 취소한다", () => {
    const applied = trialReducer(EMPTY_TRIAL_STORE, { type: "apply", kind: TRIAL_KIND.lottery });
    expect(applied.applied).toEqual({ [TRIAL_KIND.lottery]: true });
    expect(
      trialReducer(applied, { type: "cancelApply", kind: TRIAL_KIND.lottery }).applied,
    ).toEqual({});
  });
});
