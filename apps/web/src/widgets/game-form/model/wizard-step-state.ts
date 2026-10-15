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

// 지나온(완료) 단계로만 돌아갈 수 있다. 되돌아가는 데는 검증이 필요 없지만 앞으로 건너뛰면 단계별 검증을 거르게 된다.
export function isWizardStepSelectable(state: WizardStepState) {
  return state === WIZARD_STEP_STATE.done;
}
