import { Button, Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, MobileActionBar, RouteTabs, SkeletonField } from "@/shared/ui";

import { RULEBOOK_DETAIL_TAB } from "../model/rulebook-detail-tab";

const TAB_ITEMS = [
  { label: "기본 정보", href: "/rules" },
  { label: "본문 퀴즈", href: `/rules?tab=${RULEBOOK_DETAIL_TAB.quiz}` },
  { label: "인증 현황", href: `/rules?tab=${RULEBOOK_DETAIL_TAB.gms}` },
];

export function RulebookDetailMobileLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={140} height={20} render={<span />} />}
        trail={[{ href: "/rules", label: "룰북" }]}
      />
      <RouteTabs label="룰북 상세 화면" items={TAB_ITEMS} value="/rules" />
      <LoadingRegion label="룰북 정보를 불러오는 중입니다" className="p-150">
        <VStack gap="150" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
          <SkeletonField label="카테고리" />
          <SkeletonField label="이름" />
          <SkeletonField label="판본" />
          <SkeletonField label="다른 이름" />
          <Skeleton width="100%" height={160} rounded={400} />
        </VStack>
      </LoadingRegion>
      <MobileActionBar elevated={false}>
        <Button size="lg" disabled>
          저장
        </Button>
        <Button variant="outline" colorPalette="danger" size="lg" disabled>
          숨김 처리
        </Button>
      </MobileActionBar>
    </>
  );
}
