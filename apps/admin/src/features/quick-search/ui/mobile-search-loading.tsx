import { Skeleton, VStack } from "@roll-and-call/ui";

const ROWS = [0, 1] as const;

export function MobileSearchLoading() {
  return (
    <VStack aria-busy aria-label="찾는 중" className="pt-125">
      {ROWS.map((row) => (
        <VStack
          key={row}
          gap="075"
          className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-150"
        >
          <Skeleton width="40%" height={20} />
          <Skeleton width="70%" height={16} />
        </VStack>
      ))}
    </VStack>
  );
}
