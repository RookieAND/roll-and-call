import { Card, HStack, Text, VStack } from "@trpg/ui";
import type { Game } from "@/shared/server";
import { deriveGameStatus } from "../model/derive-game-status";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { GameGmLabel } from "./game-gm-label";
import { GameSeatProgress } from "./game-seat-progress";
import { GameRoundBadge } from "./game-round-badge";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

type Props = {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
};

export function GameCard({ game }: Props) {
  const count = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
  });

  return (
    <Card interactive padding="none" className="h-full overflow-hidden">
      {game.thumbnailUrl && (
        <GameThumbnail
          url={game.thumbnailUrl}
          sizes="(max-width: 896px) 100vw, 896px"
          className="h-32 w-full"
        />
      )}
      <VStack gap={2} className="p-4">
        <HStack justify="between" align="start" gap={2}>
          <HStack align="center" gap={2} className="min-w-0">
            <GameRoundBadge round={game.round} />
            <Text typography="heading3" className="truncate">
              {game.title}
            </Text>
          </HStack>
          <GameStatusBadge status={status} />
        </HStack>
        <Text typography="body2" foreground="muted">
          {game.rule}
        </Text>
        <HStack justify="between" align="center">
          <GameGmLabel name={game.gm?.username} avatarUrl={game.gm?.avatarUrl} />
          <GameSeatProgress current={count} max={game.maxPlayers} status={status} />
        </HStack>
      </VStack>
    </Card>
  );
}
