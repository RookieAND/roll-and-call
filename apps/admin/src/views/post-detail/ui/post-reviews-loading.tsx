import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  Panel,
  SkeletonEntity,
  SkeletonTable,
  SkeletonTabs,
} from "@/shared/ui";

import { AsideHeading } from "./aside-heading";
import { DetailAside } from "./detail-aside";
import { PostSummarySkeleton } from "./post-summary-skeleton";

export function PostReviewsLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={140} height={22} render={<span />} className="inline-block" />}
        sub="구인 상세"
        back={{ href: "/posts", label: "구인 목록" }}
        withAside
      />
      <HStack data-full-bleed align="stretch" className="flex-1">
        <LoadingRegion
          label="후기를 불러오는 중입니다"
          className="min-w-0 gap-150 px-center-200 py-200"
        >
          <PostSummarySkeleton
            labels={[
              ["세션 일정", "룰", "GM"],
              ["출석 확인", "후기 작성 기한"],
            ]}
          />
          <Panel>
            <SkeletonTabs items={["구인 내용", "참여자", "대기자", "후기"]} />
            <VStack className="p-150">
              <Card.Root radius={400} padding="none" className="overflow-hidden">
                <SkeletonTable
                  rows={5}
                  columns={[
                    { label: "작성자", kind: "text", width: 160 },
                    { label: "작성 시각", kind: "date", width: 120, sorted: true },
                    { label: "사진", kind: "number", width: 64, align: "end" },
                    { label: "스포일러", kind: "number", width: 80, align: "center" },
                    { label: "상태", kind: "badge", width: 96, align: "center" },
                  ]}
                />
              </Card.Root>
            </VStack>
          </Panel>
        </LoadingRegion>
        <DetailAside>
          <AsideHeading>안내</AsideHeading>
          <div className="p-150">
            <Skeleton width="100%" height={44} rounded={400} />
          </div>
          <AsideHeading>GM 정보</AsideHeading>
          <div className="p-175">
            <SkeletonEntity flat facts={["받은 후기", "받은 조치"]} columns={2} />
          </div>
        </DetailAside>
      </HStack>
    </>
  );
}
