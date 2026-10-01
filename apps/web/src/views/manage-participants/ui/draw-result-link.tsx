import { Badge } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface DrawResultLinkProps {
  gameId: string;
}

export function DrawResultLink({ gameId }: DrawResultLinkProps) {
  return (
    <Badge colorPalette="primary" render={<ServerLink path={`/games/${gameId}/draw`} />}>
      추첨 결과
    </Badge>
  );
}
