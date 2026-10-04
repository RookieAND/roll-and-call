import { HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel, SkeletonSelect, SkeletonTable } from "@/shared/ui";

import { ReviewTabs } from "./review-tabs";

// 전체 후기·숨긴 후기 두 탭이 같이 쓴다.
export function ReviewListLoading() {
  return (
    <>
      <AdminHeader
        title="후기"
        sub={<Skeleton width={96} height={12} render={<span />} className="inline-block" />}
      />
      <ReviewTabs />
      <LoadingRegion label="후기를 불러오는 중입니다" className="gap-150 p-200">
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
          <div className="w-[150px]">
            <SkeletonSelect label="사진 전체" />
          </div>
        </HStack>
        <Panel>
          <SkeletonTable
            rows={5}
            columns={[
              { label: "작성 시각", kind: "date", width: 168, fixed: true, sorted: true },
              { label: "작성자", kind: "text", width: 128, fixed: true },
              { label: "구인", kind: "text", width: 132, fixed: true },
              { label: "GM", kind: "text", width: 96, fixed: true },
              { label: "본문", kind: "text", width: 240 },
              { label: "사진", kind: "number", width: 64, fixed: true, align: "end" },
              { label: "상태", kind: "badge", width: 168, fixed: true },
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
