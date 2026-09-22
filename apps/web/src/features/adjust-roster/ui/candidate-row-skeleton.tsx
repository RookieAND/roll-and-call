import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

interface CandidateRowSkeletonProps {
  nameWidth: string;
  bioWidth: string;
}

export function CandidateRowSkeleton({ nameWidth, bioWidth }: CandidateRowSkeletonProps) {
  return (
    <HStack align="center" gap="150" className="min-h-[62px] px-250 py-100">
      <Skeleton width={36} height={36} rounded="full" />
      <VStack gap="100" className="min-w-0 flex-1">
        <Skeleton width={nameWidth} height={14} />
        <Skeleton width={bioWidth} height={12} />
      </VStack>
      <Skeleton width={22} height={22} />
    </HStack>
  );
}
