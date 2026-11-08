import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { FlowIcon } from "../model/quest-flows";
import { FLOW_STEP_ICON } from "./flow-step-icon";

interface QuestFlowListProps {
  label: string;
  steps: readonly { label: string; icon: FlowIcon; description: string }[];
}

export function QuestFlowList({ label, steps }: QuestFlowListProps) {
  return (
    <VStack gap="075">
      <Text typography="body3" weight="bold" foreground="muted">
        {label}
      </Text>
      <VStack gap="100" render={<ol />}>
        {steps.map((step) => {
          const Icon = FLOW_STEP_ICON[step.icon];
          return (
            <HStack key={step.label} align="start" gap="100" render={<li />}>
              <span
                aria-hidden
                className="flex size-6 flex-none items-center justify-center rounded-full bg-primary-50 text-tinted-ink"
              >
                <Icon size={13} strokeWidth={2.2} />
              </span>
              <VStack gap="025" className="min-w-0 flex-1">
                <Text typography="body3" weight="medium">
                  {step.label}
                </Text>
                <Text typography="body4" foreground="hint">
                  {step.description}
                </Text>
              </VStack>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
