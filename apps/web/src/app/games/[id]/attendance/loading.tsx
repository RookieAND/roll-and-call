import { Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

const ROW_COUNT = 4;

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="출석 확인" />
      <Container size="sm">
        <VStack gap="150" className="py-200">
          <HStack align="center" gap="075">
            <Skeleton width={120} height={22} className="flex-1" />
            <Skeleton width={72} height={22} rounded="full" />
            <Skeleton width={56} height={22} rounded="full" />
          </HStack>
          <Grid cols={2} gap="100">
            <Skeleton height={68} rounded={500} />
            <Skeleton height={68} rounded={500} />
          </Grid>
          <Skeleton width="100%" height={48} rounded={500} />
          <Skeleton width="100%" height={64} rounded={500} />
          <VStack gap="100">
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <HStack key={index} align="center" gap="125" className="min-h-16">
                <Skeleton width={36} height={36} rounded="full" />
                <VStack gap="050" className="flex-1">
                  <Skeleton width={80} height={14} />
                  <Skeleton width="70%" height={12} />
                </VStack>
                <Skeleton width={128} height={36} rounded={400} />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
