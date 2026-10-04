import { Skeleton, VStack } from "@roll-and-call/ui";

import { NotificationRowsSkeleton } from "./notification-rows-skeleton";

export function InboxSkeleton() {
  return (
    <VStack>
      <Skeleton width={48} height={12} className="mx-200 mt-175 mb-075" />
      <NotificationRowsSkeleton count={3} />
    </VStack>
  );
}
