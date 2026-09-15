import { Badge } from "@trpg/ui";

import { gameStatusColor, gameStatusLabel, type GameStatus } from "../model/status";

export function GameStatusBadge({ status }: { status: GameStatus }) {
  return (
    <Badge className="flex-shrink-0" color={gameStatusColor[status]}>
      {gameStatusLabel[status]}
    </Badge>
  );
}
