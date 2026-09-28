import { HStack, VStack } from "@roll-and-call/ui";

import { REVIEW_ACTION, ReviewActionDialog, type ReviewAction } from "@/features/moderate-review";
import { withQuery } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

import { ReviewActionsAside } from "./review-actions-aside";
import { ReviewCard } from "./review-card";
import { ReviewHiddenBanner } from "./review-hidden-banner";
import { ReviewReportsPanel } from "./review-reports-panel";

interface ReviewDetailViewProps {
  review: ReviewDetail;
  action: string | undefined;
  from: string | undefined;
}

const FROM_REPORTS = "reports";

export function ReviewDetailView({ review, action, from }: ReviewDetailViewProps) {
  const pathname = `/posts/reviews/${review.id}`;
  const fromReports = from === FROM_REPORTS;
  const query = { from: fromReports ? FROM_REPORTS : undefined };
  const availableActions: ReviewAction[] = [
    review.hidden ? REVIEW_ACTION.unhide : REVIEW_ACTION.hide,
    REVIEW_ACTION.remove,
    ...(review.reports.length ? [REVIEW_ACTION.dismiss] : []),
  ];
  const openAction = availableActions.find((candidate) => candidate === action) ?? null;
  const actionHref = (nextAction: ReviewAction) =>
    withQuery(pathname, query, { action: nextAction });
  const logHref = `/log?target=${encodeURIComponent(`${review.author.nickname}의 후기`)}`;
  const back = fromReports
    ? { href: "/posts/reviews", label: "신고된 후기" }
    : { href: `/posts/${review.session.id}?tab=reviews`, label: "구인 상세" };
  const hideLink = review.hidden
    ? { label: "숨김 해제", href: actionHref(REVIEW_ACTION.unhide) }
    : { label: "숨김", href: actionHref(REVIEW_ACTION.hide) };

  return (
    <>
      <AdminHeader
        title={`${review.author.nickname}의 후기`}
        sub="후기 상세"
        back={back}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <VStack gap="150" className="min-w-0 flex-1 px-center-200 py-200">
          {review.hidden ? <ReviewHiddenBanner hidden={review.hidden} logHref={logHref} /> : null}
          <ReviewCard
            review={review}
            logHref={logHref}
            hideLink={hideLink}
            removeHref={actionHref(REVIEW_ACTION.remove)}
          />
          {review.reports.length ? <ReviewReportsPanel review={review} /> : null}
        </VStack>
        <ReviewActionsAside review={review} actionHref={actionHref} />
      </HStack>
      <ReviewActionDialog
        review={review}
        action={openAction}
        fromReports={fromReports}
        closeHref={withQuery(pathname, query, {})}
        hideHref={actionHref(REVIEW_ACTION.hide)}
      />
    </>
  );
}
