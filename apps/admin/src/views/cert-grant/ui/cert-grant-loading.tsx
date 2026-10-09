import { Button, Grid, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, FormSection, LoadingRegion, Panel, SkeletonField } from "@/shared/ui";

const OUTCOME_LABELS = ["인증을 부여할 룰북", "인증을 받는 유저", "승인으로 처리되는 심사"];

export function CertGrantLoading() {
  return (
    <>
      <AdminHeader
        title="인증 부여"
        trail={[{ href: "/cert/manage", label: "룰북 인증" }]}
        contentWidth={1000}
      />
      <LoadingRegion fullBleed label="인증 부여 화면을 불러오는 중입니다">
        <Grid className="mx-auto w-full max-w-[1000px] flex-1 grid-cols-[minmax(0,1fr)_320px] items-start gap-200 p-200">
          <VStack gap="250" className="rounded-600 border border-gray-200 bg-surface p-250">
            <FormSection
              title="1. 인증할 룰북"
              description="사진 심사 없이 운영진의 판단으로 룰북 인증을 부여합니다. 한 번에 한 권만 고를 수 있습니다."
            >
              <Skeleton width="100%" height={40} rounded={400} />
            </FormSection>
            <FormSection title="2. 인증할 유저" description="여러 명을 한 번에 고를 수 있습니다.">
              <Skeleton width="100%" height={160} rounded={400} />
            </FormSection>
            <FormSection title="3. 부여 사유">
              <SkeletonField label="부여 사유 (사용자에게 안 보임)" height={64} />
            </FormSection>
          </VStack>
          <Panel title="확정하면 일어나는 일" bodyClassName="px-175 pt-050 pb-125">
            <VStack>
              {OUTCOME_LABELS.map((label) => (
                <HStack
                  key={label}
                  align="center"
                  gap="150"
                  className="border-t border-(--rc-color-border-subtle) py-100 first:border-t-0"
                >
                  <Text typography="body4" foreground="muted" className="flex-1">
                    {label}
                  </Text>
                  <Skeleton width={32} height={16} />
                </HStack>
              ))}
            </VStack>
          </Panel>
        </Grid>
        <HStack
          align="center"
          gap="125"
          className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
        >
          <Text typography="body4" foreground="hint">
            처리 내역은 활동 기록에 남습니다.
          </Text>
          <HStack gap="100" className="ml-auto">
            <Button variant="ghost" colorPalette="gray" disabled>
              취소
            </Button>
            <Button disabled className="min-w-[128px]">
              인증 확정
            </Button>
          </HStack>
        </HStack>
      </LoadingRegion>
    </>
  );
}
