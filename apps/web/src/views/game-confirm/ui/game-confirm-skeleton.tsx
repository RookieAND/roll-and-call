import { Container, Grid, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { AppBar } from "@/shared/ui";

const CANDIDATE_COUNT = 3;

export function GameConfirmSkeleton() {
  return (
    <>
      <AppBar back="/games" title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-200">
          <Grid cols={2} gap="100">
            <Skeleton height={70} rounded={500} />
            <Skeleton height={70} rounded={500} />
          </Grid>
          <VStack gap="125">
            <Skeleton width={64} height={18} />
            <Skeleton width="100%" height={68} rounded={400} />
            <Skeleton width="100%" height={80} rounded={500} />
          </VStack>
          <VStack gap="100">
            {range(CANDIDATE_COUNT).map((index) => (
              <Skeleton key={index} width="100%" height={72} rounded={600} />
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
