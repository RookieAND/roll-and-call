import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { FlowStep } from "../model/flow-steps";

interface FlowStepCardProps {
  step: FlowStep;
  order: number;
}

// 단계마다 데이터 팔레트 색이 달라 유틸리티 대신 변수로 칠한다.
export function FlowStepCard({ step, order }: FlowStepCardProps) {
  const Icon = step.icon;
  const ink = `var(--rc-color-data-${step.palette}-ink)`;
  const background = `var(--rc-color-data-${step.palette}-bg)`;

  return (
    <VStack
      gap="175"
      render={<li />}
      className="relative overflow-hidden rounded-700 border border-gray-200 bg-surface px-225 pt-250 pb-225"
    >
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: ink }} />
      <HStack align="center" gap="150">
        <span
          className="flex size-12 flex-none items-center justify-center rounded-600"
          style={{
            background,
            color: ink,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ink} 22%, transparent)`,
          }}
        >
          <Icon size={24} strokeWidth={2.1} aria-hidden />
        </span>
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="code2" weight="bold" style={{ color: ink }}>
            STEP 0{order}
          </Text>
          <Text typography="body4" weight="bold" foreground="hint" className="whitespace-nowrap">
            {step.who}
          </Text>
        </VStack>
      </HStack>
      <VStack gap="050">
        <Text typography="subtitle1" weight="bold" render={<h3 />}>
          {step.title}
        </Text>
        <Text typography="body3" foreground="muted" className="[text-wrap:pretty]">
          {step.description}
        </Text>
      </VStack>
    </VStack>
  );
}
