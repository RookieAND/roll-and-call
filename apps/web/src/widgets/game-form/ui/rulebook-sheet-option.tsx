"use client";

import { RULE_GATE, RulebookOption, type EditionSet, type RuleGate } from "@/entities/rulebook";

import { RulebookSetBadge } from "./rulebook-set-badge";

interface RulebookSheetOptionProps {
  set: EditionSet;
  gate: RuleGate;
  selected: boolean;
  onPick: () => void;
}

export function RulebookSheetOption({ set, gate, selected, onPick }: RulebookSheetOptionProps) {
  return (
    <RulebookOption
      name={set.edition || set.categoryName}
      edition=""
      selected={selected}
      locked={gate.type === RULE_GATE.blocked}
      reason={<RulebookSetBadge set={set} />}
      onClick={onPick}
    />
  );
}
