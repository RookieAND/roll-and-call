import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  FormSection,
  LoadingRegion,
  MobileActionBar,
  SkeletonField,
} from "@/shared/ui";

export function RulebookNewMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 추가" trail={[{ href: "/rules", label: "룰북 카탈로그" }]} />
      <LoadingRegion label="룰북 추가 화면을 불러오는 중입니다" className="p-150">
        <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
          <FormSection title="1. 책 정보" description="같은 TRPG의 책은 한 카테고리로 묶습니다.">
            <VStack gap="150">
              <SkeletonField label="카테고리" />
              <SkeletonField label="이름" />
              <SkeletonField label="판본" />
              <SkeletonField label="다른 이름" />
            </VStack>
          </FormSection>
          <FormSection
            title="2. 종류"
            description="종류에 따라 GM 자격과 인증 신청 조건이 정해집니다."
          >
            <Skeleton width="100%" height={200} rounded={400} />
          </FormSection>
          <FormSection title="3. 인증 정책">
            <Skeleton width="100%" height={120} rounded={400} />
          </FormSection>
          <SkeletonField label="변경 사유" height={64} />
        </VStack>
      </LoadingRegion>
      <MobileActionBar>
        <Text typography="body4" foreground="hint">
          추가한 내용과 사유는 활동 기록에 남습니다.
        </Text>
        <HStack gap="100">
          <Button variant="outline" size="lg" disabled className="flex-1">
            취소
          </Button>
          <Button size="lg" disabled className="flex-1">
            추가
          </Button>
        </HStack>
      </MobileActionBar>
    </>
  );
}
