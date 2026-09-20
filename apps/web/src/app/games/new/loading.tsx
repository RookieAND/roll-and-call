import { Container, HStack, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 위저드 1단계(게임)의 셸. 진행바는 CREATE_STEPS 4단계 중 1단계까지 칠한다.
export default function Loading() {
  return (
    <VStack className="min-h-dvh">
      <AppBar
        back="/games"
        backIcon="close"
        title="구인 등록"
        action={
          <Text numeric typography="code2" foreground="hint">
            1 / 4
          </Text>
        }
      />
      <div className="h-[3px] bg-gray-100">
        <div className="h-full w-1/4 bg-primary-600" />
      </div>
      <Container size="md" className="flex-1">
        <VStack gap="250" className="py-300">
          <div>
            <Skeleton width={64} height={26} />
            <Skeleton width={224} height={20} className="mt-050" />
          </div>
          <VStack gap="100">
            <Skeleton width={64} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
          </VStack>
          <VStack gap="100">
            <Skeleton width={32} height={20} />
            <Skeleton width="100%" height={44} rounded={400} />
            <HStack gap="075">
              <Skeleton width={80} rounded="full" height={34} />
              <Skeleton width={64} rounded="full" height={34} />
              <Skeleton width={80} rounded="full" height={34} />
            </HStack>
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
        <Container size="md" className="py-150">
          <Skeleton width="100%" height={50} rounded={500} />
        </Container>
      </div>
    </VStack>
  );
}
