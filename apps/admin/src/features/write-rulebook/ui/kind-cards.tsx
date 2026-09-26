import type { RulebookKind } from "@roll-and-call/database";
import { RadioCard, RadioGroup } from "@roll-and-call/ui";
import { BookOpen, BookPlus, BookUser } from "lucide-react";

import { RULEBOOK_KIND_DESCRIPTION, RULEBOOK_KIND_LABEL } from "@/shared/lib";

const KIND_ICON = { core: BookOpen, supplement: BookPlus, handbook: BookUser } as const;

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
      className="grid grid-cols-1 gap-100"
    >
      {Object.entries(RULEBOOK_KIND_LABEL).map(([value, label]) => {
        const Icon = KIND_ICON[value as RulebookKind];
        return (
          <RadioCard.Root key={value} value={value} className="grid-cols-[auto_1fr_auto]">
            <span className="col-start-1 row-span-2 row-start-1 flex size-8 items-center justify-center rounded-300 bg-gray-100 text-gray-600">
              <Icon size={18} aria-hidden />
            </span>
            <RadioCard.Title className="col-start-2">{label}</RadioCard.Title>
            <RadioCard.Description className="col-start-2">
              {RULEBOOK_KIND_DESCRIPTION[value as RulebookKind]}
            </RadioCard.Description>
            <RadioCard.Indicator className="col-start-3" />
          </RadioCard.Root>
        );
      })}
    </RadioGroup>
  );
}
