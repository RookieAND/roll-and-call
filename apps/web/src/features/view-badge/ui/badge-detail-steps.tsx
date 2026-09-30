import { HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { BadgeMedal, TONE_CLASS } from "@/entities/badge";

import type { BadgeDetail } from "../model/badge-detail";

interface BadgeDetailStepsProps {
  title: string;
  steps: BadgeDetail["steps"];
}

export function BadgeDetailSteps({ title, steps }: BadgeDetailStepsProps) {
  return (
    <VStack gap="100">
      <Text typography="body4" weight="bold" foreground="muted">
        {title}
      </Text>
      <VStack render={<ol />}>
        {steps.map((step) => {
          const nameForeground = step.medal.locked ? "hint" : "normal";
          return (
            <HStack
              key={step.key}
              align="center"
              gap="150"
              render={<li />}
              className={cn("min-h-12 rounded-400 px-125 py-075", step.current && "bg-gray-50")}
            >
              <BadgeMedal
                emoji={step.medal.emoji}
                grade={step.medal.grade}
                locked={step.medal.locked}
                size="xs"
              />
              <VStack gap="025" className="min-w-0 flex-1">
                <Text typography="body2" weight="extrabold" foreground={nameForeground}>
                  {step.name}
                </Text>
                <Text typography="body4" foreground="hint">
                  {step.caption}
                </Text>
              </VStack>
              <Text
                typography="body4"
                weight="bold"
                numeric
                foreground="inherit"
                className={cn("whitespace-nowrap", TONE_CLASS[step.statusTone])}
              >
                {step.status}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
