import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

export function RoundScheduleSkeleton() {
  return (
    <PageShell readable appBar={<AppBar title="회차 일정" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm">
          <VStack gap="200" className="py-200">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-12 w-full" />
          </VStack>
        </Container>
      </div>
    </PageShell>
  );
}
