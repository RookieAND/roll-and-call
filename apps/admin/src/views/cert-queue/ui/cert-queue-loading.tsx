import { Chip, HStack, Skeleton, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";

import { CERT_TABS } from "@/shared/lib";
import {
  AdminHeader,
  LoadingRegion,
  Panel,
  RouteTabs,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

export function CertQueueLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" sub={<Skeleton width={80} height={12} render={<span />} />} />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert" />
      <LoadingRegion label="심사 대기열을 불러오는 중입니다" className="gap-150 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" className="relative w-[220px]">
            <Search
              size={14}
              aria-hidden
              className="pointer-events-none absolute left-125 text-hint"
            />
            <TextInput
              type="search"
              disabled
              placeholder="닉네임 검색"
              aria-label="닉네임 검색"
              className="pl-400 text-body3"
            />
          </HStack>
          <div className="w-[150px]">
            <SkeletonSelect label="룰북 전체" />
          </div>
          {["전체", "재신청", "활성 GM", "적용일 전 접수"].map((label) => (
            <Chip key={label} disabled>
              {label}
            </Chip>
          ))}
        </HStack>
        <Panel footer={<SkeletonPager />}>
          <SkeletonTable
            columns={[
              { label: "닉네임", kind: "text", width: 180 },
              { label: "신청한 책", kind: "text", width: 240 },
              { label: "종류", kind: "badge", width: 130, align: "center" },
              { label: "형식", kind: "badge", width: 110, align: "center" },
              { label: "신청일", kind: "date", width: 140 },
              { label: "대기 일수", kind: "number", width: 100, align: "end", sorted: true },
              { label: "", kind: "empty", width: 44, fixed: true },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
