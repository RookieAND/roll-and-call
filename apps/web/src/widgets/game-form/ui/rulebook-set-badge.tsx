import { Badge } from "@roll-and-call/ui";

import type { EditionSet } from "@/entities/rulebook";

import { rulebookSetBadgeOf } from "../model/rulebook-set-badge-of";

interface RulebookSetBadgeProps {
  set: EditionSet;
}

export function RulebookSetBadge({ set }: RulebookSetBadgeProps) {
  const { label, colorPalette } = rulebookSetBadgeOf(set);
  return <Badge colorPalette={colorPalette}>{label}</Badge>;
}
