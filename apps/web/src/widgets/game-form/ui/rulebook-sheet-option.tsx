"use client";

import { RULE_GATE, RulebookOption, type EditionSet, type RuleGate } from "@/entities/rulebook";

import { RulebookSetBadge } from "./rulebook-set-badge";

interface RulebookSheetOptionProps {
  set: EditionSet;
  gate: RuleGate;
  selected: boolean;
  tabbable: boolean;
  onPick: () => void;
}

export function RulebookSheetOption({
  set,
  gate,
  selected,
  tabbable,
  onPick,
}: RulebookSheetOptionProps) {
  return (
    <RulebookOption
      name={set.edition || set.categoryName}
      edition=""
      selected={selected}
      tabbable={tabbable}
      locked={gate.type === RULE_GATE.blocked}
      reason={<RulebookSetBadge set={set} />}
      onClick={onPick}
    />
  );
}
