import { Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";

export function MyPageSummarySkeleton() {
  return (
    <VStack gap="175" render={<section />}>
      <HStack align="center" gap="175">
        <Skeleton width={60} height={60} rounded="full" />
        <VStack gap="050" className="min-w-0 flex-1">
          <Skeleton width={112} height={25} />
          <Skeleton width={176} height={20} />
        </VStack>
        <Skeleton width={52} height={36} rounded={400} className="flex-none" />
      </HStack>
      <VStack gap="075">
        <HStack align="center" className="min-h-7">
          <Skeleton width={52} height={17} />
        </HStack>
        <Grid cols={3} gap="075">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={26} rounded="full" />
          ))}
        </Grid>
      </VStack>
      <Grid cols={2} className="-mx-200 border-y border-gray-200">
        {Array.from({ length: 2 }).map((_, index) => (
          <VStack
            key={index}
            align="center"
            gap="050"
            className="border-gray-200 py-175 not-first:border-l"
          >
            <Skeleton width={24} height={27} />
            <Skeleton width={72} height={17} />
          </VStack>
        ))}
      </Grid>
      <VStack gap="100">
        <Skeleton width={40} height={17} />
        <HStack gap="075">
          <Skeleton width={80} height={30} rounded="full" />
          <Skeleton width={64} height={30} rounded="full" />
        </HStack>
      </VStack>
      <VStack gap="100">
        <Skeleton width={80} height={17} />
        <Skeleton width="100%" height={52} rounded={500} />
      </VStack>
    </VStack>
  );
}
