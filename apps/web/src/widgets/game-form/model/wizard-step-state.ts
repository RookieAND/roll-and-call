export const WIZARD_STEP_STATE = {
  current: "current",
  done: "done",
  waiting: "waiting",
} as const;

export type WizardStepState = (typeof WIZARD_STEP_STATE)[keyof typeof WIZARD_STEP_STATE];

export function wizardStepState({ index, current }: { index: number; current: number }) {
  if (index === current) return WIZARD_STEP_STATE.current;
  return index < current ? WIZARD_STEP_STATE.done : WIZARD_STEP_STATE.waiting;
}
