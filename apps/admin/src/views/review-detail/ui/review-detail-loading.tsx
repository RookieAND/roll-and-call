import { Card, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  FactRows,
  LoadingRegion,
  Panel,
  SkeletonEntity,
  SkeletonItem,
} from "@/shared/ui";

import { AsideHeading } from "./aside-heading";

export function ReviewDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={120} height={22} render={<span />} className="inline-block" />}
        sub="후기 상세"
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <LoadingRegion
          label="후기를 불러오는 중입니다"
          className="min-w-0 gap-150 px-center-200 py-200"
        >
          <Card.Root padding="none" render={<section />} className="shrink-0">
            <HStack align="center" gap="100" className="px-200 py-150">
              <Skeleton width={96} height={20} />
              <Skeleton width={56} height={20} rounded="full" />
            </HStack>
            <Grid className="grid-cols-2 items-start gap-x-400 border-t border-(--rc-color-border-subtle) px-200 py-100">
              <FactRows
                labelWidth={72}
                items={[
                  {
                    label: "세션",
                    value: (
                      <Skeleton
                        width={120}
                        height={14}
                        render={<span />}
                        className="inline-block"
                      />
                    ),
                  },
                  {
                    label: "작성 시각",
                    value: (
                      <Skeleton width={96} height={14} render={<span />} className="inline-block" />
                    ),
                  },
                ]}
              />
              <FactRows
                labelWidth={72}
                items={[
                  {
                    label: "수정 시각",
                    value: (
                      <Skeleton width={96} height={14} render={<span />} className="inline-block" />
                    ),
                  },
                  {
                    label: "스포일러",
                    value: (
                      <Skeleton width={40} height={14} render={<span />} className="inline-block" />
                    ),
                  },
                ]}
              />
            </Grid>
            <VStack gap="100" className="border-t border-(--rc-color-border-subtle) px-200 py-175">
              <Skeleton width="96%" height={14} />
              <Skeleton width="88%" height={14} />
              <Skeleton width="52%" height={14} />
            </VStack>
          </Card.Root>
          <Panel title="신고">
            <VStack gap="100" className="p-150">
              <SkeletonItem />
              <SkeletonItem />
            </VStack>
          </Panel>
        </LoadingRegion>
        <VStack
          render={<aside />}
          className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[300px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
        >
          <AsideHeading>조치</AsideHeading>
          <VStack gap="075" className="p-150">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </VStack>
          <AsideHeading className="border-t">작성자</AsideHeading>
          <VStack className="p-175">
            <SkeletonEntity flat facts={["쓴 후기", "받은 조치"]} columns={2} />
          </VStack>
        </VStack>
      </HStack>
    </>
  );
}
