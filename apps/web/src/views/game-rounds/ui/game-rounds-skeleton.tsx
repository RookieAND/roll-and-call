import { Card, Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

const ROW_COUNT = 4;

export function GameRoundsSkeleton() {
  return (
    <PageShell readable appBar={<AppBar title="회차 일정" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="200" className="py-200">
            <VStack gap="075">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-5 w-40" />
            </VStack>
            <Card.Root radius={500} padding="md">
              <VStack gap="200">
                {Array.from({ length: ROW_COUNT }, (_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))}
              </VStack>
            </Card.Root>
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
