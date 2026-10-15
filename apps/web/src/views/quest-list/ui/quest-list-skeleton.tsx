import { Container, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, PageShell } from "@/shared/ui";

export function QuestListSkeleton() {
  return (
    <PageShell
      readable
      appBar={
        <AppBar
          title="튜토리얼 퀘스트"
          action={
            <Text typography="body4" foreground="hint" numeric className="px-100 desktop:hidden">
              0 / 4
            </Text>
          }
        />
      }
      panel={<Skeleton width="100%" height={172} rounded={700} />}
    >
      <Container size="sm">
        <VStack gap="150" aria-busy className="px-050 pt-200 pb-250">
          <Skeleton width="70%" height={21} />
          {range(4).map((index) => (
            <Skeleton key={index} width="100%" height={150} rounded={600} />
          ))}
        </VStack>
      </Container>
    </PageShell>
  );
}
