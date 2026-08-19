import { AvatarGroup, Container, HStack, Text, VStack } from "@trpg/ui";
import {
  deriveGameStatus,
  GameStatusBadge,
  hasUserJoined,
  isGameGm,
} from "@/entities/game";
import type { GameDetailData } from "@/entities/game/api/queries";
import { AppBar } from "@/shared/ui/app-bar";
import { GameDetailActions } from "./game-detail-actions";
import { GameInfoTable } from "./game-info-table";

export function GameDetail({
  game,
  viewerId,
}: {
  game: GameDetailData;
  viewerId: string | null;
}) {
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const hasJoined = hasUserJoined({
    participants: game.participants,
    userId: viewerId,
  });
  const count = game.participants.length;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
  });

  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap={4} className="pb-6">
          {game.thumbnailUrl ? (
            <img
              src={game.thumbnailUrl}
              alt=""
              className="h-[168px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[168px] w-full items-center justify-center bg-[repeating-linear-gradient(135deg,#F6F6FA_0_10px,#F0F0F5_10px_20px)] text-xs text-gray-400">
              (예정) hero thumbnail
            </div>
          )}

          <VStack gap={4} className="px-4">
            <HStack justify="between" align="start" gap={2}>
              <h1 className="text-[22px] font-extrabold tracking-tight">
                {game.title}
              </h1>
              <GameStatusBadge status={status} />
            </HStack>

            <GameInfoTable game={game} count={count} />

            {game.synopsis && (
              <VStack gap={2}>
                <Text size="xs" weight="bold" color="muted">
                  시놉시스
                </Text>
                <p className="whitespace-pre-wrap text-sm leading-[1.72] text-gray-700">
                  {game.synopsis}
                </p>
              </VStack>
            )}

            <VStack gap={2}>
              <Text size="sm" weight="bold">
                참여자 {count}/{game.maxPlayers}
              </Text>
              {count === 0 ? (
                <p className="text-sm text-gray-500">아직 참여자가 없어요.</p>
              ) : (
                <AvatarGroup
                  max={5}
                  size="stack"
                  people={game.participants.map((p) => ({
                    src: p.user?.avatarUrl,
                    name: p.user?.username,
                  }))}
                />
              )}
            </VStack>

            <GameDetailActions
              game={game}
              viewerId={viewerId}
              isGm={isGm}
              hasJoined={hasJoined}
              status={status}
            />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
