import type { RulebookKind } from "@roll-and-call/database";
import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { RadioCard, RadioGroup } from "@roll-and-call/ui";
import { BookOpen, BookPlus, BookUser } from "lucide-react";

import { RULEBOOK_KIND_DESCRIPTION, RULEBOOK_KIND_LABEL } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

import { isRulebookKind } from "../model/is-rulebook-kind";

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
      onValueChange={(next) => {
        if (isRulebookKind(next)) onChange(next);
      }}
      aria-label="종류"
      className="grid grid-cols-1 gap-100"
    >
      {Object.values(RULEBOOK_KIND).map((value) => {
        const Icon = KIND_ICON[value];
        return (
          <RadioCard.Root key={value} value={value} className="grid-cols-[auto_1fr_auto]">
            <span className="col-start-1 row-span-2 row-start-1 flex size-8 items-center justify-center rounded-300 bg-gray-100 text-gray-600">
              <Icon size={18} aria-hidden />
            </span>
            <RadioCard.Title className="col-start-2">{RULEBOOK_KIND_LABEL[value]}</RadioCard.Title>
            <RadioCard.Description className="col-start-2">
              <LineBreaks lines={RULEBOOK_KIND_DESCRIPTION[value].split("\n")} />
            </RadioCard.Description>
            <RadioCard.Indicator className="col-start-3" />
          </RadioCard.Root>
        );
      })}
    </RadioGroup>
  );
}
