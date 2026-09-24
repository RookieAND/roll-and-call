import { HStack, Skeleton } from "@roll-and-call/ui";

const HEIGHT_RATIOS = [0.42, 0.5, 0.46, 0.58, 0.52, 0.64, 0.6, 0.7, 0.66, 0.74, 0.5, 0.36];

interface SkeletonBarsProps {
  // 최대 12개
  count: number;
  height: number;
  maxWidth?: number;
}

export function SkeletonBars({ count, height, maxWidth = 64 }: SkeletonBarsProps) {
  return (
    <HStack align="end" gap="150" className="border-b border-gray-200" style={{ height }}>
      {HEIGHT_RATIOS.slice(0, count).map((ratio, index) => (
        <HStack key={index} justify="center" className="min-w-0 flex-1">
          <Skeleton
            width="100%"
            height={Math.round(ratio * height)}
            rounded={200}
            style={{ maxWidth }}
          />
        </HStack>
      ))}
    </HStack>
  );
}
