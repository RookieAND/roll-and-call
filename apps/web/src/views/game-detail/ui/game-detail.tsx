import { Container, Text, VStack } from "@trpg/ui";
import { deriveGameStatus, GameThumbnail, isGameGm, splitRoster } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { GameDetailActions } from "./game-detail-actions";
import { GameDetailHeader } from "./game-detail-header";
import { GameImageGallery } from "./game-image-gallery";
import { GameInfoTable } from "./game-info-table";
import { GameRosterPreview } from "./game-roster-preview";

export function GameDetail({ game, viewerId }: { game: GameDetailData; viewerId: string | null }) {
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const { confirmed, waiting } = splitRoster(game.participants);

  // 뷰어가 이 게임에 어떤 자격으로 들어와 있는지(확정·대기·무관).
  const me = viewerId ? [...confirmed, ...waiting].find((p) => p.userId === viewerId) : undefined;

  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmed.length,
    waitlistEnabled: game.waitlistEnabled,
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
            <GameDetailHeader
              gameId={game.id}
              title={game.title}
              status={status}
              isGm={isGm}
              roomsOpened={game.discordCategoryId !== null}
              sessionEnded={game.sessionEndedAt !== null}
            />

            <GameInfoTable game={game} count={confirmed.length} />

            {game.synopsis && (
              <VStack gap={2}>
                <Text typography="heading3">시놉시스</Text>
                <Text typography="body4" foreground="muted" className="whitespace-pre-wrap">
                  {game.synopsis}
                </Text>
              </VStack>
            )}

            {game.images.length > 0 && <GameImageGallery images={game.images} />}

            <GameRosterPreview
              confirmed={confirmed}
              waitingCount={waiting.length}
              maxPlayers={game.maxPlayers}
            />
          </VStack>

          <GameDetailActions
            game={game}
            viewerId={viewerId}
            isGm={isGm}
            viewerStatus={me?.status ?? null}
            waitlistRank={me?.waitlistRank ?? null}
            waitingCount={waiting.length}
            status={status}
          />
        </VStack>
      </Container>
    </>
  );
}
