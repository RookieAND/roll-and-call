import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 위저드 1단계(게임 정보)의 셸. 진행바는 1/3 칸까지 칠해 둔다.
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppBar title="구인 등록" />
      <div className="h-[3px] bg-gray-100">
        <div className="h-full w-1/3 bg-primary-600" />
      </div>
      <Container size="md" className="flex-1">
        <VStack gap={5} className="py-6">
          <div>
            <Skeleton className="h-[23px] w-20" />
            <Skeleton className="mt-1 h-5 w-56" />
          </div>
          <VStack gap={2}>
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-24 w-full rounded-[10px]" />
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
