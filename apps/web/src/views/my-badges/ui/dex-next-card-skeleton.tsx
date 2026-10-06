import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

export function DexNextCardSkeleton() {
  return (
    <VStack gap="075" className="rounded-500 border border-gray-200 p-150">
      <HStack align="baseline" justify="between">
        <Skeleton width={140} height={14} />
        <Skeleton width={48} height={12} />
      </HStack>
      <Skeleton width="100%" height={8} rounded="full" />
    </VStack>
  );
}
