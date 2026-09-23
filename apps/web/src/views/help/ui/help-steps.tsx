import { Callout, HStack, Text, VStack } from "@roll-and-call/ui";

import type { HelpStep } from "../model/help-docs";
import { HelpFigure } from "./help-figure";

interface HelpStepsProps {
  steps: HelpStep[];
}

export function HelpSteps({ steps }: HelpStepsProps) {
  return (
    <VStack render={<ol />}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <HStack key={step.title} gap="150" render={<li />}>
            <VStack align="center" className="flex-none pt-025">
              <Text
                typography="body4"
                weight="extrabold"
                foreground="onPrimary"
                render={<span />}
                className="flex size-[26px] items-center justify-center rounded-400 bg-primary-600 tabular-nums"
              >
                {index + 1}
              </Text>
              {!last && <span className="mt-075 w-0.5 flex-1 bg-gray-200" />}
            </VStack>
            <VStack gap="075" className={last ? "min-w-0 flex-1" : "min-w-0 flex-1 pb-225"}>
              <Text typography="subtitle1" weight="extrabold" render={<h3 />}>
                {step.title}
              </Text>
              <Text typography="body3" foreground="muted" render={<p />} className="text-pretty">
                {step.body}
              </Text>
              {step.figure && (
                <div className="mt-075">
                  <HelpFigure figure={step.figure} />
                </div>
              )}
              {step.note && (
                <Callout.Root colorPalette="primary" size="sm" className="mt-075">
                  <Callout.Description>{step.note}</Callout.Description>
                </Callout.Root>
              )}
            </VStack>
          </HStack>
        );
      })}
    </VStack>
  );
}
