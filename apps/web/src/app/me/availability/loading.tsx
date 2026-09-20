import { Container, HStack, Skeleton, VStack } from "@trpg/ui";

import { WEEKDAY_LABELS } from "@/entities/profile";
import { AppBar } from "@/shared/ui";

export default function Loading() {
  return (
    <Container size="sm" className="px-0">
      <AppBar back="/me/edit" title="가능 시간대" />

      <div className="border-b border-gray-200 px-200 py-175">
        <Skeleton width="100%" height={62} rounded={400} />
      </div>

      <VStack gap="100" className="px-200 py-200">
        <HStack align="baseline" gap="100">
          <Skeleton width={64} height={19} className="flex-none" />
          <Skeleton height={17} className="flex-1" />
        </HStack>
        {WEEKDAY_LABELS.map((label) => (
          <Skeleton key={label} width="100%" height={44} rounded={400} />
        ))}
        <Skeleton width="100%" height={34} />
      </VStack>

      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-200 pt-175 pb-200">
        <HStack gap="100">
          <Skeleton height={50} rounded={500} className="flex-1" />
          <Skeleton height={50} rounded={500} className="flex-1" />
        </HStack>
      </div>
    </Container>
  );
}
