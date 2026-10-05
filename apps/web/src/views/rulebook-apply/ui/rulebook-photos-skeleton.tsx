import { Container, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function RulebookPhotosSkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks" title="인증 신청" />
      <Container size="sm">
        <VStack gap="150" aria-busy className="pt-200 pb-250">
          <Skeleton width={160} height={20} />
          {range(3).map((index) => (
            <Skeleton key={index} width="100%" height={120} rounded={500} />
          ))}
        </VStack>
      </Container>
    </>
  );
}
