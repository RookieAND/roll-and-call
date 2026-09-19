import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

// 달력은 대부분의 달이 5주라 35칸으로 잡는다. 6주인 달만 로딩 후 한 줄 늘어난다.
const CALENDAR_CELL_COUNT = 35;

export function HomeSkeleton() {
  return (
    <>
      <AppBar title="롤앤콜" brand />
      <Container size="sm" className="px-0">
        <section>
          <div className="flex items-center gap-2 pt-3.5 pr-2.5 pb-2.5 pl-4">
            <div className="flex-1">
              <Skeleton className="h-[25px] w-32" />
            </div>
            <Skeleton className="h-10 w-[124px]" />
          </div>
          <div className="px-3 pb-1">
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid grid-cols-7 gap-px px-3 pb-3">
            {Array.from({ length: CALENDAR_CELL_COUNT }).map((_, index) => (
              <Skeleton key={index} className="h-[62px] rounded-lg" />
            ))}
          </div>
          <div className="px-4 pb-3">
            <Skeleton className="h-4 w-40" />
          </div>
        </section>

        <section className="border-t border-gray-200 p-4">
          <Skeleton className="mb-[11px] h-[22px] w-32" />
          <Skeleton className="h-[74px] w-full rounded-[13px]" />
        </section>

        <section className="border-t border-gray-200 px-4 pt-[18px] pb-5">
          <Skeleton className="h-[23px] w-24" />
          <Skeleton className="mt-1 mb-4 h-[17px] w-48" />
          <Skeleton className="h-[130px] rounded-[14px]" />
          <Skeleton className="mt-4 h-[130px] rounded-[14px]" />
        </section>
      </Container>
    </>
  );
}
