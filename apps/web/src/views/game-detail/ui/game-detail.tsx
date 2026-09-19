import { Container, VStack } from "@trpg/ui";

import {
  deriveGameStatus,
  isGameGm,
  isSessionLocked,
  scheduleLine,
  splitRoster,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { GameDetailActions } from "./game-detail-actions";
import { GameDetailHeader } from "./game-detail-header";
import { GameDetailThumbnail } from "./game-detail-thumbnail";
import { GameImageGallery } from "./game-image-gallery";
import { GameInfoTable } from "./game-info-table";
import { GamePreflightSection } from "./game-preflight-section";
import { GameRecruitMethodSection } from "./game-recruit-method-section";
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
  const viewerResponded = viewerId !== null && respondedIds.includes(viewerId);

  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap={4}>
          <GameDetailThumbnail url={game.thumbnailUrl} spoiler={game.thumbnailSpoiler} />

          <VStack gap={5} className="px-4 pb-2">
            <GameDetailHeader title={game.title} status={status} statusLine={scheduleLine(game)} />

            <GameInfoTable game={game} isGm={isGm} />

            {game.synopsis && <GameSynopsis synopsis={game.synopsis} />}

            {game.images.length > 0 && <GameImageGallery images={game.images} isGm={isGm} />}

            <GamePreflightSection game={game} />

            <GameRecruitMethodSection game={game} />

            <GameRosterSection
              gameId={game.id}
              gm={{ userId: game.gmId, ...game.gm }}
              confirmed={confirmed}
              waiting={waiting}
              maxPlayers={game.maxPlayers}
              recruitMethod={game.recruitMethod}
              sessionConfirmed={isSessionLocked(game)}
              isGm={isGm}
              viewerId={viewerId}
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
            viewerResponded={viewerResponded}
            status={status}
          />
        </VStack>
      </Container>
    </>
  );
}
