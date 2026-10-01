import { Skeleton, VStack } from "@roll-and-call/ui";

interface MyPageBlockSkeletonProps {
  titleWidth: number;
  height: number;
}

export function MyPageBlockSkeleton({ titleWidth, height }: MyPageBlockSkeletonProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Skeleton width={titleWidth} height={22} />
      <Skeleton width="100%" height={height} rounded={600} />
    </VStack>
  );
}
