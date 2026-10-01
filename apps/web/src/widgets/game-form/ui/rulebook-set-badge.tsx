import { Badge } from "@roll-and-call/ui";

import type { EditionSet } from "@/entities/rulebook";

interface RulebookSetBadgeProps {
  set: EditionSet;
}

export function RulebookSetBadge({ set }: RulebookSetBadgeProps) {
  if (set.earned) return <Badge colorPalette="success">인증 완료</Badge>;
  if (set.free) return <Badge colorPalette="primary">무료 배포</Badge>;
  return <Badge>미인증</Badge>;
}
