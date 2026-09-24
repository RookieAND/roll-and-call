import { HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { ArrowRight } from "lucide-react";

import { AdminHeader, LoadingRegion, Panel, SkeletonFacts, SkeletonItem } from "@/shared/ui";

export function AuditEntryLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={180} height={22} render={<span />} className="inline-block" />}
        sub={<Skeleton width={88} height={12} render={<span />} className="inline-block" />}
        back={{ href: "/log", label: "활동 기록" }}
      />
      <LoadingRegion label="조치 상세를 불러오는 중입니다" className="gap-150 p-200">
        <Panel title="조치 전후" bodyClassName="p-175">
          <HStack align="center" gap="125">
            <Skeleton width="100%" height={64} rounded={400} className="flex-1" />
            <ArrowRight size={16} aria-hidden className="shrink-0 text-hint" />
            <Skeleton width="100%" height={64} rounded={400} className="flex-1" />
          </HStack>
        </Panel>
        <Panel title="사유와 메모" bodyClassName="p-150">
          <VStack gap="100">
            <SkeletonItem lines={1} />
            <SkeletonItem lines={3} />
          </VStack>
        </Panel>
        <Panel title="함께 처리된 항목" bodyClassName="p-150">
          <VStack gap="100">
            <SkeletonItem />
            <SkeletonItem lines={1} />
          </VStack>
        </Panel>
        <Panel title="조치 정보" bodyClassName="p-150">
          <SkeletonFacts labels={["조치", "대상", "처리한 운영진", "처리 시각"]} />
        </Panel>
      </LoadingRegion>
    </>
  );
}
