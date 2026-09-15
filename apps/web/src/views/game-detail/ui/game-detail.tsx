import { Container, VStack } from "@trpg/ui";

import {
  deriveGameStatus,
  GameThumbnail,
  isGameGm,
  SCHEDULE_MODE,
  scheduleLine,
  splitRoster,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { GameDetailActions } from "./game-detail-actions";
import { GameDetailHeader } from "./game-detail-header";
import { GameImageGallery } from "./game-image-gallery";
import { GameInfoTable } from "./game-info-table";
import { GameRosterSection } from "./game-roster-section";
import { GameSynopsis } from "./game-synopsis";

export function GameDetail({
  game,
  viewerId,
  respondedIds,
}: {
  game: GameDetailData;
  viewerId: string | null;
  respondedIds: string[];
}) {
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const { confirmed, waiting } = splitRoster(game.participants);

  const viewerParticipant = viewerId
    ? [...confirmed, ...waiting].find((participant) => participant.userId === viewerId)
    : undefined;

  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmed.length,
    waitlistEnabled: game.waitlistEnabled,
  });
  const respondedConfirmed = confirmed.filter((participant) =>
    respondedIds.includes(participant.userId),
  ).length;
  const canChangeTime = game.scheduleMode === SCHEDULE_MODE.coordinate && game.confirmedAt !== null;
  const viewerResponded = viewerId !== null && respondedIds.includes(viewerId);

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

          <VStack gap={5} className="px-4 pb-2">
            <GameDetailHeader
              gameId={game.id}
              title={game.title}
              status={status}
              statusLine={scheduleLine(game)}
              isGm={isGm}
              confirmedCount={confirmed.length}
              waitingCount={waiting.length}
              canChangeTime={canChangeTime}
            />

            <GameInfoTable game={game} isGm={isGm} />

            {game.synopsis && <GameSynopsis synopsis={game.synopsis} />}

            {game.images.length > 0 && <GameImageGallery images={game.images} isGm={isGm} />}

            <GameRosterSection
              gameId={game.id}
              confirmed={confirmed}
              waiting={waiting}
              maxPlayers={game.maxPlayers}
              status={status}
              isGm={isGm}
              viewerId={viewerId}
              endDate={game.endDate}
            />
          </VStack>

          <GameDetailActions
            game={game}
            viewerId={viewerId}
            isGm={isGm}
            viewerStatus={viewerParticipant?.status ?? null}
            waitlistRank={viewerParticipant?.waitlistRank ?? null}
            waitingCount={waiting.length}
            confirmedCount={confirmed.length}
            respondedConfirmed={respondedConfirmed}
            viewerResponded={viewerResponded}
            status={status}
          />
        </VStack>
      </Container>
    </>
  );
}
