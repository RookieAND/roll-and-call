import { Button, HStack, Skeleton, Text, TextInput } from "@roll-and-call/ui";
import { ChevronDown, Search } from "lucide-react";

import { AUDIT_RETENTION_DAYS, EXPIRING_AUDIT_ACTIONS } from "@/shared/server";
import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

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
              className="pl-400 text-body3"
            />
          </HStack>
          <div className="w-[146px]">
            <SkeletonSelect label="전체 운영진" />
          </div>
          <Button
            variant="outline"
            colorPalette="gray"
            disabled
            className="h-[44px] w-[140px] justify-between font-normal"
          >
            <Text typography="body3" truncate>
              모든 조치
            </Text>
            <ChevronDown size={14} aria-hidden />
          </Button>
          <div className="w-[128px]">
            <SkeletonSelect label="최근 7일" />
          </div>
        </HStack>
        <Panel
          description={`${EXPIRING_AUDIT_ACTIONS.join(", ")} 기록은 ${AUDIT_RETENTION_DAYS}일이 지나면 삭제되고, 나머지는 계속 보관합니다.`}
          right={
            <Button variant="outline" colorPalette="gray" size="sm" disabled>
              CSV 내보내기
            </Button>
          }
          footer={<SkeletonPager />}
        >
          <SkeletonTable
            columns={[
              { label: "일시", kind: "date", width: 128, sorted: true },
              { label: "조치", kind: "badge", width: 124 },
              { label: "대상", kind: "text", width: 220 },
              { label: "사유", kind: "text", width: 240 },
              { label: "운영진", kind: "text", width: 96 },
              { label: "보관", kind: "text", width: 88, align: "center" },
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
