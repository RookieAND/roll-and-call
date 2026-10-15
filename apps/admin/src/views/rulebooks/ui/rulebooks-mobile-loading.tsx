import { Button, TextInput, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  LoadingRegion,
  MobileActionBar,
  SkeletonListRows,
  SkeletonTabs,
} from "@/shared/ui";

export function RulebooksMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 카탈로그" />
      <SkeletonTabs items={["룰북 목록", "추가 요청", "전자책 판매처"]} />
      <LoadingRegion label="룰북 목록을 불러오는 중입니다">
        <VStack className="border-b border-gray-200 bg-surface px-200 py-150">
          <TextInput
            type="search"
            disabled
            placeholder="이름, 판본, 카테고리, 다른 이름"
            aria-label="이름, 판본, 카테고리, 다른 이름"
            className="text-body3"
          />
        </VStack>
        <SkeletonListRows />
      </LoadingRegion>
      <MobileActionBar>
        <Button size="lg" disabled>
          룰북 추가
        </Button>
      </MobileActionBar>
    </>
  );
}
