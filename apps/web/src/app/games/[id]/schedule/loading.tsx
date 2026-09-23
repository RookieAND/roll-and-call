import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="일정 조율" />
      <Container>
        <VStack className="gap-125 pt-175 pb-200">
          <Skeleton width="100%" height={44} rounded={400} />
          <Skeleton width="100%" height={52} rounded={400} />
          <Skeleton width="100%" height={250} rounded={500} />
          <Skeleton width={180} height={14} />
        </VStack>
      </Container>
    </>
  );
}
