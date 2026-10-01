import { Badge } from "@roll-and-call/ui";
import Link from "next/link";

interface DrawResultLinkProps {
  gameId: string;
}

export function DrawResultLink({ gameId }: DrawResultLinkProps) {
  return (
    <Badge colorPalette="primary" render={<Link href={`/games/${gameId}/draw`} />}>
      추첨 결과
    </Badge>
  );
}
