import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 높이는 GameDetail의 실제 줄 높이를 따른다. 한쪽만 바꾸면 로딩 후 레이아웃이 튄다.
const INFO_ROWS = ["w-24", "w-28", "w-32", "w-32"];

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="구인 상세" />
      <Container size="md" className="px-0">
        <VStack gap="200">
          <Skeleton className="h-42 w-full rounded-none" />

          <VStack gap="250" className="px-200 pb-100">
            <div>
              <div className="flex items-start justify-between gap-100">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="mt-025 h-[21px] w-14 rounded-300" />
              </div>
              <Skeleton className="mt-050 h-5 w-44" />
            </div>

            <div className="overflow-hidden rounded-600 border border-gray-200">
              {INFO_ROWS.map((width) => (
                <div
                  key={width}
                  className="flex min-h-12 items-center gap-150 border-b border-gray-100 px-200 py-100 last:border-b-0"
                >
                  <Skeleton className="h-5 w-12 shrink-0" />
                  <Skeleton className={`h-5 ${width}`} />
                </div>
              ))}
            </div>

            <VStack gap="100">
              <Skeleton className="h-[22px] w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </VStack>

            <VStack gap="100">
              <Skeleton className="h-[22px] w-20" />
              <Skeleton className="h-[74px] w-full rounded-500" />
            </VStack>

            <VStack className="gap-125">
              <div className="flex items-center gap-100">
                <Skeleton className="h-[22px] w-16" />
                <Skeleton className="h-5 w-10" />
                <span className="flex-1" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
            </VStack>
          </VStack>

          <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-200 pt-175 pb-200">
            <Skeleton className="h-[50px] w-full rounded-500" />
          </div>
        </VStack>
      </Container>
    </>
  );
}
