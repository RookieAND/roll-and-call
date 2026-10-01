import { Container, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function WriteReviewSkeleton() {
  return (
    <Container size="sm" className="px-0">
      <AppBar back="/games" backIcon="close" title="후기 쓰기" />
      <VStack gap="250" className="p-200">
        <VStack gap="050">
          <Skeleton width={96} height={17} />
          <Skeleton width="70%" height={27} />
          <Skeleton width={160} height={17} />
        </VStack>
        <Skeleton width="100%" height={72} rounded={500} />
        <VStack gap="075">
          <Skeleton width={40} height={20} />
          <Skeleton width="100%" height={130} rounded={400} />
        </VStack>
        <HStack gap="100">
          {range(3).map((index) => (
            <Skeleton key={index} width={72} height={72} rounded={400} />
          ))}
        </HStack>
      </VStack>
    </Container>
  );
}
