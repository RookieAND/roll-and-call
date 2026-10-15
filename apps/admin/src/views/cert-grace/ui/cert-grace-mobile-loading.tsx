import { Button, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { CERT_TABS } from "@/entities/cert";
import { AdminHeader, LoadingRegion, RouteTabs } from "@/shared/ui";

const SECTIONS = [
  { title: "현재 적용일", height: 28 },
  { title: "적용일 변경", height: 48 },
  { title: "영향 범위", height: 64 },
];

export function CertGraceMobileLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/grace" />
      <LoadingRegion label="유예 기간을 불러오는 중입니다">
        <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
          {SECTIONS.map((section) => (
            <VStack
              key={section.title}
              gap="100"
              className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
            >
              <Text typography="subtitle1">{section.title}</Text>
              <Skeleton width="100%" height={section.height} rounded={400} />
            </VStack>
          ))}
        </VStack>
        <VStack className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]">
          <Button disabled className="min-h-12 w-full">
            변경
          </Button>
        </VStack>
      </LoadingRegion>
    </>
  );
}
