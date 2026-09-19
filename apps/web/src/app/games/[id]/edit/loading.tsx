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
          <Text typography="code2" foreground="hint" className="tabular-nums">
            1 / 2
          </Text>
        }
      />
      <div className="h-[3px] bg-gray-100">
        <div className="h-full w-1/2 bg-primary-600" />
      </div>
      <Container size="md" className="flex-1">
        <VStack gap={5} className="py-6">
          <Skeleton className="h-[70px] w-full rounded-xl" />
          <VStack gap={2}>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
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
        <Container size="md" className="flex gap-2 py-3">
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
        </Container>
      </div>
    </div>
  );
}
