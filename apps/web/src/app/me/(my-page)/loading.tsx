import { Container, Skeleton, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 할 일 카드는 있을 때만 그려지므로 뼈대에서는 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar title="마이페이지" />
      <Container size="sm">
        <VStack gap={5} className="py-[18px]">
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center gap-[13px]">
              <Skeleton className="h-[60px] w-[60px] rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-[25px] w-28" />
                <Skeleton className="mt-[3px] h-5 w-44" />
              </div>
              <Skeleton className="h-9 w-[52px] flex-none rounded-[10px]" />
            </div>
            <div>
              <Skeleton className="mb-2 h-[17px] w-10" />
              <div className="flex gap-1.5">
                <Skeleton className="h-[30px] w-20 rounded-full" />
                <Skeleton className="h-[30px] w-16 rounded-full" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-2 h-[17px] w-20" />
              <Skeleton className="h-[52px] w-full rounded-xl" />
            </div>
          </section>

          <section className="flex flex-col gap-2.5">
            <Skeleton className="h-[22px] w-16" />
            <Skeleton className="h-[120px] w-full rounded-[14px]" />
          </section>

          <section>
            <Skeleton className="mb-2.5 h-[22px] w-10" />
            <Skeleton className="h-[52px] w-full rounded-xl" />
          </section>

          <section className="flex flex-col gap-2.5">
            <Skeleton className="h-[22px] w-10" />
            <Skeleton className="h-[104px] w-full rounded-[14px]" />
          </section>
        </VStack>
      </Container>
    </>
  );
}
