import { Skeleton, VStack } from "@roll-and-call/ui";

import { CandidateRowSkeleton } from "./candidate-row-skeleton";

// 줄마다 폭을 달리해 실제 이름·소개 길이처럼 보이게 한다.
const ROWS = [
  { nameWidth: "46%", bioWidth: "78%" },
  { nameWidth: "38%", bioWidth: "62%" },
  { nameWidth: "52%", bioWidth: "70%" },
  { nameWidth: "42%", bioWidth: "56%" },
] as const;

export function CandidateSearchSkeleton() {
  return (
    <VStack gap={0} aria-busy aria-label="사람을 찾는 중" className="pb-125">
      <div className="px-250 pb-125">
        <Skeleton width={74} height={12} />
      </div>
      {ROWS.map((row) => (
        <CandidateRowSkeleton key={row.nameWidth} {...row} />
      ))}
    </VStack>
  );
}
