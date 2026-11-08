import { Text, VStack } from "@roll-and-call/ui";

import { isWizardStepSelectable, wizardStepState } from "@/shared/lib";

import { WizardStepRow } from "./wizard-step-row";

export interface WizardPanelStep {
  number: number;
  label: string;
}

interface WizardProgressSectionProps {
  steps: readonly WizardPanelStep[];
  current: number;
  editing?: boolean;
  // 있으면 지나온 단계로 돌아가는 버튼이 된다.
  onSelectStep?: (index: number) => void;
}

// 위저드 오른쪽 패널의 「진행 상황」.
export function WizardProgressSection({
  steps,
  current,
  editing = false,
  onSelectStep,
}: WizardProgressSectionProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="subtitle2" foreground="muted" render={<h2 />}>
        진행 상황
      </Text>
      <ol className="flex flex-col gap-025">
        {steps.map((step, index) => {
          const state = wizardStepState({ index, current });
          return (
            <WizardStepRow
              key={step.number}
              number={step.number}
              label={step.label}
              state={state}
              editing={editing}
              onSelect={
                onSelectStep && isWizardStepSelectable(state)
                  ? () => onSelectStep(index)
                  : undefined
              }
            />
          );
        })}
      </ol>
    </VStack>
  );
}
