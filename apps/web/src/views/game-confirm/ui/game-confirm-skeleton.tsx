import { Container, Grid, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

export function GameConfirmSkeleton() {
  return (
    <>
      <AppBar back="/games" title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap="200" className="pt-200 pb-200">
          <Skeleton width="100%" height={26} />
          <Grid cols={2} gap="100">
            <Skeleton height={70} rounded={500} />
            <Skeleton height={70} rounded={500} />
          </Grid>
          <VStack gap="125">
            <Skeleton width={64} height={18} />
            <Skeleton width="100%" height={68} rounded={400} />
            <Skeleton width="100%" height={40} rounded={500} />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
