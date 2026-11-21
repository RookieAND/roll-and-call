import { Card, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

const CARD_COUNT = 6;
const STAT_COUNT = 4;

function range(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

export function UsersSkeleton() {
  return (
    <>
      <VStack gap="100" className="desktop:hidden">
        {range(CARD_COUNT).map((index) => (
          <Card.Root key={index} padding="none" className="overflow-hidden">
            <Skeleton rounded="none" className="aspect-[3/1] w-full" />
            <VStack gap="100" className="px-150 pt-150 pb-150">
              <HStack align="center" gap="100">
                <Skeleton width={60} height={60} rounded="full" />
                <Skeleton width="40%" height={18} />
              </HStack>
              <Skeleton width="80%" height={14} />
              <Skeleton width="60%" height={14} />
            </VStack>
          </Card.Root>
        ))}
      </VStack>
      <Grid cols={3} gap="150" className="hidden desktop:grid">
        {range(CARD_COUNT).map((index) => (
          <Card.Root key={index} padding="none" className="overflow-hidden">
            <Skeleton rounded="none" className="aspect-[3/1] w-full" />
            <VStack gap="125" className="p-200">
              <Skeleton width="50%" height={20} />
              <Skeleton width="80%" height={14} />
              <Grid cols={2} gap="075">
                {range(STAT_COUNT).map((stat) => (
                  <Skeleton key={stat} height={56} rounded={400} />
                ))}
              </Grid>
            </VStack>
          </Card.Root>
        ))}
      </Grid>
    </>
  );
}
