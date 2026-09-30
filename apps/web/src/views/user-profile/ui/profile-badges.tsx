import { HStack, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BadgePill, monthLabel, type BadgeView } from "@/entities/badge";
import { BadgeDetailSheet, type BadgeDetail } from "@/features/view-badge";

import { ProfileBlockLabel } from "./profile-block-label";

export type ProfileFeaturedBadge = BadgeView & { detail: BadgeDetail };

interface ProfileBadgesProps {
  userId: string;
  featured: ProfileFeaturedBadge[];
  total: number;
}

export function ProfileBadges({ userId, featured, total }: ProfileBadgesProps) {
  return (
    <div>
      <HStack align="center" justify="between">
        <ProfileBlockLabel label="대표 업적" />
        <Text
          weight="bold"
          typography="body4"
          foreground="muted"
          render={<Link href={`/u/${userId}/badges`} />}
          className="mb-100 inline-flex min-h-7 items-center gap-025"
        >
          {total}개 모두 보기
          <ChevronRight size={12} strokeWidth={2.2} aria-hidden />
        </Text>
      </HStack>
      <HStack wrap gap="075">
        {featured.map((badge) => (
          <BadgeDetailSheet key={badge.key} detail={badge.detail} className="max-w-full min-w-0">
            <BadgePill
              emoji={badge.emoji}
              name={badge.name}
              look={badge.look}
              tag={badge.monthKey ? monthLabel(badge.monthKey) : null}
            />
          </BadgeDetailSheet>
        ))}
      </HStack>
    </div>
  );
}
