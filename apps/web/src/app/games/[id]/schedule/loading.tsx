import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="일정 조율" />
      <Container>
        <VStack gap={5} className="pt-5 pb-4">
          <div>
            <Skeleton className="h-[22px] w-1/2" />
            <Skeleton className="mt-0.5 h-[17px] w-40" />
          </div>
          <VStack gap={3}>
            {/* 세그먼트 탭(p-1 + h-9)과 격자. 주 이동 페이저는 조율 기간을 알아야 하므로 뺀다. */}
            <Skeleton className="h-11 w-full rounded-[11px]" />
            <Skeleton className="h-[360px] w-full rounded-xl" />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
