import type { RulebookKind } from "@roll-and-call/database";
import { RadioCard, RadioGroup } from "@roll-and-call/ui";

import { RULEBOOK_KIND_DESCRIPTION, RULEBOOK_KIND_LABEL } from "@/shared/lib";

interface KindCardsProps {
  kind: RulebookKind;
  disabled?: boolean;
  onChange: (kind: RulebookKind) => void;
}

export function KindCards({ kind, disabled, onChange }: KindCardsProps) {
  return (
    <RadioGroup
      value={kind}
      disabled={disabled}
      onValueChange={(next) => onChange(next as RulebookKind)}
      aria-label="종류"
      className="grid grid-cols-3 gap-100"
    >
      {Object.entries(RULEBOOK_KIND_LABEL).map(([value, label]) => (
        <RadioCard.Root key={value} value={value}>
          <RadioCard.Title>{label}</RadioCard.Title>
          <RadioCard.Description>
            {RULEBOOK_KIND_DESCRIPTION[value as RulebookKind]}
          </RadioCard.Description>
          <RadioCard.Indicator />
        </RadioCard.Root>
      ))}
    </RadioGroup>
  );
}
