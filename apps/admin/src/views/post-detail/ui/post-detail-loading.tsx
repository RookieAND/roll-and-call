import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  NextItemButton,
  Panel,
  SkeletonItem,
  SkeletonTabs,
} from "@/shared/ui";

import { PostActionsAside } from "./post-actions-aside";
import { PostSummarySkeleton } from "./post-summary-skeleton";

export function PostDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={160} height={22} render={<span />} className="inline-block" />}
        sub="구인 상세"
        trail={[{ href: "/posts", label: "구인" }]}
        actions={<NextItemButton />}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <LoadingRegion
          label="구인 정보를 불러오는 중입니다"
          className="min-w-0 gap-150 px-center-200 py-200"
        >
          <PostSummarySkeleton />
          <Panel>
            <SkeletonTabs items={["구인 내용", "참여자", "대기자"]} />
            <VStack gap="125" className="p-150">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </VStack>
          </Panel>
        </LoadingRegion>
        <PostActionsAside />
      </HStack>
    </>
  );
}
