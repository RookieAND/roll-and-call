import { Container, Skeleton } from "@trpg/ui";

import { AppBar } from "@/shared/ui";
import { SessionListSkeleton } from "@/widgets/session-list";

// 기본 탭(참여)의 칩 5개. 탭·칩 라벨은 건수를 알아야 해서 셰이머로 둔다.
const CHIP_WIDTHS = ["w-16", "w-16", "w-12", "w-12", "w-12"];

export default function Loading() {
  return (
    <>
      <AppBar back="/me" title="내 세션" />
      <div className="sticky top-[52px] z-10 border-b border-gray-100 bg-surface">
        <div className="flex px-4">
          <div className="flex h-11 flex-1 items-center justify-center">
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex h-11 flex-1 items-center justify-center">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="flex gap-1.5 px-4 py-2.5">
          {CHIP_WIDTHS.map((width, index) => (
            <Skeleton key={index} className={`h-[34px] rounded-full ${width}`} />
          ))}
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
