import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

const FACT_LABELS = ["신청 룰북", "디스코드 ID", "신청 일자", "대기"];

// 신청 방식과 처리 상태를 아직 모르므로 그에 따라 달라지는 글자는 그리지 않는다.
export function CertReviewMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증 심사" trail={[{ href: "/cert", label: "심사 대기열" }]} />
      <LoadingRegion label="신청 내용을 불러오는 중입니다">
        <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
          <VStack gap="100" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
            <HStack align="center" gap="125">
              <Skeleton width={40} height={40} rounded="full" />
              <Skeleton width={120} height={20} />
            </HStack>
            {FACT_LABELS.map((label) => (
              <HStack key={label} align="center" gap="100">
                <Text typography="body4" foreground="hint" className="w-20">
                  {label}
                </Text>
                <Skeleton width={120} height={16} />
              </HStack>
            ))}
          </VStack>
          <HStack align="center" gap="100">
            <Skeleton width={96} height={22} />
            <Skeleton width={72} height={20} rounded="full" />
          </HStack>
          <VStack gap="100" className="rounded-600 border border-gray-200 bg-surface p-150">
            <Skeleton width={56} height={18} />
            <Skeleton width={112} height={14} />
            <Skeleton width="100%" height={200} rounded={200} />
            <HStack align="center" gap="100">
              <Skeleton width={16} height={16} />
              <Skeleton width="64%" height={14} />
            </HStack>
          </VStack>
        </VStack>
        <HStack
          gap="100"
          className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]"
        >
          <Button variant="outline" colorPalette="gray" disabled className="min-h-12 w-24 shrink-0">
            건너뛰기
          </Button>
          <Button colorPalette="success" disabled className="min-h-12 flex-1">
            승인
          </Button>
        </HStack>
      </LoadingRegion>
    </>
  );
}
