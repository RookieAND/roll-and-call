import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { FlowIcon } from "../model/quest-flows";
import { FLOW_STEP_ICON } from "./flow-step-icon";

interface QuestFlowRowProps {
  label: string;
  steps: readonly { label: string; icon: FlowIcon }[];
}

// 두 번째 칩부터 [→ 칩]을 한 덩어리로 묶어, 줄이 바뀌어도 줄 끝에 화살표만 남지 않게 한다.
export function QuestFlowRow({ label, steps }: QuestFlowRowProps) {
  return (
    <VStack gap="075">
      <Text typography="body4" foreground="hint">
        {label}
      </Text>
      <HStack align="center" wrap className="gap-x-025 gap-y-075" render={<ol />}>
        {steps.map((step, index) => {
          const Icon = FLOW_STEP_ICON[step.icon];
          return (
            <HStack key={step.label} align="center" gap="025" render={<li />}>
              {index > 0 && (
                <ChevronRight
                  size={14}
                  strokeWidth={2}
                  aria-hidden
                  className="flex-none text-hint"
                />
              )}
              <Chip
                tone="outline"
                render={<span />}
                className="h-7 gap-050 bg-surface px-100 font-medium text-gray-900"
              >
                <Icon
                  size={14}
                  strokeWidth={2}
                  aria-hidden
                  className="flex-none text-primary-ink"
                />
                {step.label}
              </Chip>
            </HStack>
          );
        })}
      </HStack>
    </VStack>
  );
}
