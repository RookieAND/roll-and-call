import { Skeleton, VStack } from "@trpg/ui";

interface SessionListSkeletonProps {
  count?: number;
}

// SessionCard(버튼 없음)와 같은 높이: p-175 · 제목 heading3 22px · 일정 줄 19px · 룰 칩 줄 20px.
export function SessionListSkeleton({ count = 3 }: SessionListSkeletonProps) {
  return (
    <VStack className="gap-125">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width="100%" height={104} rounded={600} />
      ))}
    </VStack>
  );
}
