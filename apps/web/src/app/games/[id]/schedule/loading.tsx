import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="일정 조율" />
      <Container>
        <VStack gap="250" className="pt-250 pb-200">
          <div>
            <Skeleton width="50%" height={22} />
            <Skeleton width={160} height={17} className="mt-025" />
          </div>
          <VStack gap="150">
            {/* 세그먼트 탭(p-050 + h-9)과 격자. 주 이동 페이저는 조율 기간을 알아야 하므로 뺀다. */}
            <Skeleton width="100%" height={44} rounded={400} />
            <Skeleton width="100%" height={360} rounded={500} />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
