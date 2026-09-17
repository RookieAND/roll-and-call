import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        <div className="flex h-11 items-center gap-4 px-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 flex-1" />
        </div>
        <div className="flex gap-1.5 px-4 py-2.5">
          <Skeleton className="h-[34px] w-14 rounded-full" />
          <Skeleton className="h-[34px] w-16 rounded-full" />
          <Skeleton className="h-[34px] w-16 rounded-full" />
        </div>
      </div>
      <Container size="sm">
        <div className="py-3">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
