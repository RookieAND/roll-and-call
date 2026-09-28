import { Skeleton, VStack } from "@roll-and-call/ui";

interface MyPageBlockSkeletonProps {
  titleWidth: number;
  height: number;
}

// 제목 한 줄과 테두리 상자 하나로 된 구역의 뼈대.
export function MyPageBlockSkeleton({ titleWidth, height }: MyPageBlockSkeletonProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Skeleton width={titleWidth} height={22} />
      <Skeleton width="100%" height={height} rounded={600} />
    </VStack>
  );
}
