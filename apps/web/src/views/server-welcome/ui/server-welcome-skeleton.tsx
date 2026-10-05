import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function ServerWelcomeSkeleton() {
  return (
    <>
      <AppBar title="가입 완료" heading={false} />
      <Container size="md">
        <VStack gap="300" aria-busy className="py-300">
          <VStack gap="100">
            <Skeleton width={240} height={28} />
            <Skeleton width={200} height={18} />
            <Skeleton width={160} height={18} />
          </VStack>
          <Skeleton width="100%" height={48} rounded={400} />
        </VStack>
      </Container>
    </>
  );
}
