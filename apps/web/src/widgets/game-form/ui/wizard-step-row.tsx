import { Badge, cn, Text } from "@roll-and-call/ui";

import { WIZARD_STEP_STATE, type WizardStepState } from "../model/wizard-step-state";

interface WizardStepRowProps {
  number: number;
  label: string;
  state: WizardStepState;
  editing: boolean;
  // 있으면 지나온 단계로 돌아가는 버튼이 된다. 없는 행은 눌리지 않는다.
  onSelect?: () => void;
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

export function WizardStepRow({ number, label, state, editing, onSelect }: WizardStepRowProps) {
  const current = state === WIZARD_STEP_STATE.current;
  const badge = STATE_BADGE[state];
  const rowClass = cn(
    "flex min-h-11 w-full items-center gap-125 rounded-400 px-125 text-left",
    current && "bg-tinted-bg",
    onSelect &&
      "cursor-pointer transition-[filter] hover:brightness-[.96] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink",
  );
  const content = (
    <>
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
    </>
  );
  return (
    <li aria-current={current ? "step" : undefined}>
      {onSelect ? (
        <button
          type="button"
          aria-label={`${label} 단계로 이동`}
          onClick={onSelect}
          className={rowClass}
        >
          {content}
        </button>
      ) : (
        <div className={rowClass}>{content}</div>
      )}
    </li>
  );
}
