import { Button, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion, MobileActionBar } from "@/shared/ui";

import { MobileEntrySection } from "./mobile/mobile-entry-section";

const FACT_ROWS = ["처리한 운영진", "처리 시각", "대상"];

export function AuditEntryMobileLoading() {
  return (
    <>
      <AdminHeader
        title={<Skeleton width={120} height={20} render={<span />} className="inline-block" />}
        trail={[{ href: "/log", label: "활동 기록" }]}
      />
      <LoadingRegion label="조치 상세를 불러오는 중입니다">
        <VStack gap="150" className="px-150 pt-150 pb-200">
          <MobileEntrySection>
            <Skeleton width={72} height={22} rounded={200} />
            {FACT_ROWS.map((label) => (
              <VStack key={label} gap="050" className="py-100">
                <Skeleton width={72} height={12} />
                <Skeleton width="60%" height={16} />
              </VStack>
            ))}
          </MobileEntrySection>
          <MobileEntrySection title="사유">
            <Skeleton width="80%" height={16} />
          </MobileEntrySection>
        </VStack>
      </LoadingRegion>
      <MobileActionBar>
        <HStack gap="100">
          <Button variant="outline" colorPalette="gray" size="lg" disabled className="flex-1">
            대상 기록 보기
          </Button>
        </HStack>
      </MobileActionBar>
    </>
  );
}
