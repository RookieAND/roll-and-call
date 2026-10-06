import { Container, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import {
  deriveGameStatus,
  GAME_STATUS,
  isApplicationClosed,
  isGameGm,
  isSessionEnded,
  scheduleLine,
  splitRoster,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { deriveActionView } from "../model/derive-action-view";
import type { ActionSanction } from "../model/game-action-view";
import type { ReviewStatus } from "../model/review-status";
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
  sanction: ActionSanction | null;
  review: ReviewStatus;
  now: Date;
}

export function GameDetail({ game, viewerId, sanction, review, now }: GameDetailProps) {
  const isGm = isGameGm({ gmId: game.gmId, userId: viewerId });
  const { confirmed, waiting, removed } = splitRoster(game.participants);

  const viewerParticipant = viewerId
    ? [...confirmed, ...waiting, ...removed].find((participant) => participant.userId === viewerId)
    : undefined;

  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: confirmed.length,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
    cancelledAt: game.cancelledAt,
  });
  const ended = !game.cancelledAt && isSessionEnded(game, now);
  // 마감 배지는 신청을 받는 동안(모집 중·대기 접수 중)에만 보인다.
  const accepting = status === GAME_STATUS.recruiting || status === GAME_STATUS.confirmed;
  const showDeadline = accepting && !ended && !isApplicationClosed(game, now);

  const actionView = deriveActionView({
    game,
    viewer: {
      isGm,
      status: viewerParticipant?.status ?? null,
      absent: viewerParticipant?.absent ?? false,
      absenceCancelledAt: viewerParticipant?.absenceCancelledAt ?? null,
      waitlistRank: viewerParticipant?.waitlistRank ?? null,
    },
    confirmedCount: confirmed.length,
    waitingCount: waiting.length,
    lotteryHeld: game.participants.some((participant) => !isNull(participant.drawRank)),
    sanction,
    review,
    now,
  });

  return (
    <>
      <AppBar
        back="/games"
        backHistory={false}
        title="구인 상세"
        heading={false}
        action={<ShareButton gameId={game.id} title={game.title} />}
      />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <GameDetailThumbnail url={game.thumbnailUrl} spoiler={game.thumbnailSpoiler} />

          <VStack gap="250" className="px-200 pb-100">
            <GameDetailHeader
              title={game.title}
              status={status}
              ended={ended}
              showDeadline={showDeadline}
              statusLine={scheduleLine(game, now)}
            />

            <GameInfoTable game={game} isGm={isGm} />

            {game.synopsis && <GameSynopsis synopsis={game.synopsis} />}

            <GamePreflightSection game={game} />

            <GameRecruitMethodSection game={game} now={now} />

            {game.images.length > 0 && <GameImageGallery images={game.images} />}

            <GameRosterSection
              gm={{ userId: game.gmId, ...game.gm }}
              confirmed={confirmed}
              waiting={waiting}
              maxPlayers={game.maxPlayers}
              recruitMethod={game.recruitMethod}
              drawn={!isNull(game.drawnAt)}
              viewerId={viewerId}
            />
          </VStack>

          <GameDetailActions game={game} view={actionView} />
        </VStack>
      </Container>
    </>
  );
}
