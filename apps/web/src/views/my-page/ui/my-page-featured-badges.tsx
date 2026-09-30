import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BadgePill, monthLabel, type BadgeView } from "@/entities/badge";
import { BadgeDetailSheet, type BadgeDetail } from "@/features/view-badge";

export type FeaturedBadge = BadgeView & { detail: BadgeDetail };

interface MyPageFeaturedBadgesProps {
  badges: FeaturedBadge[];
  heldCount: number;
}

export function MyPageFeaturedBadges({ badges, heldCount }: MyPageFeaturedBadgesProps) {
  return (
    <VStack gap="075">
      <HStack align="center">
        <Text
          typography="body4"
          weight="bold"
          foreground="muted"
          render={<h2 />}
          className="flex-1"
        >
          대표 업적
        </Text>
        <Button render={<Link href="/me/badges" />} variant="ghost" size="sm" className="-mr-100">
          {heldCount}개 모두 보기
          <ChevronRight size={12} strokeWidth={2.2} aria-hidden />
        </Button>
      </HStack>
      <HStack wrap gap="075">
        {badges.map((badge) => (
          <BadgeDetailSheet key={badge.key} detail={badge.detail} className="max-w-full min-w-0">
            <BadgePill
              emoji={badge.emoji}
              name={badge.name}
              grade={badge.grade}
              tag={badge.monthKey && monthLabel(badge.monthKey)}
            />
          </BadgeDetailSheet>
        ))}
      </HStack>
    </VStack>
  );
}
