import { Container, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

export function RulebookApplyStartSkeleton() {
  return (
    <PageShell readable appBar={<AppBar back="/me/rulebooks" title="룰북 신청" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="250" aria-busy className="pt-200 pb-250">
            <Skeleton width={180} height={28} />
            <VStack gap="150">
              {range(2).map((card) => (
                <Skeleton key={card} width="100%" height={88} rounded={500} />
              ))}
            </VStack>
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
