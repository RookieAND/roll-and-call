import { Card, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, FactRows, LoadingRegion, NextItemButton, skeletonFact } from "@/shared/ui";

import { ReviewActionsAside } from "./review-actions-aside";
import { ReviewMoreMenu } from "./review-more-menu";

export function ReviewDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={120} height={22} render={<span />} className="inline-block" />}
        trail={[
          { href: "/reviews", label: "후기" },
          { href: "/reviews", label: "전체 후기" },
        ]}
        actions={<NextItemButton />}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <LoadingRegion
          label="후기를 불러오는 중입니다"
          className="min-w-0 gap-200 px-center-200 py-200"
        >
          <Card.Root padding="none" render={<section />} className="shrink-0">
            <HStack align="center" gap="150" className="px-200 py-150">
              <Skeleton width={96} height={20} />
              <Skeleton width={160} height={14} />
              <HStack className="ml-auto">
                <ReviewMoreMenu />
              </HStack>
            </HStack>
            <Grid className="grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
              <FactRows labelWidth={72} items={["구인", "작성 시각"].map(skeletonFact)} />
              <FactRows labelWidth={72} items={["GM", "수정 시각"].map(skeletonFact)} />
            </Grid>
            <VStack gap="150" className="border-t border-(--rc-color-border-subtle) px-200 py-175">
              <Skeleton width={180} height={14} />
              <VStack gap="100">
                <Skeleton width="96%" height={14} />
                <Skeleton width="88%" height={14} />
                <Skeleton width="52%" height={14} />
              </VStack>
            </VStack>
          </Card.Root>
        </LoadingRegion>
        <ReviewActionsAside />
      </HStack>
    </>
  );
}
