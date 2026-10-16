import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { SESSION_GRID_CLASS } from "./session-grid-class";

interface SessionListSkeletonProps {
  count?: number;
}

// 모바일은 SessionCard(버튼 없음)와 같은 높이: p-150 · 제목 heading3 22px · 일정 줄 19px · GM 줄 24px.
// 1100px 이상은 세로 카드 모양(위 16:9 썸네일, 배지·제목·일정·GM)을 그린다.
export function SessionListSkeleton({ count = 3 }: SessionListSkeletonProps) {
  return (
    <VStack className={`gap-125 ${SESSION_GRID_CLASS}`}>
      {range(count).map((index) => (
        <div key={index} className="contents">
          <Skeleton width="100%" height={118} rounded={600} className="desktop:hidden" />
          <Card.Root
            radius={600}
            background="none"
            padding="none"
            className="hidden overflow-hidden desktop:flex desktop:flex-col"
          >
            <Skeleton width="100%" rounded="none" className="aspect-video" />
            <VStack gap="100" className="px-175 pt-175 pb-175">
              <Skeleton width={56} height={24} rounded={300} />
              <Skeleton width="60%" height={26} />
              <Skeleton width="45%" height={19} />
              <HStack align="center" gap="075">
                <Skeleton width={24} height={24} rounded="full" />
                <Skeleton width={96} height={19} />
              </HStack>
            </VStack>
          </Card.Root>
        </div>
      ))}
    </VStack>
  );
}
