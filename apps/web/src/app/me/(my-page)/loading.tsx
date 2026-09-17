import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 할 일 카드는 있을 때만 그려지므로 뼈대에서는 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={5} className="py-[18px]">
          <div className="flex items-center gap-[13px]">
            <Skeleton className="h-[60px] w-[60px] rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-[23px] w-28" />
              <Skeleton className="mt-[3px] h-5 w-44" />
            </div>
            <Skeleton className="h-9 w-[52px] rounded-[10px]" />
          </div>

          <VStack className="gap-2.5">
            <Skeleton className="h-[22px] w-16" />
            <Skeleton className="h-[204px] w-full rounded-[14px]" />
          </VStack>

          <VStack className="gap-2.5">
            <Skeleton className="h-[22px] w-10" />
            <Skeleton className="h-[117px] w-full rounded-[14px]" />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
