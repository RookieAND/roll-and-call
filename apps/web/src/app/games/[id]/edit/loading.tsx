import { Container, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 수정 위저드는 EDIT_STEPS 2단계다. 1단계에는 단계 제목 대신 신청자 안내 박스가 온다.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col">
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
          <Skeleton className="h-[70px] w-full rounded-500" />
          <VStack gap="100">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-[104px] w-full rounded-400" />
          </VStack>
        </VStack>
      </Container>
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-100 py-150">
          <Skeleton className="h-[50px] flex-1 rounded-500" />
          <Skeleton className="h-[50px] flex-1 rounded-500" />
        </Container>
      </div>
    </div>
  );
}
