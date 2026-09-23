import { Container, HStack, Skeleton } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 제목의 사용자 이름은 아직 모르므로 앱바 제목은 비운다. 칩 줄은 남의 기록이라 없다.
export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="" />
      <div className="sticky top-(--rc-size-appbar) z-10 border-b border-gray-100 bg-surface">
        <HStack className="px-200">
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
        </HStack>
      </div>
      <Container size="sm">
        <div className="py-250">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
