import { Container, VStack } from "@roll-and-call/ui";

import { deriveGameStatus, isGameGm, scheduleLine, splitRoster } from "@/entities/game";
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
import { ShareButton } from "./share-button";

interface GameDetailProps {
  game: GameDetailData;
  viewerId: string | null;
}

export function GameDetail({ game, viewerId }: GameDetailProps) {
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

  return (
    <>
      <AppBar back="/games" title="구인 상세" action={<ShareButton gameId={game.id} />} />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <GameDetailThumbnail url={game.thumbnailUrl} spoiler={game.thumbnailSpoiler} />

          <VStack gap="250" className="px-200 pb-100">
            <GameDetailHeader title={game.title} status={status} statusLine={scheduleLine(game)} />

            <GameInfoTable game={game} isGm={isGm} />

            {game.synopsis && <GameSynopsis synopsis={game.synopsis} />}

            <GamePreflightSection game={game} />

            <GameRecruitMethodSection game={game} />

            {game.images.length > 0 && <GameImageGallery images={game.images} />}

            <GameRosterSection
              gm={{ userId: game.gmId, ...game.gm }}
              confirmed={confirmed}
              waiting={waiting}
              maxPlayers={game.maxPlayers}
              recruitMethod={game.recruitMethod}
              drawn={game.drawnAt !== null}
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
            status={status}
          />
        </VStack>
      </Container>
    </>
  );
}
