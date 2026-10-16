import { Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

const BADGE_WIDTHS = [84, 96, 72];
const KEYWORD_WIDTHS = [60, 72, 56];

export function MyPageSummarySkeleton() {
  return (
    <VStack gap="175" render={<section />}>
      <div className="-mx-200 -mt-225">
        <div className="aspect-[4/1] max-h-50 bg-gray-50" />
        <HStack align="end" gap="100" className="-mt-9 px-200">
          <Skeleton width={84} height={84} rounded="full" className="flex-none" />
          <span className="flex-1" />
          <Skeleton width={44} height={44} rounded={500} className="flex-none" />
        </HStack>
      </div>
      <VStack gap="025" className="min-w-0">
        <Skeleton width={80} height={22} />
        <Skeleton width={200} height={20} />
      </VStack>
      <Grid cols={2} className="-mx-200 border-y border-gray-200">
        {range(2).map((index) => (
          <VStack
            key={index}
            align="center"
            gap="050"
            className="border-gray-200 py-175 not-first:border-l"
          >
            <Skeleton width={24} height={24} />
            <Skeleton width={64} height={18} />
          </VStack>
        ))}
      </Grid>
      <VStack gap="075">
        <HStack align="center" className="min-h-7">
          <Skeleton width={52} height={18} />
        </HStack>
        <HStack wrap gap="075">
          {BADGE_WIDTHS.map((width) => (
            <Skeleton key={width} width={width} height={32} rounded="full" />
          ))}
        </HStack>
      </VStack>
      <VStack gap="100">
        <HStack align="center" className="min-h-8">
          <Skeleton width={30} height={18} />
        </HStack>
        <HStack wrap gap="075">
          {KEYWORD_WIDTHS.map((width) => (
            <Skeleton key={width} width={width} height={32} rounded="full" />
          ))}
        </HStack>
      </VStack>
      <VStack gap="075">
        <HStack align="center" justify="between" className="min-h-8">
          <Skeleton width={60} height={18} />
          <Skeleton width={40} height={32} rounded={400} />
        </HStack>
        {range(3).map((index) => (
          <Skeleton key={index} width="100%" height={44} rounded={400} />
        ))}
      </VStack>
    </VStack>
  );
}
