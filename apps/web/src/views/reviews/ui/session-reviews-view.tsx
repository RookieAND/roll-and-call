import { Text, VStack } from "@roll-and-call/ui";
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

const NO_PARTICIPANT_REVIEWS = "아직 달린 참석자 후기가 없습니다";

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
  const { gmReview, participantReviews } = await getGameReviews({
    serverId: server.id,
    gameId,
    viewerId,
  });
  const when = game.confirmedAt ? `${formatDateTime(game.confirmedAt)} · ` : "";
  const hasReviews = gmReview || participantReviews.length > 0;

  return (
    <ReviewsPage title="세션 후기" back={`/games/${gameId}`}>
      <SessionHeading
        title={game.title}
        rule={game.rule}
        subline={`${when}후기 ${participantReviews.length}개`}
      />
      {hasReviews ? (
        <VStack gap="150">
          {gmReview && (
            <ReviewList
              rows={[gmReview]}
              perspective={REVIEW_PERSPECTIVE.session}
              viewerId={viewerId}
              emptyText=""
            />
          )}
          {participantReviews.length > 0 ? (
            <ReviewList
              rows={participantReviews}
              perspective={REVIEW_PERSPECTIVE.session}
              viewerId={viewerId}
              emptyText=""
            />
          ) : (
            <Text
              typography="subtitle2"
              foreground="muted"
              className="rounded-500 bg-gray-50 px-150 py-300 text-center"
            >
              {NO_PARTICIPANT_REVIEWS}
            </Text>
          )}
        </VStack>
      ) : (
        <EmptyState
          image="empty-review"
          title="아직 달린 후기가 없습니다"
          description="참여자가 후기를 남기면 여기에 모입니다."
          className="min-h-[60dvh] justify-center border-0"
        />
      )}
    </ReviewsPage>
  );
}
