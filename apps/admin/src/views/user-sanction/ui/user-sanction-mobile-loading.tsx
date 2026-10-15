import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import {
  AdminHeader,
  FormSection,
  LoadingRegion,
  MobileActionBar,
  SkeletonField,
} from "@/shared/ui";

export function UserSanctionMobileLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={120} height={20} render={<span />} />}
        trail={[{ href: "/users", label: "유저" }]}
      />
      <LoadingRegion label="제재할 유저 정보를 불러오는 중입니다" className="p-150">
        <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
          <FormSection title="1. 제재 기간">
            <Skeleton width="100%" height={40} rounded={400} />
          </FormSection>
          <FormSection title="2. 제재 사유">
            <SkeletonField label="사용자에게 보여 줄 사유" height={32} />
            <SkeletonField label="운영진 메모 (사용자에게 안 보임)" height={64} />
          </FormSection>
          <FormSection title="3. 진행 중인 활동">
            <Skeleton width="100%" height={64} rounded={400} />
          </FormSection>
        </VStack>
      </LoadingRegion>
      <MobileActionBar>
        <Text typography="body4" foreground="hint">
          사유를 입력해야 확정할 수 있습니다
        </Text>
        <HStack gap="100">
          <Button variant="outline" size="lg" disabled className="flex-1">
            취소
          </Button>
          <Button colorPalette="danger" size="lg" disabled className="flex-1">
            제재 확정
          </Button>
        </HStack>
      </MobileActionBar>
    </>
  );
}
