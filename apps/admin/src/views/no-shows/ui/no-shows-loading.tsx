import { HStack, Skeleton, Text, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel, SkeletonSelect, SkeletonTable } from "@/shared/ui";

export function NoShowsLoading() {
  return (
    <>
      <AdminHeader
        title="불참 기록"
        sub={<Skeleton width={40} height={12} render={<span />} className="inline-block" />}
      />
      <LoadingRegion label="불참 기록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" className="relative w-[240px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="닉네임 · 세션 검색"
              aria-label="닉네임 · 세션 검색"
              className="h-[36px] pl-400 text-body3"
            />
          </HStack>
          <div className="w-[150px]">
            <SkeletonSelect label="처리 시점 전체" />
          </div>
          <div className="w-[124px]">
            <SkeletonSelect label="상태 전체" />
          </div>
        </HStack>
        <Panel
          title="최신순"
          right={
            <Text typography="body4" foreground="hint">
              행을 누르면 불참 취소 창이 열립니다
            </Text>
          }
          className="flex-1"
        >
          <SkeletonTable
            columns={[
              { label: "불참 당사자", kind: "text", width: "w-[110px]" },
              { label: "세션", kind: "text" },
              { label: "룰북", kind: "text", width: "w-[140px]" },
              { label: "일시", kind: "date", width: "w-[142px]" },
              { label: "처리한 GM", kind: "text", width: "w-[100px]" },
              { label: "처리 시점", kind: "text", width: "w-[86px]" },
              { label: "상태", kind: "badge", width: "w-[84px]" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
