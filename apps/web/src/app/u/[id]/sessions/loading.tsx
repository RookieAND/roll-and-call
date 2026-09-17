import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 제목의 사용자 이름은 아직 모르므로 앱바 제목은 비운다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        <div className="flex h-11 items-center gap-4 px-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 flex-1" />
        </div>
      </div>
      <Container size="sm">
        <div className="py-5">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
