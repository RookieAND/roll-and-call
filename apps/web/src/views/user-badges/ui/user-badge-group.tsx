import type { BadgeLook } from "@roll-and-call/database/badges/model";
import { Card, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet, type BadgeDetail } from "@/features/view-badge";

interface UserBadgeGroupProps {
  title: string;
  rows: {
    key: string;
    emoji: string;
    look: BadgeLook;
    name: string;
    requirement: string;
    dateLabel: string;
    detail: BadgeDetail;
  }[];
}

export function UserBadgeGroup({ title, rows }: UserBadgeGroupProps) {
  return (
    <VStack gap="100" render={<section />} className="pt-175">
      <Text typography="body4" weight="bold" foreground="muted" render={<h2 />}>
        {title}
      </Text>
      <Card.Root padding="none" radius={600} className="overflow-hidden">
        {rows.map((row) => (
          <BadgeDetailSheet
            key={row.key}
            detail={row.detail}
            className="flex min-h-16 w-full items-center gap-150 border-t border-gray-200 px-175 py-125 text-left first:border-t-0 hover:bg-gray-50"
          >
            <BadgeMedal emoji={row.emoji} look={row.look} size="sm" />
            <VStack gap="025" className="min-w-0 flex-1">
              <Text typography="subtitle1" weight="extrabold" truncate>
                {row.name}
              </Text>
              <Text typography="body4" foreground="muted">
                {row.requirement}
              </Text>
            </VStack>
            <Text typography="body4" foreground="hint" numeric>
              {row.dateLabel}
            </Text>
          </BadgeDetailSheet>
        ))}
      </Card.Root>
    </VStack>
  );
}
