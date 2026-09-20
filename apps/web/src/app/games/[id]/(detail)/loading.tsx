import { Card, Container, HStack, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 높이는 GameDetail의 실제 줄 높이를 따른다. 한쪽만 바꾸면 로딩 후 레이아웃이 튄다.
const INFO_ROWS = ["w-24", "w-28", "w-32", "w-32"];

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <Skeleton width="100%" height={168} rounded="none" />

          <VStack gap="250" className="px-200 pb-100">
            <div>
              <HStack align="start" justify="between" gap="100">
                <Skeleton width="66.667%" height={32} />
                <Skeleton width={56} height={21} rounded={300} className="mt-025" />
              </HStack>
              <Skeleton width={176} height={20} className="mt-050" />
            </div>

            <Card radius={600} background="none" padding="none" className="overflow-hidden">
              {INFO_ROWS.map((width) => (
                <HStack
                  key={width}
                  align="center"
                  gap="150"
                  className="min-h-12 border-b border-gray-100 px-200 py-100 last:border-b-0"
                >
                  <Skeleton width={48} height={20} className="shrink-0" />
                  <Skeleton height={20} className={width} />
                </HStack>
              ))}
            </Card>

            <VStack gap="100">
              <Skeleton width={64} height={22} />
              <Skeleton width="100%" height={20} />
              <Skeleton height={20} width="80%" />
            </VStack>

            <VStack gap="100">
              <Skeleton width={80} height={22} />
              <Skeleton width="100%" height={74} rounded={500} />
            </VStack>

            <VStack className="gap-125">
              <HStack align="center" gap="100">
                <Skeleton width={64} height={22} />
                <Skeleton width={40} height={20} />
                <span className="flex-1" />
                <Skeleton width={64} height={32} />
              </HStack>
              <Skeleton width="100%" height={6} />
              <Skeleton width={128} height={28} rounded="full" />
            </VStack>
          </VStack>

          <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-200 pt-175 pb-200">
            <Skeleton width="100%" height={50} rounded={500} />
          </div>
        </VStack>
      </Container>
    </>
  );
}
