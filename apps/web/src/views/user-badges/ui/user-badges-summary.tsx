import { HStack, Text, VStack } from "@roll-and-call/ui";

import { BADGE_TABS, type BadgeTab } from "@/entities/badge";

interface UserBadgesSummaryProps {
  name: string;
  counts: Record<BadgeTab, number>;
}

export function UserBadgesSummary({ name, counts }: UserBadgesSummaryProps) {
  return (
    <VStack gap="150" className="overflow-clip rounded-700 border border-gray-200 bg-surface p-200">
      <Text typography="heading3" render={<h2 />}>
        {name}님의 업적
      </Text>
      <VStack render={<dl />}>
        {BADGE_TABS.map((badgeTab) => (
          <HStack
            key={badgeTab.key}
            align="baseline"
            gap="100"
            className="border-t border-gray-200 py-100"
          >
            <Text typography="body3" foreground="muted" render={<dt />} className="flex-1">
              {badgeTab.label}
            </Text>
            <Text typography="body3" weight="bold" numeric render={<dd />}>
              {counts[badgeTab.key]}개
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
