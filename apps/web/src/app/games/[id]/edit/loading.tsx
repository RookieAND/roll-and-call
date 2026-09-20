import { Container, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 수정 위저드는 EDIT_STEPS 2단계다. 1단계에는 단계 제목 대신 신청자 안내 박스가 온다.
export default function Loading() {
  return (
    <VStack className="min-h-dvh">
      <AppBar
        back="/games"
        backIcon="close"
        title="구인 수정"
        action={
          <Text numeric typography="code2" foreground="hint">
            1 / 2
          </Text>
        }
      />
      <div className="h-[3px] bg-gray-100">
        <div className="h-full w-1/2 bg-primary-600" />
      </div>
      <Container size="md" className="flex-1">
        <VStack gap="250" className="py-300">
          <Skeleton width="100%" height={70} rounded={500} />
          <VStack gap="100">
            <Skeleton width={64} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={32} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={96} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={64} height={20} />
            <Skeleton width="100%" height={104} rounded={400} />
          </VStack>
        </VStack>
      </Container>
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-100 py-150">
          <Skeleton height={50} rounded={500} className="flex-1" />
          <Skeleton height={50} rounded={500} className="flex-1" />
        </Container>
      </div>
    </VStack>
  );
}
