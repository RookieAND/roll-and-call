import { Badge, Text } from "@roll-and-call/ui";

import { GameStatusBadge } from "@/entities/game";

import type { HelpTerm } from "../model/help-docs";

interface HelpTermLabelProps {
  row: HelpTerm;
}

export function HelpTermLabel({ row }: HelpTermLabelProps) {
  if (row.status) return <GameStatusBadge status={row.status} />;
  if (row.badge) return <Badge>{row.term}</Badge>;
  return (
    <Text typography="body3" weight="extrabold" render={<span />}>
      {row.term}
    </Text>
  );
}
