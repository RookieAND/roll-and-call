import { gameStatusLabel, type GameStatus } from "@roll-and-call/database/games/model";
import { Badge } from "@roll-and-call/ui";

import { gameStatusColor } from "../model/game-status-color";

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
