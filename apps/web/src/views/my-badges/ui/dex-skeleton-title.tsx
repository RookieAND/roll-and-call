import { HStack, Skeleton } from "@roll-and-call/ui";

export function DexSkeletonTitle({ hintWidth }: { hintWidth?: number }) {
  return (
    <HStack align="baseline" justify="between">
      <Skeleton width={96} height={18} />
      {hintWidth && <Skeleton width={hintWidth} height={12} />}
    </HStack>
  );
}
