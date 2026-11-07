import { Badge } from "@roll-and-call/ui";

import type { EditionSet } from "@/entities/rulebook";

import { rulebookSetBadgeOf } from "../model/rulebook-set-badge-of";

interface RulebookSetBadgeProps {
  set: EditionSet;
}

export function RulebookSetBadge({ set }: RulebookSetBadgeProps) {
  const badge = rulebookSetBadgeOf(set);
  if (!badge) return null;
  return <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge>;
}
