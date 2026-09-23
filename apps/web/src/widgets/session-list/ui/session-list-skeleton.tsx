import { Skeleton, VStack } from "@roll-and-call/ui";

interface SessionListSkeletonProps {
  count?: number;
}

// SessionCard(버튼 없음)와 같은 높이: p-150 · 제목 heading3 22px · 일정 줄 19px · GM 줄 24px.
export function SessionListSkeleton({ count = 3 }: SessionListSkeletonProps) {
  return (
    <VStack className="gap-125">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width="100%" height={118} rounded={600} />
      ))}
    </VStack>
  );
}
