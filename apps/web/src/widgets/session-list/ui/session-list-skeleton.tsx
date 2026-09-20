import { Skeleton, VStack } from "@trpg/ui";

interface SessionListSkeletonProps {
  count?: number;
}

// SessionCard(버튼 없음)와 같은 높이: p-175 · 제목 줄 21px · 일정 body3 20px · 메타 body4 17px.
export function SessionListSkeleton({ count = 3 }: SessionListSkeletonProps) {
  return (
    <VStack className="gap-125">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width="100%" height={92} rounded={600} />
      ))}
    </VStack>
  );
}
