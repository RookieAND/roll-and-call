import { HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonEntity,
  SkeletonItem,
  SkeletonTabs,
} from "@/shared/ui";

export function PostDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={160} height={22} render={<span />} className="inline-block" />}
        sub="구인 상세"
        back={{ href: "/posts", label: "구인 목록" }}
      />
      <HStack align="stretch" className="flex-1">
        <LoadingRegion label="구인 정보를 불러오는 중입니다" className="min-w-0 gap-150 p-200">
          <SkeletonEntity
            lead="thumbnail"
            facts={["세션 일시", "참여 인원", "대기 인원", "모집 방식", "모집 마감"]}
            columns={5}
            actions={<Skeleton width={32} height={32} rounded={400} />}
          />
          <Panel className="flex-1">
            <SkeletonTabs items={[null, null, null, null]} />
            <VStack gap="125" className="p-150">
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </VStack>
          </Panel>
        </LoadingRegion>
        <VStack
          render={<aside />}
          className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[300px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
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
          </VStack>
          <Text
            typography="subtitle2"
            foreground="muted"
            render={<h2 />}
            className="border-y border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
          >
            GM 정보
          </Text>
          <div className="p-175">
            <SkeletonEntity
              flat
              facts={["인증 룰북", "연 구인", "받은 조치", "처리한 불참"]}
              columns={2}
            />
          </div>
        </VStack>
      </HStack>
    </>
  );
}
