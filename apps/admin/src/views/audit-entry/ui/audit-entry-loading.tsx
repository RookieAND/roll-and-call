import { Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { ArrowRight } from "lucide-react";

import { AdminHeader, FactRows, LoadingRegion } from "@/shared/ui";

import { EntrySection } from "./entry-section";

const skeletonFact = (label: string) => ({
  label,
  value: <Skeleton width={96} height={14} render={<span />} className="inline-block" />,
});

// 구획 제목과 사실 라벨은 먼저 그리고 값만 스켈레톤으로 채운다.
export function AuditEntryLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={180} height={22} render={<span />} className="inline-block" />}
        sub="조치 상세"
      />
      <LoadingRegion label="조치 상세를 불러오는 중입니다">
        <VStack gap="150" className="mx-auto w-full max-w-[960px] flex-1 p-200">
          <section className="rounded-600 border border-gray-200 bg-surface">
            <HStack align="center" gap="150" className="px-200 py-175">
              <Skeleton width={40} height={40} rounded={400} />
              <Skeleton width={160} height={20} />
            </HStack>
            <Grid className="grid-cols-3 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
              <FactRows labelWidth={80} items={["처리한 운영진", "처리 시각"].map(skeletonFact)} />
              <FactRows labelWidth={48} items={["보관"].map(skeletonFact)} />
              <FactRows labelWidth={48} items={["대상"].map(skeletonFact)} />
            </Grid>
          </section>
          <div className="divide-y divide-(--rc-color-border-subtle) rounded-600 border border-gray-200 bg-surface">
            <EntrySection title="조치 전후">
              <HStack align="center" gap="125">
                <Skeleton width="100%" height={72} rounded={400} className="flex-1" />
                <ArrowRight size={16} aria-hidden className="shrink-0 text-hint" />
                <Skeleton width="100%" height={72} rounded={400} className="flex-1" />
              </HStack>
            </EntrySection>
            <EntrySection title="사유">
              <FactRows labelWidth={120} items={["사유", "운영진 메모"].map(skeletonFact)} />
            </EntrySection>
          </div>
        </VStack>
      </LoadingRegion>
    </>
  );
}
