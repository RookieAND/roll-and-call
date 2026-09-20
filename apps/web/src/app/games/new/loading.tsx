import { Container, Skeleton, Text, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 위저드 1단계(게임)의 셸. 진행바는 CREATE_STEPS 4단계 중 1단계까지 칠한다.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col">
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
        <VStack gap={5} className="py-6">
          <div>
            <Skeleton className="h-[26px] w-16" />
            <Skeleton className="mt-1 h-5 w-56" />
          </div>
          <VStack gap={2}>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8.5 w-20 rounded-full" />
              <Skeleton className="h-8.5 w-16 rounded-full" />
              <Skeleton className="h-8.5 w-20 rounded-full" />
            </div>
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-[104px] w-full rounded-[10px]" />
          </VStack>
        </VStack>
      </Container>
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="py-3">
          <Skeleton className="h-[50px] w-full rounded-xl" />
        </Container>
      </div>
    </div>
  );
}
