import { Badge } from "@roll-and-call/ui";

import { gameStatusColor, gameStatusLabel, type GameStatus } from "@/shared/lib";

interface GameStatusBadgeProps {
  status: GameStatus;
}

export function GameStatusBadge({ status }: GameStatusBadgeProps) {
  return (
    <Badge className="flex-shrink-0" colorPalette={gameStatusColor[status]}>
      {gameStatusLabel[status]}
    </Badge>
  );
}
