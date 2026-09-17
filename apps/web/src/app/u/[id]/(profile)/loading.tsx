import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 성향 박스와 첫 섹션 아래 섹션들은 있을 때만·스크롤 아래라 뼈대에서 뺀다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <Container size="sm" className="px-0">
        <div className="px-4 pt-5 pb-1">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-[25px] w-32" />
              <Skeleton className="mt-[3px] h-5 w-28" />
            </div>
          </div>
          <Skeleton className="mt-3.5 h-6 w-3/4" />
        </div>

        <section className="p-4">
          <Skeleton className="mb-2 h-[17px] w-24" />
          <div className="flex gap-1.5">
            <Skeleton className="h-[34px] w-16 rounded-full" />
            <Skeleton className="h-[34px] w-16 rounded-full" />
            <Skeleton className="h-[34px] w-16 rounded-full" />
          </div>
        </section>

        <div className="grid grid-cols-3 border-t border-gray-200">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 border-gray-200 py-3.5 not-first:border-l"
            >
              <Skeleton className="h-[25px] w-6" />
              <Skeleton className="h-[17px] w-16" />
            </div>
          ))}
        </div>

        <div aria-hidden className="h-2 border-y border-gray-200 bg-gray-100" />
        <section className="px-4 py-5">
          <Skeleton className="mb-2.5 h-[21px] w-24" />
          <SessionListSkeleton count={2} />
        </section>
      </Container>
    </>
  );
}
