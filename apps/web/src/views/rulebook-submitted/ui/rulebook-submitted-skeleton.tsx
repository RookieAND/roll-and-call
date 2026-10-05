import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function RulebookSubmittedSkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks" backIcon="close" title="인증 신청" heading={false} />
      <Container size="sm">
        <VStack justify="center" gap="300" aria-busy className="min-h-[70dvh] px-050 py-400">
          <VStack align="center" gap="125">
            <Skeleton width={64} height={64} rounded="full" />
            <Skeleton width={160} height={28} />
            <Skeleton width={220} height={18} />
          </VStack>
          <Skeleton width="100%" height={72} rounded={500} />
        </VStack>
      </Container>
    </>
  );
}
