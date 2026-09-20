import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 제목의 사용자 이름은 아직 모르므로 앱바 제목은 비운다. 칩 줄은 남의 기록이라 없다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        <div className="flex px-200">
          <div className="flex h-11 flex-1 items-center justify-center">
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex h-11 flex-1 items-center justify-center">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
      <Container size="sm">
        <div className="py-250">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
