import { HStack, Skeleton } from "@roll-and-call/ui";

interface DexSkeletonTitleProps {
  hintWidth?: number;
}

export function DexSkeletonTitle({ hintWidth }: DexSkeletonTitleProps) {
  return (
    <HStack align="baseline" justify="between">
      <Skeleton width={96} height={18} />
      {hintWidth && <Skeleton width={hintWidth} height={12} />}
    </HStack>
  );
}
