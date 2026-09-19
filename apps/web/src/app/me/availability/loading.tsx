import { Container, Skeleton, VStack } from "@trpg/ui";

import { WEEKDAY_LABELS } from "@/entities/profile";
import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <Container size="sm" className="px-0">
      <AppBar back="/me/edit" title="가능 시간대" />

      <div className="border-b border-gray-200 px-4 py-3.5">
        <Skeleton className="h-[62px] w-full rounded-[11px]" />
      </div>

      <VStack gap={2} className="px-4 py-4">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-[19px] w-16 flex-none" />
          <Skeleton className="h-[17px] flex-1" />
        </div>
        {WEEKDAY_LABELS.map((label) => (
          <Skeleton key={label} className="h-11 w-full rounded-[11px]" />
        ))}
        <Skeleton className="h-[34px] w-full" />
      </VStack>

      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-4 pt-3.5 pb-4">
        <div className="flex gap-2">
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
          <Skeleton className="h-[50px] flex-1 rounded-xl" />
        </div>
      </div>
    </Container>
  );
}
