import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonEntity,
  SkeletonItem,
  SkeletonTabs,
} from "@/shared/ui";

import { AsideHeading } from "./aside-heading";
import { DetailAside } from "./detail-aside";
import { PostSummarySkeleton } from "./post-summary-skeleton";

export function PostDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={160} height={22} render={<span />} className="inline-block" />}
        sub="구인 상세"
        trail={[{ href: "/posts", label: "구인 목록" }]}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <LoadingRegion
          label="구인 정보를 불러오는 중입니다"
          className="min-w-0 gap-150 px-center-200 py-200"
        >
          <PostSummarySkeleton
            labels={[
              ["세션 일정", "플레이타임", "룰"],
              ["모집 마감일", "GM"],
            ]}
          />
          <Panel className="flex-1">
            <SkeletonTabs items={[null, null, null, null, null]} />
            <VStack gap="125" className="p-150">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </VStack>
          </Panel>
        </LoadingRegion>
        <DetailAside>
          <AsideHeading>조치</AsideHeading>
          <VStack gap="075" className="p-150">
            <SkeletonItem />
            <SkeletonItem />
          </VStack>
          <AsideHeading>GM 정보</AsideHeading>
          <div className="p-175">
            <SkeletonEntity
              flat
              facts={["인증 룰북", "연 구인", "받은 조치", "처리한 불참"]}
              columns={2}
            />
          </div>
        </DetailAside>
      </HStack>
    </>
  );
}
