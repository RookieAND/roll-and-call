import { notFound } from "next/navigation";

import { PARTICIPANT_STATUS, SessionHeading } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import {
  getCurrentSessionUser,
  getGameById,
  getGameReviews,
  getCurrentServer,
} from "@/shared/server";
import { EmptyState } from "@/shared/ui";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";

interface SessionReviewsViewProps {
  gameId: string;
}

export async function SessionReviewsView({ gameId }: SessionReviewsViewProps) {
  const server = await getCurrentServer();
  const [game, viewer] = await Promise.all([
    getGameById(server.id, gameId),
    getCurrentSessionUser(),
  ]);
  if (!game) notFound();
  const viewerId = viewer?.id ?? null;
  const takesPart =
    game.gmId === viewerId ||
    game.participants.some(
      (participant) =>
        participant.userId === viewerId && participant.status === PARTICIPANT_STATUS.confirmed,
    );
  if (game.hiddenAt && !takesPart) {
    return (
      <ReviewsPage title="세션 후기" back={`/games/${gameId}`}>
        <EmptyState
          title="운영진이 숨긴 구인입니다"
          className="min-h-[60dvh] justify-center border-0"
        />
      </ReviewsPage>
    );
  }
  const rows = await getGameReviews({ serverId: server.id, gameId, viewerId });
  const when = game.confirmedAt ? `${formatDateTime(game.confirmedAt)} · ` : "";

  return (
    <ReviewsPage title="세션 후기" back={`/games/${gameId}`}>
      <SessionHeading
        title={game.title}
        rule={game.rule}
        subline={`${when}후기 ${rows.length}개`}
      />
      {rows.length ? (
        <ReviewList
          rows={rows}
          perspective={REVIEW_PERSPECTIVE.session}
          viewerId={viewerId}
          emptyText="아직 달린 후기가 없습니다"
        />
      ) : (
        <EmptyState
          image="/empty-states/empty-party.png"
          title="아직 달린 후기가 없습니다"
          description="참여자가 후기를 남기면 여기에 모입니다."
          className="min-h-[60dvh] justify-center border-0"
        />
      )}
    </ReviewsPage>
  );
}
