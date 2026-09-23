import { Container, HStack, Skeleton } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 기본 탭(참여)의 칩 5개. 탭·칩 라벨은 건수를 알아야 해서 셰이머로 둔다.
const CHIP_WIDTHS = ["w-16", "w-16", "w-12", "w-12", "w-12"];

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) border-b border-gray-200 bg-surface pb-150">
        <HStack className="px-200">
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
          <HStack align="center" justify="center" className="h-11 flex-1">
            <Skeleton width={64} height={20} />
          </HStack>
        </HStack>
        <HStack gap="075" className="px-200 pt-175">
          {CHIP_WIDTHS.map((width, index) => (
            <Skeleton key={index} height={32} rounded="full" className={width} />
          ))}
        </HStack>
      </div>
      <Container size="sm">
        <div className="py-150">
          <SessionListSkeleton />
        </div>
      </Container>
    </>
  );
}
