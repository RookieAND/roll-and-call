import { Button, HStack, Select, Skeleton, Text, TextInput } from "@roll-and-call/ui";
import { ChevronDown, Search } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel, SkeletonTable } from "@/shared/ui";

const ALL = "all";

export function AuditLogLoading() {
  return (
    <>
      <AdminHeader
        title="활동 기록"
        sub={<Skeleton width={40} height={12} render={<span />} className="inline-block" />}
      />
      <LoadingRegion label="활동 기록을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100" wrap>
          <HStack align="center" className="relative w-[220px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="대상 닉네임 검색"
              aria-label="대상 닉네임 검색"
              className="h-[36px] pl-400 text-body3"
            />
          </HStack>
          <div className="w-[146px]">
            <Select.Root disabled value={ALL} items={[{ label: "전체 운영진", value: ALL }]}>
              <Select.Trigger className="whitespace-nowrap" />
            </Select.Root>
          </div>
          <Button
            variant="outline"
            colorPalette="gray"
            disabled
            className="h-[36px] w-[140px] justify-between font-normal"
          >
            <Text typography="body3" truncate>
              모든 조치
            </Text>
            <ChevronDown size={14} aria-hidden />
          </Button>
          <div className="w-[128px]">
            <Select.Root disabled value={ALL} items={[{ label: "전체 기간", value: ALL }]}>
              <Select.Trigger className="whitespace-nowrap" />
            </Select.Root>
          </div>
        </HStack>
        <Panel title="최신순" className="flex-1">
          <SkeletonTable
            columns={[
              { label: "일시", kind: "date", width: "w-[120px]", sorted: true },
              { label: "운영진", kind: "text", width: "w-[96px]" },
              { label: "조치", kind: "badge", width: "w-[128px]" },
              { label: "대상", kind: "text", width: "w-[120px]" },
              { label: "세부", kind: "text", width: "w-[170px]" },
              { label: "사유", kind: "text" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
