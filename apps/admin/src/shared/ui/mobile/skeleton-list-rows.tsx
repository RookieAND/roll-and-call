import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

interface SkeletonListRowsProps {
  count?: number;
}

// ListRow와 같은 틀에 서버 값 자리만 비운다.
export function SkeletonListRows({ count = 6 }: SkeletonListRowsProps) {
  return Array.from({ length: count }, (_, index) => (
    <VStack
      key={index}
      gap="050"
      className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-175"
    >
      <HStack align="center" justify="between" className="min-h-6">
        <Skeleton width={120} height={16} />
        <Skeleton width={48} height={14} />
      </HStack>
      <Skeleton width="64%" height={14} />
      <Skeleton width="40%" height={12} />
    </VStack>
  ));
}
