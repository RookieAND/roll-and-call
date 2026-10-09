import { Button, Card, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, FormSection, LoadingRegion, SkeletonField } from "@/shared/ui";

export function RulebookNewLoading() {
  return (
    <>
      <AdminHeader
        title="룰북 추가"
        trail={[{ href: "/rules", label: "룰북 카탈로그" }]}
        contentWidth
      />
      <LoadingRegion fullBleed label="룰북 추가 화면을 불러오는 중입니다">
        <VStack gap="150" className="mx-auto w-full max-w-content flex-1 p-200">
          <Card.Root padding="lg">
            <VStack gap="250">
              <FormSection
                title="1. 책 정보"
                description="같은 TRPG의 책은 한 카테고리로 묶습니다."
              >
                <VStack gap="150">
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px] gap-125">
                    <SkeletonField label="카테고리" />
                    <SkeletonField label="이름" />
                    <SkeletonField label="판본" />
                  </div>
                  <SkeletonField label="다른 이름" />
                </VStack>
              </FormSection>
              <FormSection
                title="2. 종류"
                description="종류에 따라 GM 자격과 인증 신청 조건이 정해집니다."
              >
                <Skeleton width="100%" height={200} rounded={400} />
                <SkeletonField label="포함하는 구판" />
              </FormSection>
              <FormSection title="3. 인증 정책">
                <div className="grid grid-cols-2 gap-100">
                  <Skeleton width="100%" height={64} rounded={500} />
                  <Skeleton width="100%" height={64} rounded={500} />
                </div>
              </FormSection>
              <FormSection title="4. 미니룰">
                <Skeleton width="100%" height={24} />
              </FormSection>
              <SkeletonField label="변경 사유" height={64} />
            </VStack>
          </Card.Root>
        </VStack>
        <HStack
          align="center"
          gap="125"
          className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
        >
          <Text typography="body4" foreground="hint">
            추가한 내용과 사유는 활동 기록에 남습니다.
          </Text>
          <HStack gap="100" className="ml-auto">
            <Button variant="ghost" colorPalette="gray" disabled>
              취소
            </Button>
            <Button disabled className="min-w-[104px]">
              추가
            </Button>
          </HStack>
        </HStack>
      </LoadingRegion>
    </>
  );
}
