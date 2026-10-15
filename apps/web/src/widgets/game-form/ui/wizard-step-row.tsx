import { Badge, cn, HStack, Text } from "@roll-and-call/ui";

import { WIZARD_STEP_STATE, type WizardStepState } from "../model/wizard-step-state";

interface WizardStepRowProps {
  number: number;
  label: string;
  state: WizardStepState;
  editing: boolean;
}

const STATE_BADGE = {
  [WIZARD_STEP_STATE.current]: {
    palette: "primary",
    label: (editing: boolean) => (editing ? "수정 중" : "작성 중"),
  },
  [WIZARD_STEP_STATE.done]: { palette: "success", label: () => "완료" },
  [WIZARD_STEP_STATE.waiting]: { palette: "gray", label: () => "대기" },
} as const;

const DOT_CLASS = {
  [WIZARD_STEP_STATE.current]: "bg-primary-600 text-on-primary",
  [WIZARD_STEP_STATE.done]: "bg-primary-100 text-tinted-ink",
  [WIZARD_STEP_STATE.waiting]: "bg-gray-100 text-gray-600",
} as const;

export function WizardStepRow({ number, label, state, editing }: WizardStepRowProps) {
  const current = state === WIZARD_STEP_STATE.current;
  const badge = STATE_BADGE[state];
  return (
    <HStack
      align="center"
      gap="125"
      render={<li />}
      aria-current={current ? "step" : undefined}
      className={cn("min-h-11 rounded-400 px-125", current && "bg-tinted-bg")}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-5.5 flex-none items-center justify-center rounded-full text-body5 font-bold",
          DOT_CLASS[state],
        )}
      >
        {number}
      </span>
      <Text
        typography="body3"
        weight={current ? "bold" : "medium"}
        foreground={current ? "normal" : "muted"}
        render={<span />}
        className="flex-1"
      >
        {label}
      </Text>
      <Badge colorPalette={badge.palette}>{badge.label(editing)}</Badge>
    </HStack>
  );
}
