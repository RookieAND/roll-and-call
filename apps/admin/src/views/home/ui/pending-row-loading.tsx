import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

export function PendingRowLoading() {
  return (
    <HStack
      align="center"
      gap="150"
      render={<li />}
      className="border-b border-(--rc-color-border-subtle) px-175 py-125 last:border-b-0"
    >
      <Skeleton width={30} height={30} rounded={400} />
      <VStack gap="075" className="min-w-0 flex-1">
        <Skeleton width={120} height={14} />
        <Skeleton width={300} height={12} />
      </VStack>
      <Skeleton width={36} height={16} />
    </HStack>
  );
}
