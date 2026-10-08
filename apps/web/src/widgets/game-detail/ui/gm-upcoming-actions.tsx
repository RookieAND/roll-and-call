import type { GameDetailData } from "@/shared/server";

import { ActionPair } from "./action-pair";
import { GameCalendarButton } from "./game-calendar-button";
import { ManageGameLink } from "./manage-game-link";

interface GmUpcomingActionsProps {
  game: GameDetailData;
  calendar: boolean;
}

export function GmUpcomingActions({ game, calendar }: GmUpcomingActionsProps) {
  if (!calendar) return <ManageGameLink gameId={game.id} />;
  return (
    <ActionPair>
      <ManageGameLink gameId={game.id} />
      <GameCalendarButton game={game} variant="outline" />
    </ActionPair>
  );
}
