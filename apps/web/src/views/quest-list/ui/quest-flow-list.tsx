import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { FlowIcon } from "../model/quest-flows";
import { FLOW_STEP_ICON } from "./flow-step-icon";

interface QuestFlowListProps {
  label: string;
  steps: readonly { label: string; icon: FlowIcon }[];
}

// 데스크톱 패널의 흐름. 모바일의 칩 줄(QuestFlowRow)과 같은 데이터를 세로 목록으로 그린다.
export function QuestFlowList({ label, steps }: QuestFlowListProps) {
  return (
    <VStack gap="100">
      <Text typography="body4" foreground="hint">
        {label}
      </Text>
      <VStack gap="075" render={<ol />}>
        {steps.map((step) => {
          const Icon = FLOW_STEP_ICON[step.icon];
          return (
            <HStack key={step.label} align="center" gap="100" render={<li />}>
              <span
                aria-hidden
                className="flex size-6 flex-none items-center justify-center rounded-full bg-primary-50 text-primary-ink"
              >
                <Icon size={13} strokeWidth={2.2} />
              </span>
              <Text typography="body3" weight="medium">
                {step.label}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
