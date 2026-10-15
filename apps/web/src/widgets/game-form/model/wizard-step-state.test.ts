import { describe, expect, it } from "vitest";

import { isWizardStepSelectable, WIZARD_STEP_STATE, wizardStepState } from "./wizard-step-state";

describe("wizardStepState", () => {
  it("현재보다 앞은 완료, 뒤는 대기다", () => {
    expect([0, 1, 2, 3].map((index) => wizardStepState({ index, current: 2 }))).toEqual([
      WIZARD_STEP_STATE.done,
      WIZARD_STEP_STATE.done,
      WIZARD_STEP_STATE.current,
      WIZARD_STEP_STATE.waiting,
    ]);
  });
});

describe("isWizardStepSelectable", () => {
  it("완료한 단계만 누를 수 있다", () => {
    expect(isWizardStepSelectable(WIZARD_STEP_STATE.done)).toBe(true);
    expect(isWizardStepSelectable(WIZARD_STEP_STATE.current)).toBe(false);
    expect(isWizardStepSelectable(WIZARD_STEP_STATE.waiting)).toBe(false);
  });
});
