import { Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, MobileSection } from "@/shared/ui";

export function MakerReviewMobileLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={140} height={20} />}
        trail={[{ href: "/cert/maker", label: "자작 룰" }]}
      />
      <LoadingRegion label="신청을 불러오는 중입니다">
        <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
          <MobileSection title="신청 정보">
            <Skeleton width="60%" height={14} />
            <Skeleton width="80%" height={14} />
          </MobileSection>
          <MobileSection title="심사 자료">
            <Skeleton width="100%" height={40} rounded={400} />
          </MobileSection>
        </VStack>
      </LoadingRegion>
    </>
  );
}
