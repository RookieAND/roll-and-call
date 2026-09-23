import { HStack } from "@roll-and-call/ui";

import type { OnboardingSlide } from "../model/onboarding-slides";
import { OnboardingPreview } from "./onboarding-preview";

interface SlideVisualProps {
  slideKey: Exclude<OnboardingSlide["key"], "welcome">;
}

export function SlideVisual({ slideKey }: SlideVisualProps) {
  return (
    <HStack
      align="center"
      justify="center"
      inert
      className="h-[242px] rounded-600 border border-gray-100 bg-surface/60 p-225"
    >
      <OnboardingPreview slideKey={slideKey} />
    </HStack>
  );
}
