import { Badge } from "@trpg/ui";

export function GameRoundBadge({ round }: { round: number }) {
  if (round <= 1) return null;
  return (
    <Badge color="primary" className="shrink-0 font-mono">
      {round}회차
    </Badge>
  );
}
