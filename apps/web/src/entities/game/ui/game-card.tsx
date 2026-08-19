import { Card, HStack, Text, VStack } from "@trpg/ui";
import type { Game } from "@/shared/api/db";
import { deriveGameStatus } from "../model/derive-game-status";
import { GameGmLabel } from "./game-gm-label";
import { GameSeatProgress } from "./game-seat-progress";
import { GameStatusBadge } from "./game-status-badge";

type Props = {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string }[];
  };
};

export function GameCard({ game }: Props) {
  const count = game.participants.length;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
  });

  return (
    <Card interactive className="h-full">
      <VStack gap={2}>
        <HStack justify="between" align="start" gap={2}>
          <Text weight="bold" className="text-[15.5px]">
            {game.title}
          </Text>
          <GameStatusBadge status={status} />
        </HStack>
        <Text size="sm" color="muted">
          {game.rule}
        </Text>
        <HStack justify="between" align="center">
          <GameGmLabel name={game.gm?.username} avatarUrl={game.gm?.avatarUrl} />
          <GameSeatProgress
            current={count}
            max={game.maxPlayers}
            status={status}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
