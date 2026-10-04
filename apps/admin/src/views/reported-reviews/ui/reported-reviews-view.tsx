import { HStack, VStack } from "@roll-and-call/ui";

import type { listReportedReviews } from "@/shared/server";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  Panel,
  REVIEW_ROUTE,
  ReviewRouteTabs,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { ReportedReviewsTable } from "./reported-reviews-table";

interface ReportedReviewsViewProps {
  reviews: Awaited<ReturnType<typeof listReportedReviews>>;
}

export function ReportedReviewsView({ reviews }: ReportedReviewsViewProps) {
  return (
    <>
      <AdminHeader title="후기" sub={`신고된 후기 ${reviews.counts.reported}건`} />
      <ReviewRouteTabs value={REVIEW_ROUTE.reported} counts={reviews.counts} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100">
          <UrlSearchInput placeholder="작성자 · 구인 제목 검색" className="w-[236px]" />
          <UrlSelect
            param="reason"
            allLabel="사유 전체"
            options={reviews.reasonOptions}
            className="w-[126px]"
          />
        </HStack>
        <Panel>
          {reviews.rows.length ? (
            <ReportedReviewsTable rows={reviews.rows} />
          ) : (
            <VStack className="h-[320px]">
              <EmptyState
                image={EMPTY_IMAGE.hosted}
                title="처리할 신고가 없습니다"
                description="새 신고가 들어오면 이곳과 홈의 처리 대기에 표시됩니다."
              />
            </VStack>
          )}
        </Panel>
      </VStack>
    </>
  );
}
