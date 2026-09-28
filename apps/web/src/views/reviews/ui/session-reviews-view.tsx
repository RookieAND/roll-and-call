import { notFound } from "next/navigation";

import { SessionHeading } from "@/entities/game";
import { formatMonthDayTime } from "@/shared/lib";
import { getCurrentUser, getGameById, getGameReviews } from "@/shared/server";
import { EmptyState } from "@/shared/ui";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";

interface SessionReviewsViewProps {
  gameId: string;
}

export async function SessionReviewsView({ gameId }: SessionReviewsViewProps) {
  const [game, viewer, rows] = await Promise.all([
    getGameById(gameId),
    getCurrentUser(),
    getGameReviews(gameId),
  ]);
  if (!game) notFound();
  const when = game.confirmedAt ? `${formatMonthDayTime(game.confirmedAt)} · ` : "";

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
          viewerId={viewer?.id ?? null}
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
