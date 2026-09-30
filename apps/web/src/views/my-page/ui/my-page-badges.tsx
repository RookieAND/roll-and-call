import { Button, HStack, Progress, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BadgeMedal, type nextBadgeGoal } from "@/entities/badge";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageBadgesProps {
  heldCount: number;
  hasNew: boolean;
  goal: ReturnType<typeof nextBadgeGoal>;
}

// 받은 뱃지 목록은 도감 몫이라 여기서는 다음 뱃지 하나만 보여준다.
export function MyPageBadges({ heldCount, hasNew, goal }: MyPageBadgesProps) {
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center" gap="075">
        <Text typography="heading3" render={<h2 />}>
          업적
        </Text>
        {hasNew && (
          <span role="img" aria-label="새 뱃지" className="size-[7px] rounded-full bg-danger-600" />
        )}
        <Text typography="body4" foreground="hint" numeric className="ml-auto">
          {heldCount}개
        </Text>
      </HStack>
      <div className={MY_PAGE_GROUP_CLASS}>
        {goal && (
          <HStack align="center" gap="150" className="p-175">
            <BadgeMedal emoji={goal.emoji} grade={1} size="sm" locked />
            <VStack gap="075" className="min-w-0 flex-1">
              <HStack align="baseline" gap="075">
                <Text typography="subtitle2" weight="extrabold" className="min-w-0 flex-1">
                  {goal.count === 0 ? goal.name : `${goal.name}까지 ${goal.remaining}회`}
                </Text>
                <Text typography="body4" foreground="hint" numeric>
                  {goal.count} / {goal.threshold}
                </Text>
              </HStack>
              <Progress
                value={goal.count}
                max={goal.threshold}
                aria-label={`${goal.name} 진행도`}
              />
              <Text typography="body4" foreground="muted">
                {goal.condition}
              </Text>
            </VStack>
          </HStack>
        )}
        <Button
          render={<Link href="/me/badges" />}
          variant="ghost"
          colorPalette="primary"
          className="min-h-[46px] w-full rounded-none border-gray-200 not-first:border-t"
        >
          업적 도감 보기
          <ChevronRight size={14} strokeWidth={2} aria-hidden />
        </Button>
      </div>
    </VStack>
  );
}
