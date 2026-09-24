import { Button, Grid, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, FormSection, LoadingRegion, Panel, SkeletonField } from "@/shared/ui";

export function UserSanctionLoading() {
  return (
    <>
      <AdminHeader title={<Skeleton width={120} height={22} render={<span />} />} sub="유저 상세" />
      <LoadingRegion label="제재할 유저 정보를 불러오는 중입니다">
        <Grid className="mx-auto w-full max-w-[1000px] flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
          <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
            <FormSection title="1. 제재 기간">
              <Skeleton width="100%" height={40} rounded={400} />
            </FormSection>
            <FormSection title="2. 제재 사유">
              <SkeletonField label="사용자에게 보여줄 사유" height={64} />
              <SkeletonField label="운영진 메모 (사용자에게 안 보임)" height={64} />
            </FormSection>
            <FormSection title="3. 진행 중인 활동">
              <Skeleton width="100%" height={64} rounded={400} />
            </FormSection>
          </VStack>
          <Panel title="확정하면 일어나는 일" bodyClassName="px-175 py-125">
            <VStack gap="150">
              <Skeleton width="100%" height={16} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="100%" height={16} />
            </VStack>
          </Panel>
        </Grid>
        <HStack
          align="center"
          gap="125"
          className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-200 py-150"
        >
          <Text typography="body4" foreground="hint">
            확정하면 다른 운영진에게 디스코드 알림이 갑니다. 제재는 활동 기록에 남습니다.
          </Text>
          <HStack gap="100" className="ml-auto">
            <Button variant="ghost" colorPalette="gray" disabled>
              취소
            </Button>
            <Button colorPalette="danger" disabled className="min-w-[128px]">
              제재 확정
            </Button>
          </HStack>
        </HStack>
      </LoadingRegion>
    </>
  );
}
