import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

const ROSTER_ROW_COUNT = 3;

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <VStack gap={2}>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-[17px] w-60" />
          </VStack>

          <VStack gap={2}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-14" />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {Array.from({ length: ROSTER_ROW_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-h-14 items-center gap-3 border-t border-gray-100 px-3 py-2 first:border-t-0"
                >
                  <Skeleton className="h-4 w-5" />
                  <Skeleton className="h-[34px] w-[34px] rounded-full" />
                  <Skeleton className="h-[17px] w-24" />
                </div>
              ))}
            </div>
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
