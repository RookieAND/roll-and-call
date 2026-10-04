import { HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  REVIEW_ROUTE,
  ReviewRouteTabs,
  SkeletonTable,
} from "@/shared/ui";

export function HiddenReviewsLoading() {
  return (
    <>
      <AdminHeader
        title="후기"
        sub={<Skeleton width={96} height={12} render={<span />} className="inline-block" />}
      />
      <ReviewRouteTabs value={REVIEW_ROUTE.hidden} />
      <LoadingRegion label="숨긴 후기를 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" className="relative w-[236px]">
          <Search
            size={14}
            aria-hidden
            className="pointer-events-none absolute left-125 text-hint"
          />
          <TextInput
            type="search"
            disabled
            placeholder="작성자 닉네임 검색"
            aria-label="작성자 닉네임 검색"
            className="pl-400 text-body3"
          />
        </HStack>
        <Panel>
          <SkeletonTable
            rows={4}
            columns={[
              { label: "작성자", kind: "text", width: 168 },
              { label: "구인", kind: "text", width: 300 },
              { label: "숨긴 사유", kind: "text", width: 150 },
              { label: "숨긴 시각", kind: "date", width: 124 },
              { label: "작성자 수정", kind: "date", width: 124, sorted: true },
              { label: "상태", kind: "badge", width: 124, align: "center" },
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
