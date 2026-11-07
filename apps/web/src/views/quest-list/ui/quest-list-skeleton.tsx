import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Container, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, PageShell } from "@/shared/ui";

export function QuestListSkeleton() {
  return (
    <PageShell
      readable
      appBar={<AppBar title="튜토리얼 퀘스트" />}
      panel={<Skeleton width="100%" height={480} rounded={600} className="mt-250" />}
    >
      <Container size="sm">
        <VStack gap="150" aria-busy className="px-050 pt-200 pb-250">
          <VStack gap="150" className="desktop:hidden">
            <Skeleton width="100%" height={6} />
            <Skeleton width="70%" height={16} />
            <Skeleton width="100%" height={180} rounded={500} />
          </VStack>
          {range(ONBOARDING_QUESTS.length).map((index) => (
            <Skeleton key={index} width="100%" height={150} rounded={600} />
          ))}
        </VStack>
      </Container>
    </PageShell>
  );
}
