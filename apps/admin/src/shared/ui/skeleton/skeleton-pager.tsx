import { HStack, Skeleton } from "@roll-and-call/ui";

const PAGE_BUTTONS = [0, 1, 2, 3, 4];

export function SkeletonPager() {
  return (
    <HStack
      align="center"
      className="shrink-0 border-t border-(--rc-color-border-subtle) px-175 py-150"
    >
      <Skeleton width={120} height={12} />
      <HStack gap="075" className="ml-auto">
        {PAGE_BUTTONS.map((index) => (
          <Skeleton key={index} width={32} height={32} rounded={300} />
        ))}
      </HStack>
    </HStack>
  );
}
