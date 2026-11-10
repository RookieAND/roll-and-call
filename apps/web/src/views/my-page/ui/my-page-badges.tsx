import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { BadgePill, monthLabel, type BadgeView, type nextBadgeGoal } from "@/entities/badge";
import { ServerLink } from "@/shared/ui";

import { MyPageBadgeGoal } from "./my-page-badge-goal";
import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageBadgesProps {
  heldCount: number;
  goal: ReturnType<typeof nextBadgeGoal>;
  recent: Pick<BadgeView, "key" | "name" | "emoji" | "look" | "monthKey">[];
}

export function MyPageBadges({ heldCount, goal, recent }: MyPageBadgesProps) {
  const showRecent = !goal && recent.length > 0;
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="center" gap="075">
        <Text typography="heading3" render={<h2 />}>
          업적
        </Text>
      </HStack>
      <div className={MY_PAGE_GROUP_CLASS}>
        {goal && (
          <MyPageBadgeGoal
            emoji={goal.emoji}
            title={`${goal.name}까지 ${goal.remaining}${goal.unit}`}
            count={goal.count}
            threshold={goal.threshold}
            condition={goal.condition}
            progressLabel={`${goal.name} 진행도`}
          />
        )}
        {showRecent && (
          <VStack gap="100" className="p-175">
            <Text typography="body4" foreground="muted">
              최근에 받은 업적입니다
            </Text>
            <HStack wrap gap="075">
              {recent.map((badge) => (
                <BadgePill
                  key={`${badge.key}:${badge.name}`}
                  emoji={badge.emoji}
                  name={badge.name}
                  look={badge.look}
                  tag={badge.monthKey && monthLabel(badge.monthKey)}
                />
              ))}
            </HStack>
          </VStack>
        )}
        {!goal && heldCount === 0 && (
          <MyPageBadgeGoal
            emoji="🎲"
            title="첫 주사위"
            count={0}
            threshold={1}
            condition="첫 세션에 참석하면 첫 뱃지를 받습니다"
            progressLabel="첫 주사위 진행도"
          />
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
