import { Text } from "@trpg/ui";

import type { Game } from "@/shared/server";

import { deriveGameStatus } from "../model/derive-game-status";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { scheduleLine } from "../model/schedule-line";
import { GameSeatCount } from "./game-seat-count";
import { GameStatusBadge } from "./game-status-badge";

type GameRowData = Game & {
  gm: { username: string; avatarUrl: string | null } | null;
  participants: { userId: string; status: ParticipantStatus }[];
};

export function GameRow({ game }: { game: GameRowData }) {
  const count = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
  });

  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-gray-200 p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Text typography="subtitle1" className="truncate">
            {game.title}
          </Text>
          <GameStatusBadge status={status} />
        </div>
        <Text typography="body4" foreground="muted" className="mt-0.5 block truncate">
          {game.rule} · {scheduleLine(game).text}
        </Text>
      </div>
      <GameSeatCount current={count} max={game.maxPlayers} />
    </div>
  );
}
