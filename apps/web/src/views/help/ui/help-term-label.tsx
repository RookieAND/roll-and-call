import { Badge, Text } from "@roll-and-call/ui";

import { GameStatusBadge, MANAGE_STAGE_TONE } from "@/entities/game";

import type { HelpTerm } from "../model/help-docs";

interface HelpTermLabelProps {
  row: HelpTerm;
}

export function HelpTermLabel({ row }: HelpTermLabelProps) {
  if (row.status) return <GameStatusBadge status={row.status} />;
  if (row.stage) return <Badge colorPalette={MANAGE_STAGE_TONE[row.stage]}>{row.term}</Badge>;
  if (row.badge) return <Badge>{row.term}</Badge>;
  return (
    <Text typography="body3" weight="extrabold" render={<span />}>
      {row.term}
    </Text>
  );
}
