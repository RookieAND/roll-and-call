import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, Panel, RouteTabs, SkeletonField } from "@/shared/ui";

import { RULEBOOK_DETAIL_TAB } from "../model/rulebook-detail-tab";

const TAB_ITEMS = [
  { label: "기본 정보", href: "/rules" },
  { label: "본문 퀴즈", href: `/rules?tab=${RULEBOOK_DETAIL_TAB.quiz}` },
  { label: "인증 현황", href: `/rules?tab=${RULEBOOK_DETAIL_TAB.gms}` },
];

export function RulebookDetailLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={160} height={22} render={<span />} />}
        trail={[{ href: "/rules", label: "룰북" }]}
        actions={
          <Button variant="outline" colorPalette="gray" size="sm" disabled>
            활동 기록에서 보기
          </Button>
        }
      />
      <RouteTabs label="룰북 상세 화면" items={TAB_ITEMS} value="/rules" />
      <LoadingRegion fullBleed label="룰북 정보를 불러오는 중입니다">
        <div className="mx-auto grid w-full max-w-page flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
          <VStack gap="200" className="min-w-0">
            <Panel title="기본 정보" bodyClassName="p-175">
              <VStack gap="150">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px] gap-125">
                  <SkeletonField label="카테고리" />
                  <SkeletonField label="이름" />
                  <SkeletonField label="판본" />
                </div>
                <SkeletonField label="다른 이름" />
                <VStack gap="175" className="border-t border-(--rc-color-border-subtle) pt-175">
                  <SkeletonField label="종류" height={200} />
                  <SkeletonField label="포함하는 구판" className="max-w-[420px]" />
                </VStack>
              </VStack>
            </Panel>
            <Panel title="인증 정책" bodyClassName="p-175">
              <div className="grid grid-cols-2 gap-100">
                <Skeleton width="100%" height={64} rounded={500} />
                <Skeleton width="100%" height={64} rounded={500} />
              </div>
            </Panel>
          </VStack>
          <Panel
            title="같은 카테고리의 책"
            right={<Skeleton width={40} height={22} rounded="full" />}
          >
            {[0, 1, 2, 3].map((index) => (
              <VStack
                key={index}
                gap="075"
                className="border-t border-(--rc-color-border-subtle) px-175 py-125 first:border-t-0"
              >
                <Skeleton width={`${[64, 48, 72, 56][index]}%`} height={14} />
                <Skeleton width={96} height={12} />
              </VStack>
            ))}
            <VStack gap="075" className="border-t border-(--rc-color-border-subtle) px-175 py-125">
              <Text typography="subtitle2">필요한 인증</Text>
              <Skeleton width="80%" height={14} />
              <Skeleton width="64%" height={14} />
            </VStack>
          </Panel>
        </div>
        <HStack
          gap="125"
          align="end"
          className="sticky bottom-0 border-t border-gray-200 bg-surface px-page py-150"
        >
          <SkeletonField label="변경 사유" className="flex-1" />
          <Button variant="outline" colorPalette="danger" disabled>
            숨김 처리
          </Button>
          <Button disabled className="min-w-[96px]">
            저장
          </Button>
        </HStack>
      </LoadingRegion>
    </>
  );
}
