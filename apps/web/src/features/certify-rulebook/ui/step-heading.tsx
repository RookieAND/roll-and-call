import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface StepHeadingProps {
  step: number;
  title: string;
  aside?: ReactNode;
}

export function StepHeading({ step, title, aside }: StepHeadingProps) {
  return (
    <HStack align="center" gap="100">
      <Text
        typography="body4"
        weight="extrabold"
        foreground="muted"
        numeric
        aria-hidden
        className="flex size-[22px] flex-none items-center justify-center rounded-full bg-gray-100"
      >
        {step}
      </Text>
      <Text typography="subtitle1" render={<h2 />} className="flex-1">
        {title}
      </Text>
      {aside}
    </HStack>
  );
}
