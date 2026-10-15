import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { AdminHeader, LoadingRegion } from "@/shared/ui";

const SECTIONS = [
  {
    title: "1. 인증할 룰북",
    description:
      "사진 심사 없이 운영진의 판단으로 룰북 인증을 부여합니다. 여러 권을 한 번에 고를 수 있습니다.",
    height: 48,
  },
  { title: "2. 인증할 유저", description: "여러 명을 한 번에 고를 수 있습니다.", height: 160 },
  { title: "3. 부여 사유", description: undefined, height: 64 },
];

// 섹션 제목과 설명은 그대로 보이고 입력 자리만 스켈레톤이다.
export function CertGrantMobileLoading() {
  return (
    <>
      <AdminHeader title="인증 부여" trail={[{ href: "/cert/manage", label: "룰북 인증" }]} />
      <LoadingRegion label="인증 부여 화면을 불러오는 중입니다">
        <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
          {SECTIONS.map((section) => (
            <VStack
              key={section.title}
              gap="125"
              className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
            >
              <VStack gap="025">
                <Text typography="heading3">{section.title}</Text>
                {section.description ? (
                  <Text typography="body4" foreground="muted" className="break-keep">
                    {section.description}
                  </Text>
                ) : null}
              </VStack>
              <Skeleton width="100%" height={section.height} rounded={400} />
            </VStack>
          ))}
        </VStack>
        <HStack
          gap="100"
          className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]"
        >
          <Button variant="outline" colorPalette="gray" disabled className="min-h-12 flex-1">
            취소
          </Button>
          <Button disabled className="min-h-12 flex-1">
            인증 확정
          </Button>
        </HStack>
      </LoadingRegion>
    </>
  );
}
