import { HStack, VStack } from "@roll-and-call/ui";

import { REVIEW_ACTION, ReviewActionDialog, type ReviewAction } from "@/features/moderate-review";
import { auditLogHref, REVIEW_LIST_PATH, reviewListHref, withQuery } from "@/shared/lib";
import { REVIEW_LIST_TAB, type ReviewDetail, type ReviewListTab } from "@/shared/server";
import { AdminHeader, NextItemButton } from "@/shared/ui";

import { ReviewActionsAside } from "./review-actions-aside";
import { ReviewCard } from "./review-card";
import { ReviewHiddenBanner } from "./review-hidden-banner";

interface ReviewDetailViewProps {
  review: ReviewDetail;
  tab: ReviewListTab;
  // 들어온 목록의 검색·사진·구인 칩·정렬(q, photo, game, sort, dir).
  listQuery: Record<string, string | undefined>;
  viewerId: string;
}

export function ReviewDetailView({ review, tab, listQuery, viewerId }: ReviewDetailViewProps) {
  const pathname = `/reviews/${review.id}`;
  const hiddenTab = tab === REVIEW_LIST_TAB.hidden;
  const query = { tab: hiddenTab ? tab : undefined, ...listQuery };
  const listHref = reviewListHref({ hidden: hiddenTab, query: listQuery });
  const nextHref = review.nextId ? withQuery(`/reviews/${review.nextId}`, query, {}) : undefined;
  const trail = [
    { href: withQuery(REVIEW_LIST_PATH.all, listQuery, {}), label: "후기" },
    { href: listHref, label: hiddenTab ? "숨긴 후기" : "전체 후기" },
  ];
  const availableActions: ReviewAction[] = [
    review.hidden ? REVIEW_ACTION.unhide : REVIEW_ACTION.hide,
    REVIEW_ACTION.remove,
  ];
  const actionHref = (nextAction: ReviewAction) =>
    withQuery(pathname, query, { action: nextAction });
  const logHref = auditLogHref({ targetUserId: review.author.id, targetGameId: review.game.id });

  return (
    <>
      <AdminHeader
        title={review.game.title}
        sub="후기 상세"
        trail={trail}
        actions={<NextItemButton href={nextHref} />}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <VStack gap="200" className="min-w-0 flex-1 px-center-200 py-200">
          {review.hidden ? <ReviewHiddenBanner hidden={review.hidden} held={review.held} /> : null}
          <ReviewCard review={review} logHref={logHref} />
        </VStack>
        <ReviewActionsAside review={review} actionHref={actionHref} />
      </HStack>
      <ReviewActionDialog
        review={review}
        availableActions={availableActions}
        closeHref={withQuery(pathname, query, {})}
        listHref={listHref}
        nextHref={nextHref}
        viewerId={viewerId}
      />
    </>
  );
}
