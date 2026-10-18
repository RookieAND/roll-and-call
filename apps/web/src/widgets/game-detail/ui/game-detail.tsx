import type { GameDetailData } from "@roll-and-call/database/games";
import { isAwaitingResult } from "@roll-and-call/database/games/model";
import { Container, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import type { ReactNode } from "react";

import {
  deriveGameStatus,
  GAME_STATUS,
  isApplicationClosed,
  isGameGm,
  isSessionEnded,
  RECRUIT_METHOD,
  scheduleLine,
  splitRoster,
} from "@/entities/game";
import { ERROR_DISPLAY } from "@/shared/api";
import { ErrorBoundary } from "@/shared/error-boundary";
import { ddayKst, formatDday } from "@/shared/lib";
import { AppBar, PageShell } from "@/shared/ui";

import { deriveActionView } from "../model/derive-action-view";
import type { ActionSanction } from "../model/game-action-view";
import type { ReviewStatus } from "../model/review-status";
import { GameActionZone } from "./game-action-zone";
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
  // 앱바 바로 아래에 붙는 줄. 체험 환경의 「체험 중」 표시가 쓴다.
  belowAppBar?: ReactNode;
}

export function GameDetail({
  game,
  viewerId,
  sanction,
  review,
  now,
  belowAppBar,
}: GameDetailProps) {
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
  const statusLine = scheduleLine(game, now);
  const deadlineBadge = showDeadline ? statusLine.deadlineShort : null;
  const sessionDays = game.confirmedAt ? ddayKst(game.confirmedAt, now) : null;
  const showSessionDday = !game.cancelledAt && !ended && !isNull(sessionDays) && sessionDays >= 0;
  const sessionBadge = showSessionDday ? formatDday(sessionDays) : null;

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

  // 모집 방식·명단·신청 막대는 모바일에서는 본문 안에, 1100px 이상에서는 우측 패널에 둔다. 같은 요소를 두 자리에 그리고 폭으로 한쪽을 숨긴다.
  const recruitMethod = <GameRecruitMethodSection game={game} now={now} />;
  const roster = (
    <GameRosterSection
      gm={{ userId: game.gmId, ...game.gm }}
      confirmed={confirmed}
      waiting={waiting}
      maxPlayers={game.maxPlayers}
      awaitingResult={isAwaitingResult(game)}
      selection={game.recruitMethod === RECRUIT_METHOD.selection}
      viewerId={viewerId}
    />
  );

  return (
    <PageShell
      appBar={
        <AppBar
          back="/games"
          backHistory={false}
          title="구인 상세"
          heading={false}
          action={<ShareButton gameId={game.id} title={game.title} />}
        />
      }
      panel={
        <VStack gap="200">
          {recruitMethod}
          {roster}
          <ErrorBoundary display={ERROR_DISPLAY.toast}>
            <GameActionZone game={game} view={actionView} />
          </ErrorBoundary>
        </VStack>
      }
    >
      {belowAppBar}
      <Container size="md" className="px-0 desktop:max-w-none">
        <VStack gap="200">
          <GameDetailThumbnail url={game.thumbnailUrl} spoiler={game.thumbnailSpoiler} />

          <VStack gap="250" className="px-200 pb-100 desktop:px-0 desktop:pb-0">
            <GameDetailHeader
              title={game.title}
              kind={game.kind}
              status={status}
              ended={ended}
              statusLine={statusLine}
            />

            <GameInfoTable
              game={game}
              isGm={isGm}
              deadlineBadge={deadlineBadge}
              sessionBadge={sessionBadge}
            />

            {game.synopsis && <GameSynopsis synopsis={game.synopsis} />}

            <GamePreflightSection game={game} />

            <div className="desktop:hidden">{recruitMethod}</div>

            {game.images.length > 0 && <GameImageGallery images={game.images} />}

            <div className="desktop:hidden">{roster}</div>
          </VStack>

          <div className="desktop:hidden">
            <GameDetailActions game={game} view={actionView} />
          </div>
        </VStack>
      </Container>
    </PageShell>
  );
}
