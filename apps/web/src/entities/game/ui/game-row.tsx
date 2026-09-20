import { HStack, Text } from "@trpg/ui";

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
    <HStack align="center" gap="150" className="rounded-600 border border-gray-200 p-150">
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="100">
          <Text truncate typography="subtitle1">
            {game.title}
          </Text>
          <GameStatusBadge status={status} />
        </HStack>
        <Text truncate typography="body4" foreground="muted" className="mt-025">
          {game.rule} · {scheduleLine(game).text}
        </Text>
      </div>
      <GameSeatCount current={count} max={game.maxPlayers} />
    </HStack>
  );
}
