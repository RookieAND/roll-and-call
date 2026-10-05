import { Button, HStack, Progress, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { BadgeMedal, type nextBadgeGoal } from "@/entities/badge";
import { LineBreaks, ServerLink } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageBadgesProps {
  heldCount: number;
  goal: ReturnType<typeof nextBadgeGoal>;
}

export function MyPageBadges({ heldCount, goal }: MyPageBadgesProps) {
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center" gap="075">
        <Text typography="heading3" render={<h2 />}>
          업적
        </Text>
        <Text typography="body4" foreground="hint" numeric className="ml-auto">
          {heldCount}개
        </Text>
      </HStack>
      <div className={MY_PAGE_GROUP_CLASS}>
        {goal && (
          <HStack align="center" gap="150" className="p-175">
            <BadgeMedal emoji={goal.emoji} look={1} size="sm" locked />
            <VStack gap="075" className="min-w-0 flex-1">
              <HStack align="baseline" gap="075">
                <Text
                  typography="subtitle2"
                  weight="extrabold"
                  className="min-w-0 flex-1 break-keep"
                >
                  {goal.name}까지 {goal.remaining}
                  {goal.unit}
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
              <Text typography="body4" foreground="muted" className="break-keep">
                <LineBreaks lines={goal.condition.split("\n")} />
              </Text>
            </VStack>
          </HStack>
        )}
        {!goal && heldCount === 0 && (
          <HStack align="center" gap="150" className="p-175">
            <BadgeMedal emoji="🎲" look={1} size="sm" locked />
            <Text typography="body3" foreground="muted" className="min-w-0 flex-1 break-keep">
              첫 세션에 참석해 첫 주사위를 받아 보세요
            </Text>
          </HStack>
        )}
        <Button
          render={<ServerLink path={"/me/badges"} />}
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
