import { Card, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

const ROW_COUNT = 5;
const CARD_COUNT = 6;
const STAT_COUNT = 4;

function range(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

export function UsersSkeleton() {
  return (
    <>
      <VStack className="divide-y divide-gray-200 desktop:hidden">
        {range(ROW_COUNT).map((index) => (
          <HStack key={index} align="center" gap="125" className="min-h-16 py-125">
            <Skeleton width={40} height={40} rounded="full" />
            <VStack gap="075" className="flex-1">
              <Skeleton width="40%" height={16} />
              <Skeleton width="70%" height={14} />
            </VStack>
          </HStack>
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
