"use client";

import { Grid, HStack, Skeleton, Tabs, Text, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  FactRows,
  SkeletonItem,
  SkeletonPager,
  SkeletonSelect,
  SkeletonTable,
} from "@/shared/ui";

import { USER_DETAIL_TAB } from "../model/user-detail-tab";

const skeletonFact = (label: string) => ({
  label,
  value: <Skeleton width={96} height={14} render={<span />} className="inline-block" />,
});

// 탭과 필터는 실제 모양 그대로 두되 값을 바꿀 수 없게 고정한다.
export function UserDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={96} height={22} render={<span />} />}
        sub="유저 상세"
        back={{ href: "/users", label: "유저 목록" }}
      />
      <HStack align="stretch" className="flex-1">
        <LoadingRegion label="유저 정보를 불러오는 중입니다" className="min-w-0 bg-gray-50">
          <div className="p-200 pb-150">
            <section className="rounded-600 border border-gray-200 bg-surface">
              <HStack align="center" gap="150" className="px-200 py-175">
                <Skeleton width={40} height={40} rounded="full" />
                <Skeleton width={120} height={20} />
              </HStack>
              <Grid className="grid-cols-3 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
                <FactRows labelWidth={72} items={["가입일", "디스코드 ID"].map(skeletonFact)} />
                <FactRows labelWidth={72} items={["연 세션", "참여 세션"].map(skeletonFact)} />
                <FactRows
                  labelWidth={100}
                  items={["최근 3개월 불참", "인증 룰북"].map(skeletonFact)}
                />
              </Grid>
            </section>
          </div>
          <Tabs.Root value={USER_DETAIL_TAB.activity}>
            <div className="bleed-left border-b border-gray-200 bg-surface px-200">
              <Tabs.List aria-label="유저 상세 보기" scrollable={false} className="border-b-0">
                <Tabs.Trigger value={USER_DETAIL_TAB.activity}>활동</Tabs.Trigger>
                <Tabs.Trigger value={USER_DETAIL_TAB.cert} disabled>
                  룰북 인증
                </Tabs.Trigger>
                <Tabs.Trigger value={USER_DETAIL_TAB.noShow} disabled>
                  불참 기록
                </Tabs.Trigger>
                <Tabs.Trigger value={USER_DETAIL_TAB.memo} disabled>
                  운영진 메모
                </Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
            </div>
            <Tabs.Panel value={USER_DETAIL_TAB.activity} className="p-200">
              <Panel
                title="활동"
                footer={<SkeletonPager />}
                right={
                  <div className="w-[132px] [&_[data-slot=select-trigger]]:h-[32px] [&_[data-slot=select-trigger]]:min-h-[32px]">
                    <SkeletonSelect label="전체" />
                  </div>
                }
              >
                <SkeletonTable
                  rows={6}
                  columns={[
                    { label: "일시", kind: "date", width: "w-[192px]" },
                    { label: "역할", kind: "badge", width: "w-[66px]", align: "center" },
                    { label: "세션", kind: "text" },
                    { label: "룰북", kind: "text", width: "w-[140px]" },
                    { label: "GM", kind: "text", width: "w-[100px]" },
                    { label: "", kind: "empty", width: "w-[96px]" },
                  ]}
                />
              </Panel>
            </Tabs.Panel>
          </Tabs.Root>
        </LoadingRegion>
        <VStack
          render={<aside />}
          className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[288px] shrink-0 border-l border-gray-200 bg-surface"
        >
          <Text
            typography="subtitle2"
            foreground="muted"
            render={<h2 />}
            className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
          >
            조치
          </Text>
          <VStack gap="075" className="p-150">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </VStack>
        </VStack>
      </HStack>
    </>
  );
}
