import { Card, Grid, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { DexLadderSkeleton } from "./dex-ladder-skeleton";
import { DexNextCardSkeleton } from "./dex-next-card-skeleton";
import { DexSkeletonTitle } from "./dex-skeleton-title";

// 내 업적 화면 모양: 받은 업적 수, 대표 뱃지, 탭, 총 참여 사다리, 룰별 목록, 다양한 룰 격자, 후기, 이달의 카드.
export function DexSkeleton() {
  return (
    <VStack aria-busy className="pb-300">
      <HStack align="baseline" gap="100" className="border-b-8 border-gray-50 p-200">
        <Skeleton width={64} height={16} className="flex-1" />
        <Skeleton width={48} height={26} />
      </HStack>
      <VStack gap="150" className="border-b-8 border-gray-50 p-200">
        <HStack align="center" gap="150">
          <VStack gap="050" className="min-w-0 flex-1">
            <Skeleton width={72} height={18} />
            <Skeleton width={180} height={12} />
          </VStack>
          <Skeleton width={56} height={32} rounded={300} />
        </HStack>
        <Grid cols={3} gap="100">
          {range(3).map((index) => (
            <VStack key={index} align="center" gap="125" className="pt-175 pb-150">
              <Skeleton width={52} height={52} rounded="full" />
              <Skeleton width={56} height={12} />
            </VStack>
          ))}
        </Grid>
      </VStack>
      <HStack align="center" gap="100" className="h-[46px] border-b border-gray-200 px-200">
        {range(3).map((index) => (
          <HStack key={index} justify="center" className="flex-1">
            <Skeleton width={48} height={14} />
          </HStack>
        ))}
      </HStack>
      <VStack gap="150" className="px-200 pt-225 pb-100">
        <DexSkeletonTitle hintWidth={56} />
        <DexLadderSkeleton />
        <DexNextCardSkeleton />
      </VStack>
      <VStack gap="150" className="px-200 pt-225 pb-100">
        <DexSkeletonTitle />
        <Card.Root padding="none" radius={600} className="overflow-hidden">
          {range(3).map((index) => (
            <HStack
              key={index}
              align="center"
              gap="150"
              className="border-t border-gray-200 px-175 py-150 first:border-t-0"
            >
              <Skeleton width={40} height={40} rounded="full" />
              <VStack gap="075" className="min-w-0 flex-1">
                <HStack align="center" justify="between">
                  <Skeleton width={96} height={16} />
                  <Skeleton width={56} height={8} rounded="full" />
                </HStack>
                <Skeleton width="100%" height={8} rounded="full" />
              </VStack>
            </HStack>
          ))}
        </Card.Root>
      </VStack>
      <VStack gap="150" className="px-200 pt-225 pb-100">
        <DexSkeletonTitle hintWidth={56} />
        <Grid cols={5} gap="075">
          {range(5).map((index) => (
            <VStack
              key={index}
              align="center"
              gap="075"
              className="rounded-500 border border-gray-200 px-025 pt-150 pb-125"
            >
              <Skeleton width={40} height={40} rounded="full" />
              <Skeleton width={32} height={12} />
            </VStack>
          ))}
        </Grid>
        <DexNextCardSkeleton />
      </VStack>
      <VStack gap="150" className="px-200 pt-225 pb-100">
        <DexSkeletonTitle hintWidth={56} />
        <DexLadderSkeleton />
        <DexNextCardSkeleton />
      </VStack>
      <VStack gap="150" className="px-200 pt-225 pb-100">
        <DexSkeletonTitle />
        <Skeleton width="100%" height={132} rounded={600} />
      </VStack>
    </VStack>
  );
}
