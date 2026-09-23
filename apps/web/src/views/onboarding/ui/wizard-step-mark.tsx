import { Text } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

const mark = cva(
  "flex size-[22px] flex-none items-center justify-center rounded-300 tabular-nums",
  { variants: { done: { true: "bg-primary-600 text-white", false: "bg-gray-100 text-hint" } } },
);

const connector = cva("h-0.5 flex-1", {
  variants: { done: { true: "bg-tinted-border", false: "bg-gray-200" } },
});

interface WizardStepMarkProps {
  step: number;
  currentStep: number;
  last: boolean;
}

export function WizardStepMark({ step, currentStep, last }: WizardStepMarkProps) {
  const reached = step <= currentStep;
  const passed = step < currentStep;

  return (
    <>
      <Text
        typography="body4"
        weight="extrabold"
        render={<span />}
        className={mark({ done: reached })}
      >
        {step}
      </Text>
      {!last && <span className={connector({ done: passed })} />}
    </>
  );
}
