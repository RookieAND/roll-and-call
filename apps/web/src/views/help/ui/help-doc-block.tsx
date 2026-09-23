import { VStack } from "@roll-and-call/ui";

import { HELP_BLOCK, type HelpBlock } from "../model/help-docs";
import { HelpModeCard } from "./help-mode-card";
import { HelpSteps } from "./help-steps";
import { HelpTermSection } from "./help-term-section";

interface HelpDocBlockProps {
  block: HelpBlock;
}

export function HelpDocBlock({ block }: HelpDocBlockProps) {
  if (block.kind === HELP_BLOCK.steps) {
    return <HelpSteps steps={block.steps} />;
  }

  if (block.kind === HELP_BLOCK.modes) {
    return (
      <VStack gap="150">
        {block.modes.map((mode) => (
          <HelpModeCard key={mode.method} mode={mode} />
        ))}
      </VStack>
    );
  }

  return <HelpTermSection label={block.label} description={block.description} rows={block.rows} />;
}
