import { Badge } from "@trpg/ui";

import { gameStatusColor, gameStatusLabel, type GameStatus } from "../model/status";

interface GameStatusBadgeProps {
  status: GameStatus;
}

export function GameStatusBadge({ status }: GameStatusBadgeProps) {
  return (
    <Badge className="flex-shrink-0" color={gameStatusColor[status]}>
      {gameStatusLabel[status]}
    </Badge>
  );
}
