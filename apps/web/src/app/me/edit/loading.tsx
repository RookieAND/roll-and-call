import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="프로필 편집" />
      <Container size="md">
        <VStack gap="250" className="pt-300 pb-200">
          <div className="flex items-center gap-150">
            <Skeleton className="h-[60px] w-[60px] rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-9 w-[104px] rounded-400" />
          </div>
          <VStack gap="100">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[76px] w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-11 w-full rounded-400" />
          </VStack>
          <VStack gap="100">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[52px] w-full rounded-500" />
          </VStack>
        </VStack>
      </Container>
      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface">
        <Container size="md" className="flex gap-100 py-150">
          <Skeleton className="h-[50px] flex-1 rounded-500" />
          <Skeleton className="h-[50px] flex-1 rounded-500" />
        </Container>
      </div>
    </>
  );
}
