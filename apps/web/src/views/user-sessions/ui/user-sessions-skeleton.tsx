import { Container, HStack, Skeleton } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

export function UserSessionsSkeleton() {
  return (
    <>
      <AppBar back="/games" title="" />
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) bg-surface">
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
