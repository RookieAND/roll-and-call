import { Checkbox, Text, VStack, cn } from "@roll-and-call/ui";

import type { SplitCandidate } from "../model/split-candidate";

interface SplitTeamsMemberRowProps {
  candidate: SplitCandidate;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export function SplitTeamsMemberRow({ candidate, checked, onToggle }: SplitTeamsMemberRowProps) {
  return (
    <Checkbox.Field
      className={cn("flex min-h-13 w-full gap-150 px-175 py-075", checked && "bg-tinted-bg")}
    >
      <Checkbox.Root checked={checked} onCheckedChange={onToggle}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <VStack gap={0} className="min-w-0 flex-1">
        <Text typography="body2" weight="medium">
          {candidate.username}
        </Text>
        {candidate.subline && (
          <Text typography="body4" foreground="hint" truncate>
            {candidate.subline}
          </Text>
        )}
      </VStack>
    </Checkbox.Field>
  );
}
