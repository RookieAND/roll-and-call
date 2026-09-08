import { AvatarGroup, Container, HStack, Text, VStack } from "@trpg/ui";
import {
  deriveGameStatus,
  GameStatusBadge,
  GameThumbnail,
  isGameGm,
  splitRoster,
} from "@/entities/game";
import type { GameDetailData } from "@/entities/game/index.server";
import { GameGmMenu } from "@/features/manage-game";
import { AppBar } from "@/shared/ui/app-bar";
import { GameDetailActions } from "./game-detail-actions";
import { GameInfoTable } from "./game-info-table";

export function GameDetail({ game, viewerId }: { game: GameDetailData; viewerId: string | null }) {
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const { confirmed, waiting } = splitRoster(game.participants);
  const confirmedCount = confirmed.length;

  const me = viewerId ? [...confirmed, ...waiting].find((p) => p.userId === viewerId) : undefined;
  const viewerStatus = me?.status ?? null;
  const waitlistRank = me?.waitlistRank ?? null;

  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmedCount,
  });

  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap={4}>
          <GameThumbnail
            url={game.thumbnailUrl}
            sizes="(max-width: 896px) 100vw, 896px"
            className="h-42 w-full"
          />

          <VStack gap={4} className="px-4">
            <HStack justify="between" align="start" gap={2}>
              <Text typography="heading1" render={<h1 />}>
                {game.title}
              </Text>
              <HStack align="center" gap={1} className="mt-0.5 shrink-0">
                <GameStatusBadge status={status} />
                {isGm && <GameGmMenu gameId={game.id} />}
              </HStack>
            </HStack>

            <GameInfoTable game={game} count={confirmedCount} />

            {game.synopsis && (
              <VStack gap={2}>
                <Text typography="heading3">시놉시스</Text>
                <Text typography="body4" foreground="muted" className="whitespace-pre-wrap">
                  {game.synopsis}
                </Text>
              </VStack>
            )}

            <VStack gap={2}>
              <Text typography="heading3">
                참여자 {confirmedCount}/{game.maxPlayers}
              </Text>
              {confirmedCount === 0 ? (
                <Text typography="body2" foreground="muted" render={<p />}>
                  아직 참여자가 없어요.
                </Text>
              ) : (
                <AvatarGroup
                  max={5}
                  size="stack"
                  people={confirmed.map((p) => ({
                    src: p.user?.avatarUrl,
                    name: p.user?.username,
                  }))}
                />
              )}
              {waiting.length > 0 && (
                <Text typography="body3" foreground="muted">
                  대기 {waiting.length}명
                </Text>
              )}
            </VStack>
          </VStack>

          <GameDetailActions
            game={game}
            viewerId={viewerId}
            isGm={isGm}
            viewerStatus={viewerStatus}
            waitlistRank={waitlistRank}
            waitingCount={waiting.length}
            status={status}
          />
        </VStack>
      </Container>
    </>
  );
}
