import { ONBOARDING_QUESTS } from "@roll-and-call/database/onboarding/model";
import { Container, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar, PageShell } from "@/shared/ui";

export function QuestListSkeleton() {
  return (
    <PageShell readable appBar={<AppBar title="튜토리얼 퀘스트" />}>
      <Container size="sm">
        <VStack gap="150" aria-busy className="px-050 pt-200 pb-250">
          <Skeleton width="100%" height={6} />
          <Skeleton width="70%" height={16} />
          <Skeleton width="100%" height={180} rounded={500} />
          {range(ONBOARDING_QUESTS.length).map((index) => (
            <Skeleton key={index} width="100%" height={150} rounded={600} />
          ))}
        </VStack>
      </Container>
    </PageShell>
  );
}
