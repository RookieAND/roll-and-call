import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 할 일 카드는 있을 때만 그려지므로 뼈대에서는 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap="250" className="py-225">
          <section className="flex flex-col gap-175">
            <div className="flex items-center gap-175">
              <Skeleton className="h-[60px] w-[60px] rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-[25px] w-28" />
                <Skeleton className="mt-050 h-5 w-44" />
              </div>
              <Skeleton className="h-9 w-[52px] flex-none rounded-400" />
            </div>
            <div>
              <Skeleton className="mb-100 h-[17px] w-10" />
              <div className="flex gap-075">
                <Skeleton className="h-[30px] w-20 rounded-full" />
                <Skeleton className="h-[30px] w-16 rounded-full" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-100 h-[17px] w-20" />
              <Skeleton className="h-[52px] w-full rounded-500" />
            </div>
          </section>

          <section className="flex flex-col gap-125">
            <Skeleton className="h-[22px] w-16" />
            <Skeleton className="h-[120px] w-full rounded-600" />
          </section>

          <section>
            <Skeleton className="mb-125 h-[22px] w-10" />
            <Skeleton className="h-[52px] w-full rounded-500" />
          </section>

          <section className="flex flex-col gap-125">
            <Skeleton className="h-[22px] w-10" />
            <Skeleton className="h-[104px] w-full rounded-600" />
          </section>
        </VStack>
      </Container>
    </>
  );
}
