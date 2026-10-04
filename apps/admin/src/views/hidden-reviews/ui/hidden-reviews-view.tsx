import { VStack } from "@roll-and-call/ui";

import type { listHiddenReviews } from "@/shared/server";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  Panel,
  REVIEW_ROUTE,
  ReviewRouteTabs,
  UrlSearchInput,
} from "@/shared/ui";

import { HiddenReviewsTable } from "./hidden-reviews-table";

interface HiddenReviewsViewProps {
  reviews: Awaited<ReturnType<typeof listHiddenReviews>>;
}

export function HiddenReviewsView({ reviews }: HiddenReviewsViewProps) {
  return (
    <>
      <AdminHeader title="후기" sub={`숨긴 후기 ${reviews.counts.hidden}건`} />
      <ReviewRouteTabs value={REVIEW_ROUTE.hidden} counts={reviews.counts} />
      <VStack gap="150" className="flex-1 p-200">
        <UrlSearchInput placeholder="작성자 닉네임 검색" className="w-[236px]" />
        <Panel>
          {reviews.rows.length ? (
            <HiddenReviewsTable rows={reviews.rows} />
          ) : (
            <VStack className="h-[320px]">
              <EmptyState
                image={EMPTY_IMAGE.hosted}
                title="숨긴 후기가 없습니다"
                description="운영진이 후기를 숨기면 이곳에 모입니다."
              />
            </VStack>
          )}
        </Panel>
      </VStack>
    </>
  );
}
