import { Card, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, SkeletonField } from "@/shared/ui";

export function RulebookNewLoading() {
  return (
    <>
      <AdminHeader title="룰북 추가" trail={[{ href: "/rules", label: "룰북" }]} />
      <LoadingRegion label="룰북 추가 화면을 불러오는 중입니다">
        <VStack gap="150" className="mx-auto w-full max-w-[880px] p-200">
          <Card.Root padding="lg">
            <VStack gap="150">
              <SkeletonField label="카테고리" />
              <SkeletonField label="이름" />
              <SkeletonField label="종류" height={200} />
              <SkeletonField label="인증 정책" height={64} />
            </VStack>
          </Card.Root>
        </VStack>
      </LoadingRegion>
    </>
  );
}
