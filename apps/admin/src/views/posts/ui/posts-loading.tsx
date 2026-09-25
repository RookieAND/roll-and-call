import { Button, Chip, HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

export function PostsLoading() {
  return (
    <>
      <AdminHeader
        title="구인"
        sub={<Skeleton width={40} height={12} render={<span />} className="inline-block" />}
      />
      <LoadingRegion label="구인 목록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100" wrap>
          <HStack align="center" className="relative w-[236px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="제목 · GM 닉네임 검색"
              aria-label="제목 · GM 닉네임 검색"
              className="pl-400 text-body3"
            />
          </HStack>
          <div className="w-[126px]">
            <SkeletonSelect label="상태 전체" />
          </div>
          <div className="w-[126px]">
            <SkeletonSelect label="룰북 전체" />
          </div>
          <div className="w-[176px]">
            <SkeletonSelect label="세션 일시 · 전체" />
          </div>
          <Chip disabled>처리 안 된 신고 있음</Chip>
        </HStack>
        <Panel
          className="flex-1"
          right={
            <Button variant="outline" colorPalette="gray" size="sm" disabled>
              CSV 내보내기
            </Button>
          }
          footer={<SkeletonPager />}
        >
          <SkeletonTable
            columns={[
              { label: "제목", kind: "text" },
              { label: "GM", kind: "text", width: "w-[104px]" },
              { label: "룰북", kind: "text", width: "w-[140px]" },
              { label: "세션 일시", kind: "date", width: "w-[192px]", sorted: true },
              { label: "참여", kind: "number", width: "w-[76px]", align: "end" },
              { label: "상태", kind: "text", width: "w-[112px]", align: "center" },
              { label: "처리 안 된 신고", kind: "number", width: "w-[118px]", align: "end" },
              { label: "운영진 조치", kind: "badge", width: "w-[110px]" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
