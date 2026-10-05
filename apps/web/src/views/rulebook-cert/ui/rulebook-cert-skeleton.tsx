import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function RulebookCertSkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks" title="신청 상세" />
      <Container size="sm">
        <VStack gap="150" aria-busy className="pt-200 pb-250">
          <VStack gap="150" className="rounded-600 border border-gray-200 p-175">
            <Skeleton width={140} height={18} />
            <Skeleton width={200} height={14} />
            <Skeleton width="100%" height={96} rounded={400} />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
