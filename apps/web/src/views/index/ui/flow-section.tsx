import { Container, VStack } from "@roll-and-call/ui";

import { FLOW_STEPS } from "../model/flow-steps";
import { FlowStepCard } from "./flow-step-card";
import { SectionHeading } from "./section-heading";

export function FlowSection() {
  return (
    <Container render={<section />} className="pt-[clamp(56px,8cqw,104px)]">
      <VStack className="gap-[clamp(20px,3cqw,32px)]">
        <SectionHeading eyebrow="HOW IT WORKS" title="이용 흐름" />
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,196px),1fr))] gap-175">
          {FLOW_STEPS.map((step, index) => (
            <FlowStepCard key={step.title} step={step} order={index + 1} />
          ))}
        </ol>
      </VStack>
    </Container>
  );
}
