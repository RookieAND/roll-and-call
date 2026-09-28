import { HStack, Skeleton, TextInput, VStack } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  POST_ROUTE,
  PostRouteTabs,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

export function ReportedReviewsLoading() {
  return (
    <>
      <AdminHeader
        title="구인"
        sub={<Skeleton width={96} height={12} render={<span />} className="inline-block" />}
      />
      <PostRouteTabs value={POST_ROUTE.reportedReviews} />
      <LoadingRegion label="신고된 후기를 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" className="relative w-[236px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="작성자 · 구인 제목 검색"
              aria-label="작성자 · 구인 제목 검색"
              className="pl-400 text-body3"
            />
          </HStack>
          <VStack className="w-[150px]">
            <SkeletonSelect label="사유 전체" />
          </VStack>
        </HStack>
        <Panel>
          <SkeletonTable
            rows={5}
            columns={[
              { label: "작성자", kind: "text", width: 168 },
              { label: "구인", kind: "text", width: 360 },
              { label: "신고", kind: "number", width: 64, align: "end" },
              { label: "가장 많은 사유", kind: "badge", width: 150 },
              { label: "가장 오래된 신고", kind: "date", width: 132 },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
