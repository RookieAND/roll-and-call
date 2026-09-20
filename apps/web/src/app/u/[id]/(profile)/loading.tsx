import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 메모 블록은 로그인한 뷰어에게만 붙고, 두 번째 세션 섹션은 스크롤 아래라 뼈대에서 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <div className="px-4 pt-5 pb-1">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-[27px] w-32" />
              <Skeleton className="mt-1 h-5 w-28" />
            </div>
          </div>
          <Skeleton className="mt-3.5 h-6 w-3/4" />
          <div className="mt-3.5">
            <Skeleton className="mb-2 h-[17px] w-10" />
            <div className="flex gap-1.5">
              <Skeleton className="h-[30px] w-20 rounded-full" />
              <Skeleton className="h-[30px] w-16 rounded-full" />
            </div>
          </div>
        </div>

        <section className="p-4">
          <Skeleton className="mb-2 h-[17px] w-10" />
          <Skeleton className="h-[52px] w-full rounded-500" />
        </section>

        <section className="px-4 pb-4">
          <Skeleton className="mb-2 h-[17px] w-20" />
          <Skeleton className="h-[52px] w-full rounded-500" />
        </section>

        <div className="grid grid-cols-2 border-t border-gray-200">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 border-gray-200 py-3.5 not-first:border-l"
            >
              <Skeleton className="h-[27px] w-6" />
              <Skeleton className="h-[17px] w-16" />
            </div>
          ))}
        </div>

        <div aria-hidden className="h-2 border-y border-gray-200 bg-gray-100" />
        <section className="px-4 py-5">
          <div className="mb-2.5 flex items-baseline gap-2.5">
            <Skeleton className="h-[21px] w-16" />
            <Skeleton className="h-5 w-4" />
          </div>
          <SessionListSkeleton count={2} />
        </section>
      </Container>
    </>
  );
}
