import { Container, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function QuestListSkeleton() {
  return (
    <>
      <AppBar title="튜토리얼 퀘스트" />
      <Container size="sm">
        <VStack gap="150" aria-busy className="px-050 pt-200 pb-250">
          <Skeleton width="70%" height={18} />
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} width="100%" height={124} rounded={600} />
          ))}
        </VStack>
      </Container>
    </>
  );
}
