import { Container, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

export function RulebookApplySkeleton() {
  return (
    <>
      <AppBar back="/me/rulebooks" backIcon="close" title="인증 신청" heading={false} />
      <Container size="sm">
        <VStack gap="100" aria-busy className="pt-200 pb-250">
          {range(4).map((index) => (
            <Skeleton key={index} width="100%" height={64} rounded={500} />
          ))}
        </VStack>
      </Container>
    </>
  );
}
