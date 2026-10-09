import { Container, FloatingBar, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

// 높이는 GameDetail의 실제 줄 높이를 따른다. 한쪽만 바꾸면 로딩 후 레이아웃이 튄다.
export function GameDetailSkeleton() {
  return (
    <>
      <AppBar
        back="/games"
        backHistory={false}
        title="구인 상세"
        heading={false}
        action={<Skeleton width={36} height={36} rounded="full" />}
      />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <Skeleton width="100%" height={168} rounded="none" />

          <VStack gap="250" className="px-200 pb-100" aria-busy>
            <VStack gap="100">
              <HStack align="start" gap="100">
                <Skeleton height={32} className="min-w-0 flex-1" />
                <Skeleton width={48} height={24} rounded={300} />
              </HStack>
              <Skeleton width={140} height={18} />
            </VStack>
            <Skeleton width="100%" height={200} rounded={500} />
            <VStack gap="075">
              <Skeleton width={56} height={20} />
              <Skeleton width="100%" height={20} />
              <Skeleton width="80%" height={20} />
            </VStack>
            <Skeleton width="100%" height={96} rounded={500} />
            <VStack gap="100">
              <Skeleton width={56} height={20} />
              <Skeleton width="100%" height={56} rounded={500} />
            </VStack>
          </VStack>

          <FloatingBar.Root>
            <FloatingBar.Content aria-busy>
              <Skeleton width="100%" height={48} rounded={500} />
            </FloatingBar.Content>
            <FloatingBar.Spacer />
          </FloatingBar.Root>
        </VStack>
      </Container>
    </>
  );
}
