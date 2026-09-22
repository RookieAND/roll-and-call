import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap="250" className="pt-300 pb-200">
          <HStack align="center" gap="150">
            <Skeleton width={60} height={60} rounded="full" />
            <Skeleton height={20} className="flex-1" />
            <Skeleton width={104} height={36} rounded={400} />
          </HStack>
          <VStack gap="100">
            <Skeleton width={80} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={96} height={20} />
            <Skeleton width="100%" height={76} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={40} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={40} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={80} height={20} />
            <Skeleton width="100%" height={52} rounded={500} />
          </VStack>
        </VStack>
      </Container>
      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-100 py-150">
          <Skeleton height={50} rounded={500} className="flex-1" />
          <Skeleton height={50} rounded={500} className="flex-1" />
        </Container>
      </div>
    </>
  );
}
