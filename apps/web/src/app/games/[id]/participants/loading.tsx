import { Card, Container, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

const ROSTER_ROW_COUNT = 3;

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="참여자 관리" />
      <Container size="md">
        <VStack gap="250" className="py-200">
          <VStack gap="150">
            <HStack align="center" gap="100">
              <Skeleton height={28} className="min-w-0 flex-1" />
              <Skeleton width={56} height={21} rounded={300} />
              <Skeleton width={64} height={21} rounded={300} />
            </HStack>
            <Grid cols={2} gap="100">
              <Skeleton height={73} rounded={500} />
              <Skeleton height={73} rounded={500} />
            </Grid>
            <VStack gap="100">
              <Skeleton height={45} rounded={500} />
              <Skeleton width={256} height={17} />
            </VStack>
          </VStack>

          <VStack gap="100">
            <HStack align="baseline" gap="100">
              <Skeleton width={56} height={21} />
              <Skeleton width={40} height={21} />
            </HStack>
            <Card radius={500} background="none" padding="none" className="overflow-hidden">
              {Array.from({ length: ROSTER_ROW_COUNT }).map((_, index) => (
                <HStack
                  key={index}
                  align="center"
                  gap="150"
                  className="min-h-14 border-t border-gray-100 px-150 py-100 first:border-t-0"
                >
                  <Skeleton width={34} height={34} rounded="full" />
                  <Skeleton width={96} height={17} />
                  <span className="flex-1" />
                  <Skeleton width={32} height={32} rounded={400} />
                </HStack>
              ))}
            </Card>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
