import { getGameReviews } from "@roll-and-call/database/reviews";
import { Card, Text, VStack } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { PARTICIPANT_STATUS, SessionHeading } from "@/entities/game";
import { MemberTitleSheetsProvider } from "@/features/view-badge";
import { loadMemberTitleSheets } from "@/features/view-badge/server";
import { formatDateTime } from "@/shared/lib";
import { getCurrentSessionUser, getGameById, getCurrentServer } from "@/shared/server";
import { EmptyState } from "@/shared/ui";

import { REVIEW_PERSPECTIVE } from "../model/review-perspective";
import { roundReviewGroups } from "../model/round-review-groups";
import { visibleReviewGroups } from "../model/visible-review-groups";
import { FoldedReviewGroups } from "./folded-review-groups";
import { ReviewList } from "./review-list";
import { ReviewsPage } from "./reviews-page";
import { RoundReviewGroup } from "./round-review-group";

const NO_PARTICIPANT_REVIEWS = "아직 달린 후기가 없습니다";

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
  const { gmReview, gmReviews, participantReviews } = await getGameReviews({
    serverId: server.id,
    gameId,
    viewerId,
  });
  const allRows = [...gmReviews, ...participantReviews];
  const titleSheets = await loadMemberTitleSheets({
    serverId: server.id,
    userIds: allRows.map((row) => row.authorId),
    now: new Date(),
  });
  const hasReviews = gmReview || participantReviews.length > 0;
  // 다회차는 GM 후기도 회차마다 있어 참석자 후기와 같이 회차별로 묶는다.
  const roundGroups = game.roundCount > 1 ? visibleReviewGroups(roundReviewGroups(allRows)) : null;
  // 다회차는 1회차 일시 대신 총 회차 수를 적는다. 후기 개수도 GM 후기까지 센다.
  let headingSubline = "";
  if (game.roundCount > 1) headingSubline = `총 ${game.roundCount}회`;
  else if (game.confirmedAt) headingSubline = formatDateTime(game.confirmedAt);
  const renderGroup = (group: ReturnType<typeof roundReviewGroups>[number]) => (
    <RoundReviewGroup
      key={group.roundNo}
      roundNo={group.roundNo}
      startAt={group.startAt}
      rows={group.rows}
      perspective={REVIEW_PERSPECTIVE.session}
      viewerId={viewerId}
    />
  );

  return (
    <ReviewsPage title="세션 후기" back={`/games/${gameId}`}>
      <SessionHeading
        title={game.title}
        rule={`후기 ${roundGroups ? allRows.length : participantReviews.length}개`}
        subline={headingSubline}
      />
      {hasReviews ? (
        <MemberTitleSheetsProvider sheets={titleSheets}>
          {roundGroups ? (
            <VStack gap="250">
              {roundGroups.shown.map(renderGroup)}
              {roundGroups.folded.length > 0 && (
                <FoldedReviewGroups count={roundGroups.folded.length}>
                  {roundGroups.folded.map(renderGroup)}
                </FoldedReviewGroups>
              )}
            </VStack>
          ) : (
            <VStack gap="150">
              <ReviewList
                rows={[...(gmReview ? [gmReview] : []), ...participantReviews]}
                perspective={REVIEW_PERSPECTIVE.session}
                viewerId={viewerId}
                emptyText=""
              />
              {participantReviews.length === 0 && (
                <Card.Root padding="md" radius={500} background="subtle" className="text-center">
                  <Text typography="subtitle2" foreground="muted">
                    {NO_PARTICIPANT_REVIEWS}
                  </Text>
                </Card.Root>
              )}
            </VStack>
          )}
        </MemberTitleSheetsProvider>
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
