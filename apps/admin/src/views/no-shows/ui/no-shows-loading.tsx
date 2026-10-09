import { Button, HStack, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

export function NoShowsLoading() {
  return (
    <>
      <AdminHeader
        title="불참 기록"
        actions={
          <Button variant="outline" colorPalette="gray" disabled>
            불참 기록 추가
          </Button>
        }
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
              className="pl-400 text-body3"
            />
          </HStack>
          <div className="w-[140px]">
            <SkeletonSelect label="상태 전체" />
          </div>
        </HStack>
        <Panel footer={<SkeletonPager />}>
          <SkeletonTable
            columns={[
              { label: "불참 당사자", kind: "text", width: 110, fixed: true },
              { label: "세션", kind: "text", width: 200 },
              { label: "룰북", kind: "text", width: 140, fixed: true },
              { label: "일시", kind: "date", width: 192, fixed: true, sorted: true },
              { label: "처리한 사람", kind: "text", width: 140, fixed: true },
              { label: "상태", kind: "badge", width: 84, fixed: true },
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
