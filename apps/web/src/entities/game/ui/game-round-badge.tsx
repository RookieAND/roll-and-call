import { Badge } from "@trpg/ui";

// 2회차부터만 보이는 회차 뱃지. 1회차는 아무것도 그리지 않는다.
export function GameRoundBadge({ round }: { round: number }) {
  if (round <= 1) return null;
  return (
    <Badge color="primary" className="shrink-0 font-mono">
      {round}회차
    </Badge>
  );
}
