import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { TIMELINE_STATE, type TimelineStep } from "../model/manage-timeline";
import { ManageTimelineDot } from "./manage-timeline-dot";

const STEP_FOREGROUND = {
  done: "normal",
  current: "primary",
  todo: "hint",
} as const;

interface ManageTimelineProps {
  steps: TimelineStep[];
}

export function ManageTimeline({ steps }: ManageTimelineProps) {
  return (
    <Card.Root padding="md" radius={600}>
      <Text typography="subtitle1" render={<h2 />} className="mb-200 block">
        진행 상태
      </Text>
      <VStack>
        {steps.map((step, index) => (
          <HStack key={step.name} gap="150" align="stretch">
            <VStack align="center" className="w-5.5 flex-none">
              <ManageTimelineDot state={step.state} />
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`my-025 min-h-6 w-0.5 flex-1 rounded-full ${step.state === TIMELINE_STATE.done ? "bg-success-solid" : "bg-gray-200"}`}
                />
              )}
            </VStack>
            <VStack gap="025" className="min-w-0 flex-1 pb-150">
              <Text typography="subtitle2" foreground={STEP_FOREGROUND[step.state]}>
                {step.name}
              </Text>
              {step.detail && (
                <Text typography="body4" foreground="muted">
                  {step.detail}
                </Text>
              )}
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Card.Root>
  );
}
