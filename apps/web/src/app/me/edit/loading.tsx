import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap={5} className="pt-6 pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[60px] w-[60px] rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-9 w-[104px] rounded-[10px]" />
          </div>
          <VStack gap={2}>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[76px] w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-11 w-full rounded-[10px]" />
          </VStack>
          <VStack gap={2}>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-xl" />
          </VStack>
        </VStack>
      </Container>
      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-2 py-3">
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
        </Container>
      </div>
    </>
  );
}
