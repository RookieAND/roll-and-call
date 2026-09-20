import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

const CANDIDATE_COUNT = 3;

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="세션 시간 결정" />
      <Container size="sm">
        <VStack gap={5} className="pt-4 pb-4">
          <div className="flex gap-2">
            <Skeleton className="h-[70px] flex-1 rounded-500" />
            <Skeleton className="h-[70px] flex-1 rounded-500" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 min-w-0 flex-1 rounded-400" />
            <Skeleton className="h-11 w-[152px] shrink-0 rounded-400" />
          </div>
          <div className="overflow-hidden rounded-500 border border-gray-200">
            {Array.from({ length: CANDIDATE_COUNT }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-gray-100 px-3 py-2.5 not-first:border-t"
              >
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-[21px] w-44" />
                  <Skeleton className="mt-0.5 h-5 w-28" />
                </div>
                <Skeleton className="h-8 w-8 shrink-0 rounded-200" />
              </div>
            ))}
          </div>
        </VStack>
      </Container>
    </>
  );
}
