import { Chip, HStack, Skeleton, Text, TextInput } from "@roll-and-call/ui";
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
          <Chip disabled>재신청만</Chip>
        </HStack>
        <Panel
          title="심사 대기열"
          footer={<SkeletonPager />}
          right={
            <Text typography="body4" foreground="hint">
              오래 기다린 순
            </Text>
          }
          className="flex-1"
        >
          <SkeletonTable
            columns={[
              { label: "닉네임", kind: "text", width: "w-[180px]" },
              { label: "룰북", kind: "text", width: "w-[200px]" },
              { label: "신청일", kind: "date", width: "w-[136px]" },
              { label: "대기 일수", kind: "number", width: "w-[90px]", align: "center" },
              { label: "신청 구분", kind: "badge", width: "w-[100px]", align: "center" },
              { label: "이전 반려", kind: "number", width: "w-[90px]", align: "center" },
              { label: "", kind: "empty" },
              { label: "", kind: "empty", width: "w-[44px]" },
            ]}
          />
        </Panel>
      </LoadingRegion>
    </>
  );
}
