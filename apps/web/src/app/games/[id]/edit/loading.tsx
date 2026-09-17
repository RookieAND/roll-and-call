import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppBar back="/games" title="구인 수정" />
      <Container size="md" className="flex-1">
        <VStack gap={5} className="py-6">
          <Skeleton className="h-[58px] w-full rounded-xl" />
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
        <Container size="md" className="flex gap-2 py-3">
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
        </Container>
      </div>
    </div>
  );
}
